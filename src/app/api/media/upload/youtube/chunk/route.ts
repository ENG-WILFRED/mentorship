import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { getCurrentUser, checkUserRole } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser(request as any)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!checkUserRole(user, ['ADMIN', 'MENTOR'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const fd = await request.formData()
    const uploadId = fd.get('uploadId') as string | null
    const chunkIndex = fd.get('index') as string | null
    const chunkBlob = fd.get('chunk') as Blob | null
    if (!uploadId || !chunkBlob || !chunkIndex) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    const tmpDir = path.join(os.tmpdir(), 'media_uploads')
    const partPath = path.join(tmpDir, `${uploadId}.part`)
    // Append chunk
    const arr = await (chunkBlob as Blob).arrayBuffer()
    const buffer = Buffer.from(arr)
    fs.appendFileSync(partPath, buffer)

    return NextResponse.json({ ok: true, chunkIndex: Number(chunkIndex) })
  } catch (error: any) {
    console.error('Chunk upload failed', error)
    return NextResponse.json({ error: 'Chunking failed' }, { status: 500 })
  }
}
