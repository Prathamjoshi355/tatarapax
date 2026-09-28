import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  return res.status(200).json({ keyId });
}
