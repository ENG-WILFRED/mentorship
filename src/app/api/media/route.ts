import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = {}
    if (category && category !== 'all') where.category = category.toUpperCase()
    if (type && type !== 'all') where.type = type.toUpperCase()
    if (search) {
      where.OR = [
        { caption: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { tags: { some: { name: { contains: search, mode: 'insensitive' } } } }
      ]
    }

    const [total, media] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        include: {
          uploader: { select: { id: true, firstName: true, lastName: true, email: true } },
          tags: { select: { id: true, name: true } }
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ])

    const formatted = media.map((item) => ({
      id: item.id,
      url: item.url || '',
      cloudinaryPublicId: item.cloudinaryPublicId || null,
      youtubeId: item.youtubeId || null,
      videoUrl: item.videoUrl || null,
      caption: item.caption || '',
      type: item.type,
      category: item.category,
      date: item.date.toISOString().split('T')[0],
      location: item.location || null,
      description: item.description || null,
      uploaderId: item.uploaderId,
      uploader: item.uploader,
      likes: item.likes || 0,
      views: item.views || 0,
      tags: item.tags || [],
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }))

    return NextResponse.json({
      data: formatted,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error: any) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ data: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 }, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const allowedRoles = ['ADMIN', 'MENTOR', 'GUEST']
    if (!allowedRoles.includes(decoded.role)) return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })

    const body = await request.json()
    const requiredFields = ['url', 'caption', 'type', 'category', 'date']
    for (const field of requiredFields) if (!body[field]) return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })

    const media = await prisma.media.create({
      data: {
        url: body.url,
        thumbnail: body.thumbnail || null,
        caption: body.caption,
        type: body.type.toUpperCase(),
        category: body.category.toUpperCase(),
        date: new Date(body.date),
        location: body.location || null,
        description: body.description || null,
        uploaderId: decoded.userId,
          cloudinaryPublicId: body.cloudinaryPublicId || null,
          youtubeId: body.youtubeId || null,
          videoUrl: body.videoUrl || null,
        tags: {
          connectOrCreate: (body.tags || []).map((tagName: string) => ({ where: { name: tagName.toLowerCase().trim() }, create: { name: tagName.toLowerCase().trim() } }))
        }
      },
      include: { uploader: true, tags: true }
    })

    return NextResponse.json({ ...media, date: media.date.toISOString().split('T')[0], cloudinaryPublicId: media.cloudinaryPublicId, youtubeId: media.youtubeId, videoUrl: media.videoUrl }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating media:', error)
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 })
  }
}
