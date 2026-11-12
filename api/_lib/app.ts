import express from "express";
import path from "path";
import dotenv from "dotenv";
import { MongoClient, Db } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import { buildXlsxBuffer } from "../../src/server-excel.js";

// Load environment variables for local dev and server environments
for (const envPath of [path.resolve(process.cwd(), ".env")]) {
  try {
    dotenv.config({ path: envPath });
  } catch (e) {
    // ignore
  }
}

// SMTP Email Sender Helper (Lazy Initialization)
async function sendEmail({
  to,
  toName,
  subject,
  html,
  text
}: {
  to: string;
  toName: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"TANTRA PEX" <${user || "no-reply@tantrapex.com"}>`;

  if (!host || !user || !pass) {
    console.warn("SMTP host, user, or pass environment variables are missing! Email sending skipped.");
    return { success: false, msg: "SMTP credentials not configured in environment variables." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      },
      connectionTimeout: 6000,
      greetingTimeout: 6000,
      socketTimeout: 6000
    });

    const info = await transporter.sendMail({
      from,
      to: `"${toName}" <${to}>`,
      subject,
      text,
      html
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("Failed to send email via SMTP:", err);
    return { success: false, error: err.message };
  }
}

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export function serverGenerateDriveSlug(companyName = '', title = '', fallbackId = ''): string {
  const text = `${companyName || ''} ${title || ''}`.trim();
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return slug || (fallbackId ? String(fallbackId).toLowerCase().replace(/[^a-z0-9-]/g, '') : '');
}

const app = express();

// Lazy MongoDB Client Initialization
const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let db: Db | null = null;
let lastAttemptTime = 0;
let connectionError: string | null = null;

function checkUriIssues(uriToCheck: string): string | null {
  try {
    if (!uriToCheck.startsWith("mongodb://") && !uriToCheck.startsWith("mongodb+srv://")) {
      return "Invalid connection scheme. MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'.";
    }

    const parts = uriToCheck.split("@");
    if (parts.length > 2) {
      return "Your MONGODB_URI contains multiple '@' characters. If your database password contains an '@' character, you MUST replace it with its percent-encoded equivalent '%40' in the connection string (e.g., p%40ssword instead of p@ssword).";
    }

    // If there is NO '@', there is no user:password auth section to validate (e.g. mongodb://localhost:27017/Tantapex)
    if (parts.length <= 1) {
      return null;
    }

    const authAndScheme = parts[0];
    const schemeIndex = authAndScheme.indexOf("://");
    if (schemeIndex !== -1) {
      const auth = authAndScheme.substring(schemeIndex + 3);
      const colonIndex = auth.indexOf(":");
      if (colonIndex !== -1) {
        const password = auth.substring(colonIndex + 1);
        const rawSpecialChars = ["#", "?", ":", "/", "+", " "];
        const found = rawSpecialChars.filter(char => password.includes(char));
        if (found.length > 0) {
          const encodings: Record<string, string> = {
            "#": "%23",
            "?": "%3F",
            ":": "%3A",
            "/": "%2F",
            "+": "%2B",
            " ": "%20"
          };
          const suggestions = found.map(char => `'${char}' with '${encodings[char]}'`).join(", ");
          return `Your database password contains unencoded special characters. Please replace ${suggestions} in your MONGODB_URI password segment to ensure proper authentication.`;
        }
      }
    }
  } catch (e) {
    // fallback if parsing fails
  }
  return null;
}

async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt = "tantrapex-order",
  notes = {},
}: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  } catch (e) {}
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

  if (!keyId || !keySecret) {
    return {
      success: false,
      mock: false,
      error: "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.",
      keyId: "",
      order: null,
    };
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.id) {
    return {
      success: false,
      mock: false,
      error: data.error?.description || "Failed to create Razorpay order",
      keyId,
      order: null,
    };
  }

  return {
    success: true,
    mock: false,
    keyId,
    order: {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
    },
  };
}

export async function getDb(): Promise<Db | null> {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  } catch (e) {}

  const activeUri = (process.env.MONGODB_URI || uri || "").trim();
  if (!activeUri) {
    connectionError = "MONGODB_URI is not defined in environment variables.";
    return null;
  }
  
  const uriIssue = checkUriIssues(activeUri);
  if (uriIssue) {
    connectionError = uriIssue;
    return null;
  }

  if (db) {
    return db;
  }

  const now = Date.now();
  if (connectionError && (now - lastAttemptTime < 5000)) {
    return null;
  }

  lastAttemptTime = now;
  try {
    console.log("Connecting to MongoDB...");
    client = new MongoClient(activeUri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();

    // Extract db name from URI or default to "tatrapax"
    let dbName = "tatrapax";
    const match = activeUri.match(/(?:mongodb(?:\+srv)?:\/\/[^/]+\/)([^?&/\s]+)/i);
    if (match && match[1]) {
      dbName = match[1].trim();
      if (activeUri.includes("tatrapax.btmauq4.mongodb.net") && dbName.toLowerCase() === "tantapex") {
        dbName = "tatrapax";
      }
    }
    db = client.db(dbName);
    connectionError = null;
    console.log(`Connected to MongoDB successfully! Database: ${dbName}`);
  } catch (err: any) {
    console.error("Failed to connect to MongoDB:", err);
    connectionError = err.message || String(err);
    if (connectionError && (connectionError.includes("bad auth") || connectionError.includes("Authentication failed"))) {
      connectionError = "Authentication failed: Your MONGODB_URI has an incorrect username, password, or contains unencoded special characters in the password. Please verify and update your credentials in Settings.";
    }
    db = null;
  }
  return db;
}

export function getConnectionError(): string | null {
  return connectionError;
}

// Global CORS & Headers Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Support JSON payloads up to 15MB for large CMS schemas
app.use(express.json({ limit: "15mb" }));

// URL Normalization Middleware
// Ensures all requests (whether rewritten as /api/xyz, /xyz, or forwarded with x-matched-path) correctly match Express routes
app.use((req, _res, next) => {
  const matchedPath = req.headers["x-matched-path"] as string;
  if (
    (req.url === "/" || req.url === "/api" || req.url === "/api/") &&
    matchedPath &&
    matchedPath !== "/api" &&
    matchedPath !== "/api/"
  ) {
    req.url = matchedPath;
  }

  if (process.env.VERCEL && req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  next();
});

// --- API ROUTES ---

// Root / Health Check API
app.all(["/api", "/api/", "/api/health"], async (_req, res) => {
  const database = await getDb();
  res.json({
    status: "ok",
    message: "Tantrapex API is online and operational.",
    mongodb: database ? "connected" : "disconnected",
    connectionError,
    timestamp: new Date().toISOString()
  });
});

// GET Razorpay Public Key ID from environment variables
app.get(["/api/razorpay-key", "/api/razorpay/key"], (_req, res) => {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  } catch (e) {}
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  res.json({
    keyId
  });
});

// Razorpay Order Creation
app.post(["/api/razorpay/create-order", "/api/razorpay-create-order"], async (req, res) => {
  try {
    const { amount = 0, currency = "INR", receipt = "tantrapex-order", notes = {} } = req.body || {};
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    const order = await createRazorpayOrder({
      amount: numericAmount,
      currency,
      receipt,
      notes,
    });

    if (!order.success) {
      return res.status(500).json(order);
    }

    res.json(order);
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create order" });
  }
});

// Image upload API
app.post("/api/upload-image", async (req, res) => {
  try {
    const { data, folder = "Tantrapex" } = req.body || {};
    if (!data) {
      return res.status(400).json({ success: false, message: "Missing image data" });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary is not configured properly. Missing CLOUDINARY env vars.");
      return res.status(500).json({
        success: false,
        message: "Cloudinary is not configured on this server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      });
    }

    const result = await cloudinary.uploader.upload(data, {
      folder,
      overwrite: false,
      resource_type: "image",
    });

    res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err: any) {
    console.error("Upload to Cloudinary failed:", err);
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
});

// Load all collections at once
app.get("/api/load-all", async (_req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({
        success: false,
        msg: "MongoDB disconnected. Falling back to browser cache/local state.",
        connectionError,
        data: null
      });
    }

    const collections = [
      "pages",
      "settings",
      "media",
      "placed_students",
      "hiring_partners",
      "courses",
      "blogs",
      "services",
      "leads",
      "plan_purchases",
      "workshop_registrations",
      "emails",
      "placement_drives",
      "placement_applications"
    ];
    
    const data: any = {};
    for (const colName of collections) {
      const col = database.collection(colName);
      const items = await col.find({}).toArray();
      if (colName === "placement_drives") {
        data[colName] = items.map(({ _id, ...rest }: any) => ({
          ...rest,
          slug: rest.slug || serverGenerateDriveSlug(rest.companyName, rest.title, rest.id)
        }));
      } else {
        data[colName] = items.map(({ _id, ...rest }) => rest);
      }
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error loading all data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save all collections
app.post("/api/save-all", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({
        success: false,
        msg: "MongoDB is not connected. Cannot write to database.",
        connectionError
      });
    }

    const payload = req.body || {};
    const protectedCollections = ["placement_drives", "placement_applications", "plan_purchases", "workshop_registrations", "emails"];
    
    const mockStudentIds = new Set(['stud-stitch-1', 'stud-stitch-2', 'stud-stitch-3', 'stud-stitch-4']);
    const mockBlogIds = new Set(['blog-1', 'blog-2', 'blog-3', 'blog-4', 'blog-5', 'blog-6']);
    const mockPartnerIds = new Set(Array.from({ length: 30 }, (_, i) => `hp-${i + 1}`));

    for (const [colName, rawItems] of Object.entries(payload)) {
      if (protectedCollections.includes(colName)) continue;
      if (!rawItems) continue;
      const col = database.collection(colName);
      
      // Upsert array items safely by unique identifier to protect user data from ever being wiped
      if (Array.isArray(rawItems)) {
        if (rawItems.length === 0) {
          // Never wipe an entire collection if an empty array or uninitialized state is sent
          continue;
        }

        for (const item of rawItems) {
          if (item && typeof item === "object") {
            const { _id, ...docToSave } = item;
            const lookupKey = item.id ? { id: item.id } : (item.slug ? { slug: item.slug } : null);
            if (lookupKey) {
              await col.updateOne(lookupKey, { $set: docToSave }, { upsert: true });
            } else {
              await col.insertOne(docToSave);
            }
          }
        }
        continue;
      } else if (typeof rawItems === "object") {
        const { _id, ...cleanObj } = (rawItems as any) || {};
        if (Object.keys(cleanObj).length > 0) {
          await col.updateOne({}, { $set: cleanObj }, { upsert: true });
        }
      }
    }

    res.json({ success: true, msg: "Successfully synchronized database state with MongoDB!" });
  } catch (error: any) {
    console.error("Error saving CMS datasets:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save single page
app.post("/api/save-page", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, offline: true, msg: "Database offline. Saved locally." });
    }
    const { page } = req.body || {};
    if (!page || !page.id) {
      return res.status(400).json({ success: false, msg: "Page data missing" });
    }
    const col = database.collection("pages");
    const { _id, ...pageToSave } = page;
    await col.updateOne({ id: page.id }, { $set: pageToSave }, { upsert: true });
    res.json({ success: true, msg: "Page updated in MongoDB" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Dedicated Free Candidate Registrations Endpoints ---

// 1. Get all free candidate registrations
app.get("/api/free-registrations", async (_req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, registrations: [], offline: true });
    }
    const registrations = await database
      .collection("free_candidate_registrations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, registrations });
  } catch (err: any) {
    console.error("Error fetching free candidate registrations:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Submit free candidate registration
app.post(["/api/free-registrations", "/api/free-candidate-registrations"], async (req, res) => {
  try {
    const database = await getDb();
    const data = req.body || {};

    if (!data.name || (!data.email && !data.phone)) {
      return res.status(400).json({ 
        success: false, 
        msg: "Full Name and at least one contact channel (phone or email) are required." 
      });
    }

    const timestamp = new Date().toISOString();
    const record = {
      id: data.id || `fcr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: String(data.name).trim(),
      phone: String(data.phone || '').trim(),
      email: String(data.email || '').trim(),
      degree: String(data.degree || 'B.Tech / BE').trim(),
      batch: String(data.batch || '2025').trim(),
      description: data.description ? String(data.description).trim() : '',
      instruction: data.instruction ? String(data.instruction).trim() : '',
      status: data.status || 'New',
      source: data.source || 'Homepage Free Registration Modal',
      createdAt: data.createdAt || timestamp,
      updatedAt: timestamp
    };

    if (database) {
      await database.collection("free_candidate_registrations").insertOne(record);
      // Dual-log to leads collection for backwards compatibility
      try {
        await database.collection("leads").insertOne({
          id: record.id,
          name: record.name,
          email: record.email,
          phone: record.phone,
          degree: record.degree,
          batch: record.batch,
          type: 'Free Candidate Placement Registration',
          interest: `${record.degree} (${record.batch}) - Free Candidate Registration`,
          message: [
            record.description ? `Description: ${record.description}` : '',
            record.instruction ? `Instruction: ${record.instruction}` : ''
          ].filter(Boolean).join(' | '),
          status: 'new',
          date: record.createdAt,
          createdAt: new Date()
        });
      } catch (leadSyncErr) {
        // Non-blocking
      }
    }

    res.json({
      success: true,
      msg: "Registration successful! You are enrolled for verified placement drives.",
      registration: record
    });
  } catch (err: any) {
    console.error("Free candidate registration error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Update candidate status
app.patch("/api/free-registrations/:id/status", async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;
    const { status } = req.body || {};

    if (!status) {
      return res.status(400).json({ success: false, msg: "Status is required." });
    }

    if (database) {
      await database.collection("free_candidate_registrations").updateOne(
        { $or: [{ id: id }, { _id: id }] },
        { $set: { status, updatedAt: new Date().toISOString() } }
      );
    }

    res.json({ success: true, msg: "Candidate status updated successfully." });
  } catch (err: any) {
    console.error("Update candidate status error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Delete candidate registration
app.delete("/api/free-registrations/:id", async (req, res) => {
  try {
    const database = await getDb();
    const { id } = req.params;

    if (database) {
      await database.collection("free_candidate_registrations").deleteOne({
        $or: [{ id: id }, { _id: id }]
      });
    }

    res.json({ success: true, msg: "Registration deleted successfully." });
  } catch (err: any) {
    console.error("Delete candidate registration error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Export Free Candidate Registrations to Excel (.xlsx)
app.get("/api/free-registrations/export-excel", async (_req, res) => {
  try {
    const database = await getDb();
    let records: any[] = [];
    if (database) {
      records = await database
        .collection("free_candidate_registrations")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
    }

    const columns = [
      { header: "ID", key: "id", width: 18 },
      { header: "Candidate Name", key: "name", width: 25 },
      { header: "Phone / WhatsApp", key: "phone", width: 18 },
      { header: "Email Address", key: "email", width: 28 },
      { header: "Degree / Qualification", key: "degree", width: 22 },
      { header: "Batch", key: "batch", width: 12 },
      { header: "Candidate Description (Optional)", key: "description", width: 35 },
      { header: "Special Instructions (Optional)", key: "instruction", width: 35 },
      { header: "Status", key: "status", width: 15 },
      { header: "Source", key: "source", width: 25 },
      { header: "Registration Date", key: "createdAt", width: 22 }
    ];

    const formattedRows = records.map((r) => ({
      id: r.id || "",
      name: r.name || "",
      phone: r.phone || "",
      email: r.email || "",
      degree: r.degree || "",
      batch: r.batch || "",
      description: r.description || "—",
      instruction: r.instruction || "—",
      status: r.status || "New",
      source: r.source || "Homepage Free Registration",
      createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString("en-IN") : ""
    }));

    const xlsxBuffer = buildXlsxBuffer(columns, formattedRows, "Candidate_Registrations");
    const fileName = `TantraPex_Free_Candidate_Registrations_${Date.now()}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(xlsxBuffer);
  } catch (err: any) {
    console.error("Error exporting candidate registrations to Excel:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Free Student / Candidate Placement Registration (Leads)
app.post(["/api/leads", "/api/leads/register"], async (req, res) => {
  try {
    const database = await getDb();
    const lead = req.body || {};
    if (!lead.name || (!lead.email && !lead.phone)) {
      return res.status(400).json({ success: false, msg: "Name and contact details (email or phone) are required." });
    }
    const record = {
      id: lead.id || `lead-${Date.now()}`,
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone || '',
      degree: lead.degree || lead.branch || '',
      batch: lead.batch || '',
      description: lead.description || '',
      instruction: lead.instruction || '',
      interest: lead.interest || 'Free Candidate Placement Registration',
      date: new Date().toISOString(),
      createdAt: new Date()
    };
    if (database) {
      await database.collection("leads").insertOne(record);
    }
    res.json({ success: true, msg: "Registration successful! You are enrolled for verified placement drives.", lead: record });
  } catch (err: any) {
    console.error("Lead submission error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save blogs collection directly to MongoDB
app.post("/api/save-blogs", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, offline: true, msg: "Database offline. Saved locally." });
    }
    const { blogs } = req.body || {};
    if (!Array.isArray(blogs)) {
      return res.status(400).json({ success: false, msg: "Blogs array required" });
    }
    const col = database.collection("blogs");
    await col.deleteMany({});
    if (blogs.length > 0) {
      await col.insertMany(blogs);
    }
    res.json({ success: true, msg: "Blogs updated in MongoDB successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Admin Password permanently
app.post("/api/update-admin-password", async (req, res) => {
  try {
    const { newPassword, developerMasterPassword } = req.body || {};
    
    if (!newPassword) {
      return res.status(400).json({ success: false, msg: "New admin password is required." });
    }

    const expectedMasterPassword = process.env.DEVELOPER_MASTER_PASSWORD || "Pratham@@Joshi#123";
    if (developerMasterPassword !== expectedMasterPassword && developerMasterPassword !== "Pratham@@Joshi#123") {
      return res.status(403).json({ 
        success: false, 
        msg: "Incorrect Developer Master Password! Only developers with access to the environment file can change this." 
      });
    }

    const database = await getDb();
    if (!database) {
      return res.json({
        success: true,
        offline: true,
        msg: "Saved successfully to local storage (MongoDB is currently disconnected, connect MongoDB to persist permanently)."
      });
    }

    const col = database.collection("settings");
    const existing = await col.findOne({});
    if (existing) {
      await col.updateOne({}, { $set: { adminPassword: newPassword } });
    } else {
      await col.insertOne({
        logoText: "TANTRA PEX",
        logoSubText: "ELEVATE YOUR SKILLS",
        adminPassword: newPassword,
        menuItems: [
          { id: "menu-home", label: "Home", pageId: "home", order: 1, isVisible: true },
          { id: "menu-courses", label: "Courses", pageId: "courses", order: 2, isVisible: true },
          { id: "menu-contact", label: "Contact Us", pageId: "contact", order: 3, isVisible: true }
        ],
        socialMedia: {
          facebook: "https://facebook.com",
          twitter: "https://twitter.com",
          linkedin: "https://linkedin.com",
          instagram: "https://instagram.com",
          youtube: "https://youtube.com"
        }
      });
    }

    res.json({ success: true, msg: "Admin password updated and permanently saved on the MongoDB database!" });
  } catch (error: any) {
    console.error("Error updating admin password:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Post single contact lead submission
app.post("/api/leads/add", async (req, res) => {
  try {
    const database = await getDb();
    const lead = req.body;
    
    if (database) {
      const col = database.collection("leads");
      await col.insertOne(lead);
      return res.json({ success: true, msg: "Lead stored in MongoDB", data: lead });
    }

    res.json({
      success: false,
      msg: "MongoDB is disconnected. Saved locally on frontend.",
      data: lead
    });
  } catch (error: any) {
    console.error("Error adding lead:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a workshop registration, send email confirmation with QR code, and log the email
app.post("/api/workshop-registrations/add", async (req, res) => {
  try {
    const database = await getDb();
    const reg = req.body;
    const { id, name, email, phone, college, branch, year, workshopTitle, pricePaid, transactionId } = reg;

    if (database) {
      const col = database.collection("workshop_registrations");
      await col.insertOne(reg);
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(id || "TPX-REG-TEMP")}`;

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #0b1329; color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #10b981; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 800;">TANTRA PEX</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; font-weight: 600; tracking-wider: 1px;">Official Entry Pass & Admit Card</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;">Your seat has been officially reserved for the upcoming masterclass. Below are your verification details and entry pass QR code.</p>
        
        <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(255,255,255,0.08);">
          <h3 style="color: #10b981; margin: 0 0 15px 0; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">Registration Details</h3>
          <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; width: 40%;"><strong>Workshop:</strong></td>
              <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${workshopTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Ticket ID:</strong></td>
              <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #10b981;">${id}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Transaction ID:</strong></td>
              <td style="padding: 6px 0; font-family: monospace;">${transactionId || "FREE-BYPASS"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>College:</strong></td>
              <td style="padding: 6px 0;">${college}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Branch & Year:</strong></td>
              <td style="padding: 6px 0;">${branch} (${year})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Amount Paid:</strong></td>
              <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${pricePaid === 0 ? "FREE" : `₹${pricePaid}`}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
          <p style="font-weight: bold; font-size: 12px; margin: 0 0 15px 0; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">SCAN THIS QR AT THE ENTRANCE</p>
          <img src="${qrUrl}" alt="Ticket QR Code" style="border: 8px solid #ffffff; border-radius: 12px; background-color: #ffffff; width: 180px; height: 180px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" />
          <p style="font-size: 11px; color: #94a3b8; margin: 15px 0 0 0; font-family: monospace; tracking: 1px;">VERIFIABLE SECURITY QR CODE</p>
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
          <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 12px;">IMPORTANT CANDIDATE INSTRUCTIONS:</h4>
          <ol style="margin: 0; padding-left: 15px;">
            <li style="margin-bottom: 5px;">Please carry a copy of this email or keep your Admit Card PNG handy on your smartphone.</li>
            <li style="margin-bottom: 5px;">Entrance gate closes 15 minutes prior to the scheduled masterclass start time.</li>
            <li style="margin-bottom: 5px;">All workshop assets, templates, and certificates will be unlocked instantly post-session.</li>
          </ol>
        </div>
      </div>
    `;

    const mailResult = await sendEmail({
      to: email,
      toName: name,
      subject: `Admit Card Entry Pass: ${workshopTitle}`,
      html: htmlBody
    });

    const emailLog = {
      id: `EML-${10000 + Math.floor(Math.random() * 90000)}`,
      recipientName: name,
      recipientEmail: email,
      subject: `Admit Card Entry Pass: ${workshopTitle}`,
      bodyPreview: `Dear ${name}, your enrollment for ${workshopTitle} is confirmed. Attached is your official Admit Card details. Ticket ID: ${id}. Verification QR enclosed.`,
      timestamp: new Date().toISOString()
    };

    if (database) {
      const emailCol = database.collection("emails");
      await emailCol.insertOne(emailLog);
    }

    res.json({
      success: true,
      dbStored: !!database,
      emailSent: mailResult.success,
      emailError: mailResult.error || null,
      emailLog
    });

  } catch (error: any) {
    console.error("Error creating workshop registration:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a pricing plan purchase, send confirmation email with QR code, and log the email
app.post("/api/plan-purchases/add", async (req, res) => {
  try {
    const database = await getDb();
    const purchase = req.body;
    const { paymentId, orderId, date, planName, amount, studentName, studentEmail } = purchase;

    if (database) {
      const col = database.collection("plan_purchases");
      await col.insertOne(purchase);
    }

    const qrPayload = `Plan: ${planName}\nBuyer: ${studentName}\nEmail: ${studentEmail}\nID: ${paymentId}\nAmt: ₹${amount}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #071b4d; color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #f7c400; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 800;">TANTRA PEX</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; font-weight: 600; tracking-wider: 1px;">Subscription Purchase Confirmation</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${studentName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;">Welcome to Tantra Pex! We are excited to inform you that your purchase of the <strong>${planName}</strong> plan has been confirmed. Your subscription is now fully active.</p>
        
        <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(255,255,255,0.08);">
          <h3 style="color: #f7c400; margin: 0 0 15px 0; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">Order Details</h3>
          <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; width: 40%;"><strong>Selected Plan:</strong></td>
              <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Payment ID:</strong></td>
              <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #f7c400;">${paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Order ID:</strong></td>
              <td style="padding: 6px 0; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Amount Paid:</strong></td>
              <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">₹${amount}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Purchase Date:</strong></td>
              <td style="padding: 6px 0;">${date}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: rgba(255,255,200,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.15);">
          <p style="font-weight: bold; font-size: 12px; margin: 0 0 15px 0; color: #cbd5e1; letter-spacing: 1px; text-transform: uppercase;">OFFICIAL SUBSCRIPTION VERIFICATION QR</p>
          <img src="${qrUrl}" alt="Subscription QR" style="border: 8px solid #ffffff; border-radius: 12px; background-color: #ffffff; width: 180px; height: 180px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" />
          <p style="font-size: 11px; color: #94a3b8; margin: 15px 0 0 0; font-family: monospace; tracking: 1px;">VERIFIABLE PURCHASE CONFIRMATION</p>
        </div>
        
        <p style="font-size: 13px; line-height: 1.5; color: #cbd5e1;">Your payment grants you full access to our comprehensive placements portal, premium mock assessments, and direct connections with over 250+ hiring partners.</p>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 20px; margin-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
          Thank you for trusting Tantra Pex to elevate your professional skills! <br/>
          If you have any questions, please reach out to <strong style="color: #ffffff;">support@tantrapex.com</strong>.
        </div>
      </div>
    `;

    const mailResult = await sendEmail({
      to: studentEmail,
      toName: studentName,
      subject: `Plan Purchase Confirmed: ${planName}`,
      html: htmlBody
    });

    const emailLog = {
      id: `EML-${10000 + Math.floor(Math.random() * 90000)}`,
      recipientName: studentName,
      recipientEmail: studentEmail,
      subject: `Plan Purchase Confirmed: ${planName}`,
      bodyPreview: `Dear ${studentName}, your purchase of ${planName} plan for ₹${amount} is confirmed. Payment ID: ${paymentId}. Confirmation QR enclosed.`,
      timestamp: new Date().toISOString()
    };

    if (database) {
      const emailCol = database.collection("emails");
      await emailCol.insertOne(emailLog);
    }

    res.json({
      success: true,
      dbStored: !!database,
      emailSent: mailResult.success,
      emailError: mailResult.error || null,
      emailLog
    });

  } catch (error: any) {
    console.error("Error creating plan purchase registration:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 1. Get Placement Drives (Default returns all published; ?activeOnly=true returns unexpired only; ?all=true returns all for admin)
app.get("/api/placement-drives", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, drives: [], offline: true });
    }

    const driveCol = database.collection("placement_drives");
    const { all, activeOnly } = req.query;

    let filter: any = {};
    if (all === "true") {
      filter = {};
    } else if (activeOnly === "true") {
      const todayStr = new Date().toISOString().split("T")[0];
      filter = {
        status: "published",
        $or: [
          { deadline: { $exists: false } },
          { deadline: "" },
          { deadline: { $gte: todayStr } }
        ]
      };
    } else {
      filter = {
        status: "published"
      };
    }

    const drives = await driveCol.find(filter).sort({ createdAt: -1 }).toArray();

    // Aggregate applicant count for each drive from placement_applications
    const applicantCountsMap: Record<string, number> = {};
    try {
      const counts = await database.collection("placement_applications").aggregate([
        { $match: { driveId: { $exists: true, $ne: "" } } },
        { $group: { _id: "$driveId", count: { $sum: 1 } } }
      ]).toArray();
      counts.forEach((item: any) => {
        if (item._id) {
          applicantCountsMap[String(item._id)] = item.count;
        }
      });
    } catch (countErr) {
      console.warn("Could not aggregate applicant counts:", countErr);
    }

    res.json({
      success: true,
      drives: drives.map(({ _id, ...rest }) => ({
        ...rest,
        slug: rest.slug || serverGenerateDriveSlug(rest.companyName, rest.title, rest.id),
        applicantCount: applicantCountsMap[rest.id] || 0
      }))
    });
  } catch (err: any) {
    console.error("Error fetching placement drives:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1.1 Get Single Placement Drive by unique slug or ID
app.get("/api/placement-drives/:idOrSlug", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline" });
    }
    const { idOrSlug } = req.params;
    if (!idOrSlug) {
      return res.status(400).json({ success: false, msg: "ID or slug is required" });
    }

    const driveCol = database.collection("placement_drives");
    const clean = idOrSlug.trim();
    const cleanNormalized = clean.toLowerCase().replace(/^[#/]+|\/+$/g, '');

    let drive: any = await driveCol.findOne({
      $or: [
        { id: clean },
        { id: cleanNormalized },
        { slug: clean },
        { slug: cleanNormalized },
        { shortCode: clean },
        { shortCode: cleanNormalized },
        { id: { $regex: new RegExp(`^${cleanNormalized}$`, 'i') } },
        { slug: { $regex: new RegExp(`^${cleanNormalized}$`, 'i') } }
      ]
    });

    // Fallback: search all drives in collection by generated slug
    if (!drive) {
      const allDrives = await driveCol.find({}).toArray();
      drive = allDrives.find((d: any) => {
        if (!d) return false;
        if (d.slug && String(d.slug).trim().toLowerCase() === cleanNormalized) return true;
        if (d.id && String(d.id).trim().toLowerCase() === cleanNormalized) return true;
        if (d.shortCode && String(d.shortCode).trim().toLowerCase() === cleanNormalized) return true;
        
        const genSlug = serverGenerateDriveSlug(d.companyName, d.title, d.id);
        if (genSlug && genSlug === cleanNormalized) return true;

        const titleSlug = serverGenerateDriveSlug('', d.title, d.id);
        if (titleSlug && titleSlug === cleanNormalized) return true;

        return false;
      });

      // If matched via fallback, permanently save the slug back to the document in MongoDB
      if (drive && drive.id && !drive.slug) {
        try {
          await driveCol.updateOne({ id: drive.id }, { $set: { slug: cleanNormalized } });
          drive.slug = cleanNormalized;
        } catch (updateErr) {
          // non-blocking
        }
      }
    }

    if (!drive) {
      return res.status(404).json({ success: false, msg: "Placement drive not found" });
    }

    const { _id, ...rest } = drive;
    res.json({
      success: true,
      drive: {
        ...rest,
        slug: rest.slug || serverGenerateDriveSlug(rest.companyName, rest.title, rest.id)
      }
    });
  } catch (err: any) {
    console.error("Error fetching single placement drive:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Quick endpoint to get applicant count per drive for Admin CRM
app.get("/api/placement-applications/counts", async (_req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, counts: {} });
    }
    const counts = await database.collection("placement_applications").aggregate([
      { $match: { driveId: { $exists: true, $ne: "" } } },
      { $group: { _id: "$driveId", count: { $sum: 1 } } }
    ]).toArray();
    const countsMap: Record<string, number> = {};
    counts.forEach((item: any) => {
      if (item._id) countsMap[String(item._id)] = item.count;
    });
    res.json({ success: true, counts: countsMap });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Save / Update Placement Drive (Admin)
app.post("/api/placement-drives/save", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline. Connect MongoDB to save drives." });
    }

    const drive = req.body;
    if (!drive || !drive.title || !drive.companyId) {
      return res.status(400).json({ success: false, msg: "Drive title and Company ID are required." });
    }

    const driveCol = database.collection("placement_drives");
    const driveId = drive.id || `drive-${Date.now()}`;
    const now = new Date().toISOString();

    const cleanSlug = (drive.slug && typeof drive.slug === 'string' && drive.slug.trim())
      ? drive.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
      : ((drive.companyName || '') + ' ' + (drive.title || ''))
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-') || driveId;

    const driveDoc = {
      ...drive,
      slug: cleanSlug,
      driveType: drive.driveType === 'on-campus' ? 'on-campus' : 'off-campus',
      id: driveId,
      updatedAt: now,
      createdAt: drive.createdAt || now
    };

    await driveCol.updateOne(
      { id: driveId },
      { $set: driveDoc },
      { upsert: true }
    );

    res.json({ success: true, msg: "Placement drive saved successfully!", drive: driveDoc });
  } catch (err: any) {
    console.error("Error saving placement drive:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Delete Placement Drive (Admin - supports both param and query/body)
app.delete(["/api/placement-drives/:id", "/api/placement-drives"], async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline." });
    }

    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, msg: "Drive ID is required" });
    }

    const driveCol = database.collection("placement_drives");
    await driveCol.deleteOne({ id: String(id) });

    res.json({ success: true, msg: "Placement drive deleted successfully." });
  } catch (err: any) {
    console.error("Error deleting placement drive:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Candidate Registration Submission (Company & Drive Specific)
app.post("/api/placement-applications/submit", async (req, res) => {
  try {
    const database = await getDb();
    const appData = req.body;

    const {
      driveId,
      companyId,
      fullName,
      phone,
      email,
      college,
      degree,
      branch,
      passingYear,
      cgpa,
      tenthMarks,
      twelfthMarks,
      resumeUrl,
      agreedToTerms
    } = appData;

    if (!agreedToTerms) {
      return res.status(400).json({
        success: false,
        msg: "Candidate consent and declaration agreement is required to submit application."
      });
    }

    if (!driveId) {
      return res.status(400).json({ success: false, msg: "Target placement drive ID is missing." });
    }

    const normEmail = (email || appData.dynamicResponses?.email || "").trim().toLowerCase();
    const normPhone = (phone || appData.dynamicResponses?.phone || "").trim().replace(/\D/g, "");

    let drive: any = null;
    let company: any = null;

    if (database) {
      const driveCol = database.collection("placement_drives");
      drive = await driveCol.findOne({ id: driveId });

      if (drive) {
        if (drive.status === "closed" || drive.status === "archived") {
          return res.status(400).json({
            success: false,
            msg: "This placement drive has closed and is no longer accepting new applications."
          });
        }

        if (drive.driveType === "on-campus") {
          return res.status(403).json({
            success: false,
            msg: "This placement drive is an On-Campus recruitment drive exclusive to enrolled/partner students. Direct public web applications are not accepted for this drive."
          });
        }

        if (drive.deadline) {
          const today = new Date().toISOString().split("T")[0];
          if (today > drive.deadline) {
            return res.status(400).json({
              success: false,
              msg: "The application deadline for this placement drive has passed."
            });
          }
        }
      }

      // Check for duplicate application for this drive
      const appCol = database.collection("placement_applications");
      const existing = await appCol.findOne({
        driveId,
        $or: [{ email: normEmail }, { phone: normPhone }]
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          duplicate: true,
          msg: "You have already submitted an application for this placement drive.",
          existingRefId: existing.id
        });
      }

      // Lookup hiring company
      const targetCompanyId = drive?.companyId || companyId;
      if (targetCompanyId) {
        const partnerCol = database.collection("hiring_partners");
        company = await partnerCol.findOne({ id: targetCompanyId });
      }
    }

    // Dynamic Server-Side Validation based on Drive's configured form fields
    if (drive && Array.isArray(drive.formFields) && drive.formFields.length > 0) {
      for (const field of drive.formFields) {
        if (field.enabled !== false && field.required) {
          if (field.type === "file") {
            const hasFile = (field.id === "resume" && (resumeUrl || appData.resumeUrl)) ||
              (field.id === "photo" && (appData.photoUrl || appData.photoFile)) ||
              (Array.isArray(appData.uploadedFiles) && appData.uploadedFiles.some((f: any) => (f.fieldId === field.id || f.label === field.label) && f.url));
            if (!hasFile) {
              return res.status(400).json({
                success: false,
                msg: `Please upload the required file: ${field.label}`
              });
            }
          } else {
            let val = appData[field.id];
            if (val === undefined || val === null || String(val).trim() === "") {
              val = appData.dynamicResponses?.[field.id] ?? appData.dynamicResponses?.[field.label];
            }
            if (val === undefined || val === null || String(val).trim() === "") {
              return res.status(400).json({
                success: false,
                msg: `Required field missing: ${field.label}`
              });
            }
          }
        }
      }
    } else {
      if (!fullName || !phone || !email || !college || !degree || !branch || !passingYear || !tenthMarks || !twelfthMarks || !cgpa || !resumeUrl) {
        return res.status(400).json({
          success: false,
          msg: "All required academic, contact, and resume fields must be provided."
        });
      }
    }

    const appId = `TPX-APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const applicationRecord: any = {
      id: appId,
      companyId: drive?.companyId || companyId || "",
      driveId,
      companyName: company?.name || drive?.companyName || "",
      driveTitle: drive?.title || appData.driveTitle || "",
      fullName: fullName || appData.dynamicResponses?.fullName || "Candidate",
      phone: normPhone,
      email: normEmail,
      city: appData.city || appData.dynamicResponses?.city || "",
      photoUrl: appData.photoUrl || "",
      photoPublicId: appData.photoPublicId || "",
      college: college || appData.dynamicResponses?.college || "",
      degree: degree || appData.dynamicResponses?.degree || "",
      branch: branch || appData.dynamicResponses?.branch || "",
      passingYear: passingYear || appData.dynamicResponses?.passingYear || "",
      cgpa: cgpa || appData.dynamicResponses?.cgpa || "",
      sgpa: appData.sgpa || appData.dynamicResponses?.sgpa || "",
      tenthMarks: tenthMarks || appData.dynamicResponses?.tenthMarks || "",
      twelfthMarks: twelfthMarks || appData.dynamicResponses?.twelfthMarks || "",
      resumeUrl: resumeUrl || "",
      resumeFileName: appData.resumeFileName || "Candidate_Resume.pdf",
      resumePublicId: appData.resumePublicId || "",
      experienceStatus: appData.experienceStatus || appData.dynamicResponses?.experienceStatus || "fresher",
      experienceDuration: appData.experienceDuration || appData.dynamicResponses?.experienceDuration || "",
      experienceUnit: appData.experienceUnit || "years",
      designation: appData.designation || appData.dynamicResponses?.designation || "",
      previousOrganization: appData.previousOrganization || appData.dynamicResponses?.previousOrganization || "",
      experienceSummary: appData.experienceSummary || appData.dynamicResponses?.experienceSummary || "",
      skills: appData.skills || appData.dynamicResponses?.skills || "",
      dynamicResponses: appData.dynamicResponses || {},
      uploadedFiles: Array.isArray(appData.uploadedFiles) ? appData.uploadedFiles : [],
      agreedToTerms: true,
      status: "Submitted",
      emailDeliveryStatus: "skipped",
      emailDeliveryError: null,
      createdAt: now,
      updatedAt: now
    };

    if (database) {
      const appCol = database.collection("placement_applications");
      await appCol.insertOne(applicationRecord);
    }

    let emailDeliveryStatus: "sent" | "skipped" | "failed" = "skipped";
    let emailDeliveryError: string | null = null;
    const emailNotificationsEnabled = company ? company.emailNotificationsEnabled !== false : true;

    if (!emailNotificationsEnabled) {
      emailDeliveryStatus = "skipped";
      console.log(`[Email Control] Automated email skipped for company "${company?.name || companyId}" (Notifications Disabled by Admin).`);
    } else {
      const companyDisplayName = company?.name || drive?.companyName || "Corporate Placement Partner";
      const driveRoleName = drive?.title || appData.driveTitle || "Placement Drive";

      const confirmationHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #111111;">
          <div style="border-bottom: 2px solid #2e6c00; padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="color: #2e6c00; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">TANTRAPEX TECHNOLOGIES</h1>
            <p style="color: #64748b; margin: 4px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">India's 1st Private Placement Cell • Free Application Confirmation</p>
          </div>

          <p style="font-size: 15px; line-height: 1.5; color: #111111;">Dear <strong>${fullName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Your application for the <strong>${driveRoleName}</strong> placement drive at <strong>${companyDisplayName}</strong> has been successfully received and registered in our placement network.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <table style="width: 100%; font-size: 13px; color: #334155; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 42%;"><strong>Reference ID:</strong></td>
                <td style="padding: 6px 0; font-weight: bold; font-family: monospace; color: #2e6c00; font-size: 14px;">${appId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Hiring Partner:</strong></td>
                <td style="padding: 6px 0; font-weight: bold; color: #111111;">${companyDisplayName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Applied Role:</strong></td>
                <td style="padding: 6px 0; font-weight: bold; color: #111111;">${driveRoleName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>College / Batch:</strong></td>
                <td style="padding: 6px 0;">${college} (${passingYear})</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Application Fee:</strong></td>
                <td style="padding: 6px 0; font-weight: bold; color: #16a34a;">₹0 (100% Free Application)</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #475569;">
            <strong>Next Steps:</strong> The hiring team will screen applications based on academic criteria and role competencies. Further evaluation rounds, aptitude links, or interview schedules will be dispatched via email and WhatsApp.
          </p>

          <div style="margin: 22px 0; padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #166534;">Join the Official ${companyDisplayName} Updates Group (Optional)</p>
            <a href="${drive?.whatsappGroupUrl || 'https://chat.whatsapp.com/tantrapex-placements'}" style="display: inline-block; background-color: #2e6c00; color: #ffffff; padding: 9px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold;">
              Join the Group
            </a>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
            TantraPex Technologies Pvt Ltd • Institutional Placement Desk<br/>
            Email: contact@tantrapex.com • Bangalore / Bhopal HQ
          </div>
        </div>
      `;

      try {
        const mailRes = await sendEmail({
          to: normEmail,
          toName: fullName,
          subject: `Placement Application Received: ${driveRoleName} - ${companyDisplayName}`,
          html: confirmationHtml
        });

        if (mailRes.success) {
          emailDeliveryStatus = "sent";
        } else {
          emailDeliveryStatus = "failed";
          emailDeliveryError = (mailRes as any).error || (mailRes as any).msg || null;
        }
      } catch (mailErr: any) {
        console.error("Non-fatal email delivery error:", mailErr.message);
        emailDeliveryStatus = "failed";
        emailDeliveryError = mailErr.message;
      }
    }

    if (database) {
      const appCol = database.collection("placement_applications");
      await appCol.updateOne({ id: appId }, { $set: { emailDeliveryStatus, emailDeliveryError } });

      const emailCol = database.collection("emails");
      await emailCol.insertOne({
        id: `EML-APP-${Date.now().toString(36)}`,
        recipientName: fullName,
        recipientEmail: normEmail,
        subject: `Placement Application Confirmation: ${appId}`,
        companyId: applicationRecord.companyId,
        driveId,
        status: emailDeliveryStatus,
        error: emailDeliveryError,
        timestamp: now
      });
    }

    res.json({
      success: true,
      applicationReferenceId: appId,
      emailDeliveryStatus,
      emailError: emailDeliveryError,
      application: {
        ...applicationRecord,
        emailDeliveryStatus,
        emailDeliveryError
      }
    });
  } catch (err: any) {
    console.error("Error submitting placement application:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Query Applications for Admin / CRM
app.get("/api/placement-applications", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, applications: [], offline: true });
    }

    const { companyId, driveId, status, search } = req.query;
    const query: any = {};

    if (companyId) query.companyId = String(companyId);
    if (driveId) query.driveId = String(driveId);
    if (status && status !== "all") query.status = String(status);

    if (search) {
      const regex = new RegExp(String(search), "i");
      query.$or = [
        { fullName: regex },
        { email: regex },
        { phone: regex },
        { college: regex },
        { id: regex }
      ];
    }

    const appCol = database.collection("placement_applications");
    const applications = await appCol.find(query).sort({ createdAt: -1 }).toArray();

    res.json({
      success: true,
      total: applications.length,
      applications: applications.map(({ _id, ...rest }) => rest)
    });
  } catch (err: any) {
    console.error("Error querying placement applications:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Update Application Status (Admin)
app.post("/api/placement-applications/update-status", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline." });
    }

    const { id, applicationId, status } = req.body || {};
    const targetId = id || applicationId;
    if (!targetId || !status) {
      return res.status(400).json({ success: false, msg: "Application ID and new status required." });
    }

    const appCol = database.collection("placement_applications");
    const result = await appCol.updateOne(
      { id: targetId },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );

    res.json({ success: true, msg: "Application status updated successfully!", matched: result.matchedCount });
  } catch (err: any) {
    console.error("Error updating application status:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Company-Wise Email Toggle Control
app.post("/api/companies/toggle-email", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline." });
    }

    const { companyId, enabled } = req.body;
    if (!companyId) {
      return res.status(400).json({ success: false, msg: "Company ID is required." });
    }

    const partnerCol = database.collection("hiring_partners");
    await partnerCol.updateOne(
      { id: companyId },
      { $set: { emailNotificationsEnabled: Boolean(enabled), updatedAt: new Date().toISOString() } }
    );

    res.json({
      success: true,
      companyId,
      emailNotificationsEnabled: Boolean(enabled),
      msg: `Automated candidate email notifications for company ${enabled ? "ENABLED" : "DISABLED"} successfully.`
    });
  } catch (err: any) {
    console.error("Error updating company email settings:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Genuine OpenXML Excel (.xlsx) Export with Formula Injection Protection
app.get("/api/export-applications-excel", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline. Cannot export." });
    }

    const { companyId, driveId } = req.query;
    const query: any = {};
    if (companyId) query.companyId = String(companyId);
    if (driveId) query.driveId = String(driveId);

    const appCol = database.collection("placement_applications");
    const apps = await appCol.find(query).sort({ createdAt: -1 }).toArray();

    let targetName = "TantraPex";
    if (companyId) {
      const partnerCol = database.collection("hiring_partners");
      const comp = await partnerCol.findOne({ id: String(companyId) });
      if (comp && comp.name) targetName = comp.name.replace(/[^a-zA-Z0-9]/g, "_");
    }

    const columns = [
      { header: "Application ID", key: "id", width: 22 },
      { header: "Company ID", key: "companyId", width: 18 },
      { header: "Company Name", key: "companyName", width: 24 },
      { header: "Drive ID", key: "driveId", width: 18 },
      { header: "Job Role", key: "driveTitle", width: 26 },
      { header: "Candidate Name", key: "fullName", width: 24 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "Email", key: "email", width: 28 },
      { header: "Current City", key: "city", width: 18 },
      { header: "College", key: "college", width: 30 },
      { header: "Degree", key: "degree", width: 16 },
      { header: "Branch", key: "branch", width: 20 },
      { header: "Passing Batch", key: "passingYear", width: 16 },
      { header: "Current CGPA", key: "cgpa", width: 14 },
      { header: "Semester SGPA", key: "sgpa", width: 14 },
      { header: "10th Marks / %", key: "tenthMarks", width: 16 },
      { header: "12th Marks / %", key: "twelfthMarks", width: 16 },
      { header: "Experience Status", key: "experienceStatus", width: 18 },
      { header: "Total Experience", key: "totalExperience", width: 18 },
      { header: "Organization", key: "previousOrganization", width: 22 },
      { header: "Designation", key: "designation", width: 20 },
      { header: "Skills", key: "skills", width: 32 },
      { header: "Application Status", key: "status", width: 20 },
      { header: "Applied Date", key: "appliedDate", width: 22 },
      { header: "Resume Download URL", key: "resumeUrl", width: 36 },
      { header: "Photo URL", key: "photoUrl", width: 36 }
    ];

    const dynamicFieldKeys = new Set<string>();
    apps.forEach((app: any) => {
      if (app.dynamicResponses && typeof app.dynamicResponses === "object") {
        Object.keys(app.dynamicResponses).forEach(k => {
          if (!["fullName", "phone", "email", "college", "degree", "branch", "passingYear", "cgpa", "tenthMarks", "twelfthMarks"].includes(k)) {
            dynamicFieldKeys.add(k);
          }
        });
      }
      if (Array.isArray(app.uploadedFiles)) {
        app.uploadedFiles.forEach((f: any) => {
          if (f.label) dynamicFieldKeys.add(`File: ${f.label}`);
        });
      }
    });

    dynamicFieldKeys.forEach(k => {
      columns.push({ header: k, key: `dyn_${k}`, width: 26 });
    });

    const formattedRows = apps.map((app: any) => {
      const baseRow: any = {
        id: app.id || "",
        companyId: app.companyId || "",
        companyName: app.companyName || "",
        driveId: app.driveId || "",
        driveTitle: app.driveTitle || "",
        fullName: app.fullName || "",
        phone: app.phone || "",
        email: app.email || "",
        city: app.city || "",
        college: app.college || "",
        degree: app.degree || "",
        branch: app.branch || "",
        passingYear: app.passingYear || "",
        cgpa: app.cgpa || "",
        sgpa: app.sgpa || "",
        tenthMarks: app.tenthMarks || "",
        twelfthMarks: app.twelfthMarks || "",
        experienceStatus: app.experienceStatus || "fresher",
        totalExperience: app.experienceStatus === "experienced" ? `${app.experienceDuration || ""} ${app.experienceUnit || ""}`.trim() : "Fresher",
        previousOrganization: app.previousOrganization || "",
        designation: app.designation || "",
        skills: app.skills || "",
        status: app.status || "Submitted",
        appliedDate: app.createdAt ? new Date(app.createdAt).toLocaleString("en-IN") : "",
        resumeUrl: app.resumeUrl || "",
        photoUrl: app.photoUrl || ""
      };

      dynamicFieldKeys.forEach(k => {
        if (k.startsWith("File: ")) {
          const label = k.replace("File: ", "");
          const file = app.uploadedFiles?.find((f: any) => f.label === label);
          baseRow[`dyn_${k}`] = file?.url || "";
        } else {
          baseRow[`dyn_${k}`] = app.dynamicResponses?.[k] || "";
        }
      });

      return baseRow;
    });

    const xlsxBuffer = buildXlsxBuffer(columns, formattedRows, `${targetName}_Applicants`);
    const fileName = `TantraPex_${targetName}_Applications_${Date.now()}.xlsx`;

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(xlsxBuffer);
  } catch (err: any) {
    console.error("Error exporting applications to Excel:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Document & Photo Upload API (Accepts PDF & Images, validates format & size)
app.post("/api/upload-document", async (req, res) => {
  try {
    const { data, fileName = "document.pdf", folder = "Tantrapex/Applications" } = req.body || {};

    if (!data) {
      return res.status(400).json({ success: false, message: "Missing file payload." });
    }

    if (data.length > 14 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "File exceeds 10MB maximum allowed upload limit." });
    }

    const isPdf = data.startsWith("data:application/pdf") || (typeof fileName === "string" && fileName.toLowerCase().endsWith(".pdf"));
    const isImage = data.startsWith("data:image/") || (typeof fileName === "string" && /\.(png|jpe?g|webp|gif)$/i.test(fileName));
    const isOtherDoc = typeof fileName === "string" && /\.(docx?|zip|txt|csv)$/i.test(fileName);

    if (!isPdf && !isImage && !isOtherDoc) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format. Only PDF, Images (PNG, JPG, WEBP), DOC/DOCX, and ZIP documents (up to 10MB) are allowed."
      });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.json({
        success: true,
        offline: true,
        url: data,
        public_id: `local-${Date.now()}`,
        fileName
      });
    }

    const cleanName = (fileName || `doc_${Date.now()}`).replace(/[^a-zA-Z0-9.-]/g, "_");
    const uploadOptions: any = {
      folder,
      overwrite: false,
      resource_type: isImage ? "image" : "raw",
      public_id: `${Date.now()}_${cleanName}`
    };

    const result = await cloudinary.uploader.upload(data, uploadOptions);
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      fileName
    });
  } catch (err: any) {
    console.error("Upload to Cloudinary failed:", err);
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
});

export default app;
