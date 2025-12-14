
// app/api/media/route.ts
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

    // Build where clause safely
    const where: any = {}
    
    if (category && category !== 'all') {
      where.category = category.toUpperCase()
    }
    
    if (type && type !== 'all') {
      where.type = type.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { caption: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        {
          tags: {
            some: {
              name: { contains: search, mode: 'insensitive' }
            }
          }
        }
      ]
    }

    // Get total count and paginated data
    const [total, media] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          tags: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ])

    // Format response with null safety
    const formattedMedia = media.map((item: { id: any; url: any; thumbnail?: any; caption: any; type: any; category: any; date: { toISOString: () => string }; location: any; description: any; uploaderId: any; uploader: any; likes: any; views: any; tags: any; createdAt: { toISOString: () => any }; updatedAt: { toISOString: () => any } }) => ({
      id: item.id,
      url: item.url || '',
      thumbnail: item.thumbnail || null,
      caption: item.caption || '',
      type: item.type,
      category: item.category,
      date: item.date.toISOString().split('T')[0],
      location: item.location || null,
      description: item.description || null,
      uploaderId: item.uploaderId,
      uploader: item.uploader || {
        id: 0,
        firstName: 'Unknown',
        lastName: 'User',
        email: ''
      },
      likes: item.likes || 0,
      views: item.views || 0,
      tags: item.tags || [],
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }))

    return NextResponse.json({
      data: formattedMedia,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error('Error fetching media:', error)
    
    // Return empty data with error message
    return NextResponse.json({
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      },
      error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch media'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check user role
    const allowedRoles = ['ADMIN', 'MENTOR']
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['url', 'caption', 'type', 'category', 'date']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create media with tags
    const media = await prisma.media.create({
      data: {
        url: body.url,
        caption: body.caption,
        type: body.type.toUpperCase(),
        category: body.category.toUpperCase(),
        date: new Date(body.date),
        location: body.location || null,
        description: body.description || null,
        uploaderId: decoded.userId,
        tags: {
          connectOrCreate: (body.tags || []).map((tagName: string) => ({
            where: { name: tagName.toLowerCase().trim() },
            create: { name: tagName.toLowerCase().trim() }
          }))
        }
      },
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        tags: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Format response
    const response = {
      id: media.id,
      url: media.url,
      caption: media.caption,
      type: media.type,
      category: media.category,
      date: media.date.toISOString().split('T')[0],
      location: media.location,
      description: media.description,
      uploaderId: media.uploaderId,
      uploader: media.uploader,
      likes: media.likes,
      views: media.views,
      tags: media.tags,
      createdAt: media.createdAt.toISOString(),
      updatedAt: media.updatedAt.toISOString()
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error: any) {
    console.error('Error creating media:', error)
    
    // Handle specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Duplicate entry found' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    )
  }
}