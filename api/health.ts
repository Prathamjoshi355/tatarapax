import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib/mongodb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { db, connectionError } = await getDb();
  return res.status(200).json({
    status: "ok",
    mongodb: db ? "connected" : "disconnected",
    connectionError,
    timestamp: new Date().toISOString()
  });
}
