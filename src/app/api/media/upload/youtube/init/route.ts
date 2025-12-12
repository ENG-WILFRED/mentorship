import { NextResponse } from 'next/server'
import crypto from 'crypto'
import os from 'os'
import path from 'path'
import fs from 'fs'
import { getCurrentUser, checkUserRole } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser(request as any)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!checkUserRole(user, ['ADMIN', 'MENTOR'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { filename } = Object.fromEntries(await request.formData() as any)
    const uploadId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex')
    const tmpDir = path.join(os.tmpdir(), 'media_uploads')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    const filePath = path.join(tmpDir, `${uploadId}.part`)
    // create empty file
    fs.writeFileSync(filePath, '')

    return NextResponse.json({ uploadId, filePath })
  } catch (err: any) {
    console.error('Init upload failed', err)
    return NextResponse.json({ error: 'Init failed' }, { status: 500 })
  }
}
