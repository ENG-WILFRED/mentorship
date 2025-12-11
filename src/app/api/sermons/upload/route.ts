import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Accept multipart/form-data or JSON. If FormData is used, extract file names.
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const file = form.get('file') as File | null;
      // In a real implementation we'd stream to storage (S3, etc.) or process the file.
      const fileName = file ? (file as File).name : null;
      return NextResponse.json({ ok: true, uploaded: !!file, fileName });
    }

    // Otherwise accept JSON payload
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ ok: true, body });
  } catch (err) {
    console.error('upload route error', err);
    return NextResponse.json({ ok: false, error: 'Invalid upload' }, { status: 400 });
  }
}
