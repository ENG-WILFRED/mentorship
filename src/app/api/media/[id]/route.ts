import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth.server'

export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = context || {}
    const id = parseInt(params?.id)
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const media = await prisma.media.findUnique({ where: { id }, include: { uploader: true, tags: true } })
    if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.media.update({ where: { id }, data: { views: { increment: 1 } } })

    return NextResponse.json({ ...media, date: media.date.toISOString().split('T')[0], createdAt: media.createdAt.toISOString(), updatedAt: media.updatedAt.toISOString(), cloudinaryPublicId: media.cloudinaryPublicId, youtubeId: media.youtubeId, videoUrl: media.videoUrl })
  } catch (error) {
    console.error('Error fetching media by id:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { params } = context || {}
    const id = parseInt(params?.id)
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const existing = await prisma.media.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    if (existing.uploaderId !== user.id && user.role !== 'ADMIN') return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

    const body = await request.json()
    const updated = await prisma.media.update({ where: { id }, data: {
      caption: body.caption,
      description: body.description,
      cloudinaryPublicId: body.cloudinaryPublicId ?? undefined,
      youtubeId: body.youtubeId ?? undefined,
      videoUrl: body.videoUrl ?? undefined,
      category: body.category,
      tags: body.tags ? { set: [], connectOrCreate: body.tags.map((tagName: string) => ({ where: { name: tagName.toLowerCase().trim() }, create: { name: tagName.toLowerCase().trim() } })) } : undefined
    }, include: { uploader: true, tags: true } })

    return NextResponse.json({ ...updated, date: updated.date.toISOString().split('T')[0], cloudinaryPublicId: updated.cloudinaryPublicId, youtubeId: updated.youtubeId, videoUrl: updated.videoUrl })
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 })
  }
}
