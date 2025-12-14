import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { oauthClientWithRefresh } from '@/lib/google'
import { Readable } from 'stream'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as Blob | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const title = (formData.get('title') as string) || 'Video upload'
    const description = (formData.get('description') as string) || ''

    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
    if (!refreshToken) {
      return NextResponse.json({ error: 'Missing GOOGLE_REFRESH_TOKEN in environment. Obtain via the OAuth flow and set it in your environment.' }, { status: 500 })
    }

    const auth = oauthClientWithRefresh(refreshToken)
    const youtube = google.youtube({ version: 'v3', auth })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const stream = Readable.from(buffer)

    let uploadRes
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
          }
        },
        media: {
          body: stream
        }
      })
    } catch (err: unknown) {
      console.error('YouTube upload failed', err)
      return NextResponse.json({ error: 'YouTube upload failed' }, { status: 500 })
    }

    const videoId = uploadRes.data.id as string | undefined
    if (!videoId) return NextResponse.json({ error: 'Failed to obtain youtube id' }, { status: 500 })

    // Get snippet to retrieve thumbnail info
    const details = await youtube.videos.list({ part: ['snippet'], id: [videoId] })
    const snippet = details.data.items?.[0]?.snippet
    const thumbnails = snippet?.thumbnails
    // prefer high-quality if available
    const thumbnail = thumbnails?.maxres?.url || thumbnails?.high?.url || thumbnails?.standard?.url || thumbnails?.default?.url || null

    return NextResponse.json({ youtubeId: videoId, videoUrl: `https://www.youtube.com/watch?v=${videoId}`, thumbnail })
  } catch (error: any) {
    console.error('YouTube upload route error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}
