import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { MongoClient, Db } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

for (const envPath of [path.resolve(__dirname, ".env"), path.resolve(process.cwd(), ".env")]) {
  dotenv.config({ path: envPath });
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
      }
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

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Lazy MongoDB Client Initialization
const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let db: Db | null = null;
let lastAttemptTime = 0;
let connectionError: string | null = null;

function checkUriIssues(uri: string): string | null {
  try {
    if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
      return "Invalid connection scheme. MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'.";
    }

    // Check for unencoded '@' in password
    const parts = uri.split("@");
    if (parts.length > 2) {
      return "Your MONGODB_URI contains multiple '@' characters. If your database password contains an '@' character, you MUST replace it with its percent-encoded equivalent '%40' in the connection string (e.g., p%40ssword instead of p@ssword).";
    }

    // Check for other raw special characters in the auth section
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
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return {
      success: false,
      mock: false,
      error: "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the environment.",
      keyId: keyId || "",
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
    throw new Error(data.error?.description || "Failed to create Razorpay order");
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

async function getDb(): Promise<Db | null> {
  if (!uri) {
    connectionError = "MONGODB_URI is not defined. Please add it via AI Studio settings.";
    return null;
  }

  const uriIssue = checkUriIssues(uri);
  if (uriIssue) {
    connectionError = uriIssue;
    return null;
  }

  if (db) {
    return db;
  }

  const now = Date.now();
  // Throttle reconnection attempts to once per 15 seconds to prevent hanging the event loop
  if (connectionError && (now - lastAttemptTime < 15000)) {
    return null;
  }

  lastAttemptTime = now;
  try {
    console.log("Connecting to MongoDB...");
    client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    // Parse db name from URI or default to "tatrapax"
    db = client.db("tatrapax");
    connectionError = null;
    console.log("Connected to MongoDB successfully!");
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

// Support JSON payloads up to 15MB for large CMS schemas
app.use(express.json({ limit: "15mb" }));

// --- API ROUTES ---

// Health Check API
app.get("/api/health", async (req, res) => {
  const database = await getDb();
  res.json({
    status: "ok",
    mongodb: database ? "connected" : "disconnected",
    connectionError,
    timestamp: new Date().toISOString()
  });
});

// GET Razorpay Public Key ID from environment variables (Keep Secret Key server-side only!)
app.get("/api/razorpay-key", (req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || ""
  });
});

app.post("/api/razorpay/create-order", async (req, res) => {
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

app.post("/api/admin/test-razorpay-payment", async (req, res) => {
  try {
    const incomingEmail = String(req.body?.email || process.env.SMTP_USER || "").trim();
    const amount = Number(req.body?.amount ?? 1);
    const paymentIdFromBody = String(req.body?.paymentId || "").trim();
    const orderIdFromBody = String(req.body?.orderId || "").trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: "Amount must be greater than zero." });
    }

    if (!incomingEmail) {
      return res.status(400).json({ success: false, error: "No admin email provided for the payment confirmation email." });
    }

    const finalPaymentId = paymentIdFromBody || `pay_admin_test_${Date.now()}`;
    const finalOrderId = orderIdFromBody || `order_admin_test_${Date.now()}`;

    const mailResult = await sendEmail({
      to: incomingEmail,
      toName: "Admin",
      subject: `Razorpay Test Payment Successful - ₹${amount}`,
      text: `Your Razorpay test payment of ₹${amount} was successfully processed using the active CRM integration. Order ID: ${finalOrderId}, Payment ID: ${finalPaymentId}.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6; padding: 24px;">
          <h2 style="margin-bottom: 12px; color: #0f172a;">Razorpay Test Payment Successful</h2>
          <p style="margin: 8px 0;">Your Razorpay test payment of <strong>₹${amount}</strong> was completed successfully.</p>
          <p style="margin: 8px 0;"><strong>Order ID:</strong> ${finalOrderId}</p>
          <p style="margin: 8px 0;"><strong>Payment ID:</strong> ${finalPaymentId}</p>
          <p style="margin-top: 18px; color: #475569;">This was sent from the CRM admin panel using the existing configured SMTP mailer.</p>
        </div>
      `
    });

    return res.json({
      success: true,
      amount,
      paymentId: finalPaymentId,
      orderId: finalOrderId,
      emailSent: mailResult.success,
      emailError: mailResult.error || null
    });
  } catch (error: any) {
    console.error("Admin Razorpay test payment failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Admin test payment failed."
    });
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
app.get("/api/load-all", async (req, res) => {
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
      "leads",
      "plan_purchases",
      "workshop_registrations",
      "emails"
    ];
    
    const data: any = {};
    for (const colName of collections) {
      const col = database.collection(colName);
      const items = await col.find({}).toArray();
      // Strip mongodb internal IDs
      data[colName] = items.map(({ _id, ...rest }) => rest);
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

    const payload = req.body; // Expects: { pages, settings, media, placed_students, hiring_partners, courses, blogs, leads }
    
    for (const [colName, items] of Object.entries(payload)) {
      if (!items) continue;
      const col = database.collection(colName);
      
      // Overwrite collection by clearing old entries
      await col.deleteMany({});
      
      if (Array.isArray(items)) {
        if (items.length > 0) {
          await col.insertMany(items);
        }
      } else if (typeof items === "object") {
        await col.insertOne(items);
      }
    }

    res.json({ success: true, msg: "Successfully synchronized database state with MongoDB!" });
  } catch (error: any) {
    console.error("Error saving CMS datasets:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update Admin Password permanently with Developer Master Password verification
app.post("/api/update-admin-password", async (req, res) => {
  try {
    const { newPassword, developerMasterPassword } = req.body || {};
    
    if (!newPassword) {
      return res.status(400).json({ success: false, msg: "New admin password is required." });
    }

    const expectedMasterPassword = process.env.DEVELOPER_MASTER_PASSWORD || "devmaster123";
    if (developerMasterPassword !== expectedMasterPassword) {
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
      // Insert with some default settings values so we don't break loading
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
    const reg = req.body; // Expects registration object
    const { id, name, email, phone, college, branch, year, workshopTitle, pricePaid, transactionId } = reg;

    // 1. Save to MongoDB if connected
    if (database) {
      const col = database.collection("workshop_registrations");
      await col.insertOne(reg);
    }

    // 2. Generate security QR code URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(id || "TPX-REG-TEMP")}`;

    // 3. Compose elegant HTML Email Body
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

    // 4. Send email via SMTP
    const mailResult = await sendEmail({
      to: email,
      toName: name,
      subject: `Admit Card Entry Pass: ${workshopTitle}`,
      html: htmlBody
    });

    // 5. Always log the dispatch attempt to MongoDB
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
    const purchase = req.body; // Expects purchase receipt object
    const { paymentId, orderId, date, planName, amount, studentName, studentEmail, studentPhone } = purchase;

    // 1. Save to MongoDB if connected
    if (database) {
      const col = database.collection("plan_purchases");
      await col.insertOne(purchase);
    }

    // 2. Generate a verification QR code containing subscription details
    const qrPayload = `Plan: ${planName}\nBuyer: ${studentName}\nEmail: ${studentEmail}\nID: ${paymentId}\nAmt: ₹${amount}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;

    // 3. Compose gorgeous confirmation HTML email
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
        
        <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.15);">
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

    // 4. Send email via SMTP
    const mailResult = await sendEmail({
      to: studentEmail,
      toName: studentName,
      subject: `Plan Purchase Confirmed: ${planName}`,
      html: htmlBody
    });

    // 5. Log email details to MongoDB
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


// --- VITE AND STATIC SERVING MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
