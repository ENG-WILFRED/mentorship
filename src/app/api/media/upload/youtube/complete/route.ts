import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { google } from 'googleapis'
import { oauthClientWithRefresh } from '@/lib/google'
import { getCurrentUser, checkUserRole } from '@/lib/auth.server'

export async function POST(request: Request) {
  const user = await getCurrentUser(request as any)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!checkUserRole(user, ['ADMIN', 'MENTOR'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const fd = await request.formData()
    const uploadId = fd.get('uploadId') as string | null
    const title = fd.get('title') as string | null
    const description = fd.get('description') as string | null
    if (!uploadId) return NextResponse.json({ error: 'Missing uploadId' }, { status: 400 })

    const tmpDir = path.join(os.tmpdir(), 'media_uploads')
    const partPath = path.join(tmpDir, `${uploadId}.part`)
    if (!fs.existsSync(partPath)) return NextResponse.json({ error: 'Upload session not found' }, { status: 404 })

    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
    if (!refreshToken) return NextResponse.json({ error: 'Missing GOOGLE_REFRESH_TOKEN' }, { status: 500 })

    const auth = oauthClientWithRefresh(refreshToken)
    const youtube = google.youtube({ version: 'v3', auth })

    const fileStream = fs.createReadStream(partPath)

    let uploadRes
    try {
      uploadRes = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: { title: title || 'Video upload', description: description || '' },
          status: { privacyStatus: process.env.YOUTUBE_DEFAULT_PRIVACY || 'unlisted' }
        },
        media: { body: fileStream }
      })
    } catch (err) {
      console.error('YouTube upload failed', err)
      return NextResponse.json({ error: 'YouTube upload failed' }, { status: 500 })
    }

    const videoId = uploadRes.data.id as string | undefined
    // Cleanup part file
    try {
      fs.unlinkSync(partPath)
    } catch (e) {
      console.warn('Cleanup failed', e)
    }

    // Fetch snippet for thumbnails
    const details = await youtube.videos.list({ part: ['snippet'], id: [videoId || ''] })
    const snippet = details.data.items?.[0]?.snippet
    const thumbnails = snippet?.thumbnails
    const thumbnail = thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.standard?.url || thumbnails?.default?.url || null

    return NextResponse.json({ youtubeId: videoId, videoUrl: `https://www.youtube.com/watch?v=${videoId}`, thumbnail })
  } catch (error: any) {
    console.error('Complete upload failed', error)
    return NextResponse.json({ error: 'Complete failed' }, { status: 500 })
  }
}
