import type { VercelRequest, VercelResponse } from "@vercel/node";

async function createRazorpayOrder({
  keyId,
  keySecret,
  amount,
  currency = "INR",
  receipt = "tantrapex-order",
  notes = {},
}: {
  keyId: string;
  keySecret: string;
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { amount = 0, currency = "INR", receipt = "tantrapex-order", notes = {} } = req.body || {};
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";

    const order = await createRazorpayOrder({
      keyId,
      keySecret,
      amount: numericAmount,
      currency,
      receipt,
      notes,
    });

    if (!order.success) {
      return res.status(500).json(order);
    }

    return res.status(200).json(order);
  } catch (error: any) {
    console.error("Error in Razorpay order handler:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}
