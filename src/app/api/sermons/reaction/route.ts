import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sermonId, emoji } = body || {};

    if (!sermonId || !emoji) {
      return NextResponse.json({ ok: false, error: 'Missing sermonId or emoji' }, { status: 400 });
    }

    // Get userId from Authorization header
    const authHeader = req.headers.get('Authorization');
    let userId: number | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          userId = payload.userId ?? null;
        }
      } catch (e) {
        console.error('Failed to parse JWT:', e);
      }
    }

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Unauthorized: User not authenticated' }, { status: 401 });
    }

    // Check if user already reacted with this emoji
    const existingReaction = await prisma.sermonReaction.findFirst({
      where: {
        sermonId,
        userId,
        emoji,
      },
    });

    let reaction;
    if (existingReaction) {
      // Toggle off: delete the reaction
      await prisma.sermonReaction.delete({
        where: { id: existingReaction.id },
      });
      reaction = null;
    } else {
      // Toggle on: create the reaction
      reaction = await prisma.sermonReaction.create({
        data: {
          sermonId,
          userId,
          emoji,
        },
      });
    }

    // Get updated reaction counts
    const reactions = await prisma.sermonReaction.findMany({
      where: { sermonId },
    });

    const counts = reactions.reduce(
      (acc, r) => ({ ...acc, [r.emoji]: (acc[r.emoji] || 0) + 1 }),
      {} as Record<string, number>
    );

    return NextResponse.json({ ok: true, reaction, counts });
  } catch (err) {
    console.error('reaction route error', err);
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
