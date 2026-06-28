import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../_lib/mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { db } = await getDb();
    const lead = req.body;
    
    if (db) {
      const col = db.collection("leads");
      await col.insertOne(lead);
      return res.status(200).json({ success: true, msg: "Lead stored in MongoDB", data: lead });
    }

    return res.status(200).json({
      success: false,
      msg: "MongoDB is disconnected. Saved locally on frontend.",
      data: lead
    });
  } catch (error: any) {
    console.error("Error adding lead:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
