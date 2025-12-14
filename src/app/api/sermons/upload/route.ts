import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // If multipart form, extract fields and file name
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const file = form.get('file') as File | null;
      const title = (form.get('title') as string) || null;
      const description = (form.get('description') as string) || null;
      const preacher = (form.get('preacher') as string) || null;
      const youtubeId = (form.get('youtubeId') as string) || null;

      const fileName = file ? (file as File).name : null;

      // If we have a title and either youtubeId or fileName, persist a Sermon record
      if (title && (youtubeId || fileName)) {
        const created = await prisma.sermon.create({
          data: {
            title,
            description: description ?? undefined,
            author: preacher ?? undefined,
            videoUrl: fileName ? `/uploads/${fileName}` : undefined,
            youtubeId: youtubeId ?? undefined,
          },
        });

        return NextResponse.json({ ok: true, uploaded: !!file, fileName, sermon: created });
      }

      return NextResponse.json({ ok: true, uploaded: !!file, fileName });
    }

    // JSON payload (client might send youtubeId after uploading to YouTube)
    const body = await req.json().catch(() => ({}));
    const { title, description, preacher, youtubeId, videoUrl } = body || {};

    if (title && (youtubeId || videoUrl)) {
      const created = await prisma.sermon.create({
        data: {
          title,
          description: description ?? undefined,
          author: preacher ?? undefined,
          videoUrl: videoUrl ?? undefined,
          youtubeId: youtubeId ?? undefined,
        },
      });

      return NextResponse.json({ ok: true, sermon: created });
    }

    return NextResponse.json({ ok: true, body });
  } catch (err: any) {
    console.error('upload route error', err.message || err);
    return NextResponse.json({ ok: false, error: 'Invalid upload' }, { status: 400 });
  }
}
