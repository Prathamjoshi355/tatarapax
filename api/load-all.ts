import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib/mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { db, connectionError } = await getDb();
    if (!db) {
      return res.status(200).json({
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
      const col = db.collection(colName);
      const items = await col.find({}).toArray();
      // Strip mongodb internal IDs
      data[colName] = items.map(({ _id, ...rest }) => rest);
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error loading all data:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
