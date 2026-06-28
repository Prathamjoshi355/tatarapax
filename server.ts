import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { MongoClient, Db } from "mongodb";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy MongoDB Client Initialization
const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let db: Db | null = null;
let lastAttemptTime = 0;
let connectionError: string | null = null;

async function getDb(): Promise<Db | null> {
  if (!uri) {
    connectionError = "MONGODB_URI is not defined. Please add it via AI Studio settings.";
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
      "leads"
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
