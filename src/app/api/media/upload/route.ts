import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const preset = process.env.CLOUDINARY_UPLOAD_PRESET
    if (!cloudName) return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })

    const formData = await request.formData()
    const file = formData.get('file')
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
    const uploadForm = new FormData()
    uploadForm.append('file', file as any)
    // unsigned upload with preset if present
    if (preset) {
      uploadForm.append('upload_preset', preset)
    } else {
      // If no preset is configured, attempt a signed upload using API key/secret
      const apiKey = process.env.CLOUDINARY_API_KEY
      const apiSecret = process.env.CLOUDINARY_API_SECRET
      if (!apiKey || !apiSecret) {
        return NextResponse.json({ error: 'Cloudinary not configured: set CLOUDINARY_UPLOAD_PRESET or CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET' }, { status: 500 })
      }
      // Create a simple signature using timestamp only - adjust params if you add more
      const timestamp = Math.floor(Date.now() / 1000)
      const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${apiSecret}`).digest('hex')
      uploadForm.append('api_key', apiKey)
      uploadForm.append('timestamp', String(timestamp))
      uploadForm.append('signature', signature)
    }

    const res = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: res.status })

    // Return minimal info
    return NextResponse.json({ url: data.secure_url, public_id: data.public_id, resource_type: data.resource_type, raw: data })
  } catch (error: any) {
    console.error('Cloudinary upload failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
