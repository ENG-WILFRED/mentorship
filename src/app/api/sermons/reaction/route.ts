import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sermonId, userId, emoji } = body || {};
    if (!sermonId || !emoji) {
      return NextResponse.json({ ok: false, error: 'Missing sermonId or emoji' }, { status: 400 });
    }

    // TODO: toggle reaction in DB using Prisma. For now return a placeholder.
    return NextResponse.json({ ok: true, reaction: { id: Date.now(), sermonId, userId: userId ?? null, emoji }, counts: { [emoji]: 1 } });
  } catch (err) {
    console.error('reaction route error', err);
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
