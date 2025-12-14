import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sermonId, message } = body || {};

    if (!sermonId || !message) {
      return NextResponse.json({ ok: false, error: 'Missing sermonId or message' }, { status: 400 });
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

    // Save comment to database
    const comment = await prisma.sermonComment.create({
      data: {
        message,
        userId,
        sermonId,
      },
    });

    return NextResponse.json({ ok: true, comment });
  } catch (err) {
    console.error('comment route error', err);
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
