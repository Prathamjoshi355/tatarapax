import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib/mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { db, connectionError } = await getDb();
    if (!db) {
      return res.status(503).json({
        success: false,
        msg: "MongoDB is not connected. Cannot write to database.",
        connectionError
      });
    }

    const payload = req.body; // Expects: { pages, settings, media, placed_students, hiring_partners, courses, blogs, leads }
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, error: "Invalid payload format" });
    }
    
    for (const [colName, items] of Object.entries(payload)) {
      if (!items) continue;
      const col = db.collection(colName);
      
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

    return res.status(200).json({ success: true, msg: "Successfully synchronized database state with MongoDB!" });
  } catch (error: any) {
    console.error("Error saving CMS datasets:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
