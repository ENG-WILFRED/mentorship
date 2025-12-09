import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUrlAction } from '@/actions/google';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // thin wrapper: validation/auth checks can remain here if desired
  const url = getAuthUrlAction();
  res.status(200).json({ url });
}
