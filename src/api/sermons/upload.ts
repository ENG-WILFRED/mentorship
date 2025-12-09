import type { NextApiRequest, NextApiResponse } from 'next';
import { handleSermonUpload } from '@/actions/uploadSermon';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  // TODO: auth check - ensure admin
  try {
    const sermon = await handleSermonUpload(req);
    return res.status(200).json({ sermon });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed', details: String(err) });
  }
}
