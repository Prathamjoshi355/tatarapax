import { VercelRequest, VercelResponse } from '@vercel/node';

// Use dynamic import inside the handler so this file stays compatible with ESM runtimes
let cloudinary: any = null;

async function ensureCloudinary() {
  if (cloudinary) return cloudinary;
  const mod = await import('cloudinary');
  cloudinary = mod.v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const data = body.data;
    const folder = body.folder || 'Tantrapex';

    if (!data) {
      return res.status(400).json({ success: false, message: 'Missing image data' });
    }

    const cl = await ensureCloudinary();
    const result = await cl.uploader.upload(data, {
      folder,
      overwrite: false,
      resource_type: 'image',
    });

    return res.status(200).json({ success: true, url: result.secure_url, public_id: result.public_id, raw: result });
  } catch (err: any) {
    console.error('Upload to Cloudinary failed:', err);
    return res.status(500).json({ success: false, message: err.message || String(err) });
  }
}
