import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Minimal handler: validate basic fields
    const { sermonId, userId, message } = body || {};
    if (!sermonId || !message) {
      return NextResponse.json({ ok: false, error: 'Missing sermonId or message' }, { status: 400 });
    }

    // TODO: integrate with Prisma to persist comment.
    // For now return success and echo the payload so the client can proceed.
    return NextResponse.json({ ok: true, comment: { id: Date.now(), sermonId, userId: userId ?? null, message } });
  } catch (err) {
    console.error('comment route error', err);
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
