import type { NextApiRequest } from 'next';
import formidable, { type Fields, type Files, type File } from 'formidable';
import fs from 'fs';
import { IncomingMessage } from 'http';
import { google } from 'googleapis';
import { oauthClientWithRefresh } from '@/lib/google';
import { prisma } from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextApiRequest) {
  const form = formidable({ multiples: false });
  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    // formidable expects a Node IncomingMessage
    form.parse(req as unknown as IncomingMessage, (err: unknown, fields: Fields, files: Files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function handleSermonUpload(req: NextApiRequest) {
  if (req.method !== 'POST') throw new Error('Method Not Allowed');

  const { fields, files } = await parseForm(req);

  const fileField = files.file;
  let file: File | undefined;
  if (Array.isArray(fileField)) file = fileField[0] as File;
  else file = fileField as File | undefined;

  if (!file) throw new Error('No file uploaded');

  // Normalize form fields: `formidable` can produce string | string[] | undefined
  const normalizeField = (v: string | string[] | undefined) => {
    if (v === undefined) return undefined;
    return Array.isArray(v) ? v[0] : v;
  };

  const title = normalizeField(fields.title as string | string[] | undefined) || (file as File).originalFilename || 'Sermon';
  const description = normalizeField(fields.description as string | string[] | undefined) || '';

  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) {
    // Provide a helpful error so developers know how to fix this during local development.
    throw new Error(
      'Missing server refresh token. Set `GOOGLE_REFRESH_TOKEN` in your environment (e.g. .env.local).\n' +
      'You can obtain a refresh token by visiting the OAuth flow: GET /api/google/auth-url and completing the consent, then exchange the code at /api/google/callback.\n' +
      'For local dev: add the value to `.env.local` as `GOOGLE_REFRESH_TOKEN=your_refresh_token` and restart the server.'
    );
  }

  const auth = oauthClientWithRefresh(refreshToken);
  const youtube = google.youtube({ version: 'v3', auth });

  const fileObj = file as { filepath?: string; path?: string };
  const filePath = fileObj.filepath ?? fileObj.path;
  if (!filePath) throw new Error('Could not determine temp file path');
  const fileStream = fs.createReadStream(filePath);

  let uploadRes;
  try {
    uploadRes = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: process.env.YOUTUBE_DEFAULT_PRIVACY || 'unlisted',
        },
      },

      media: {
        body: fileStream,
      },
    });
  } catch (err: unknown) {
    // Surface helpful debug info without using `any`.
    type ErrWithResponse = { response?: { data?: unknown } };
    let debugInfo: unknown = err;
    if (typeof err === 'object' && err !== null && 'response' in err) {
      const e = err as ErrWithResponse;
      debugInfo = e.response?.data ?? err;
    }
    console.error('YouTube upload failed', debugInfo);
    throw err;
  }

  const videoId = uploadRes.data.id as string | undefined;

  // (Optional) fetch metadata if we have a video id
  if (videoId) {
    await youtube.videos.list({ part: ['snippet', 'contentDetails'], id: [videoId] });
  }

  // Build data using only fields present in the current Prisma schema.
  const sermonData = {
    title,
    description: description || undefined,
    author: normalizeField(fields.preacher as string | string[] | undefined) || undefined,
    videoUrl: undefined,
    youtubeId: videoId ?? undefined,
  } as any;

  const sermon = await prisma.sermon.create({ data: sermonData });

  // cleanup tmp file
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    console.warn('cleanup failed', e);
  }

  return sermon;
}
