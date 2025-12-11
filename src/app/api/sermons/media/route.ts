// app/api/media/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Public endpoint - no auth required for viewing
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause
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
        { tags: { some: { name: { contains: search, mode: 'insensitive' } } } }
      ]
    }

    // Get media with pagination
    const [media, total] = await Promise.all([
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
          tags: true
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.media.count({ where })
    ])

    return NextResponse.json({
      data: media,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication for POST
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check role - only ADMIN and maybe MENTOR can upload
    const allowedRoles = ['ADMIN', 'MENTOR'] // Adjust as needed
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const { url, caption, type, category, date } = body
    
    if (!url || !caption || !type || !category || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create media with tags
    const media = await prisma.media.create({
      data: {
        url,
        caption,
        type: type.toUpperCase(),
        category: category.toUpperCase(),
        date: new Date(date),
        uploaderId: user.id,
        thumbnail: body.thumbnail,
        description: body.description,
        location: body.location,
        tags: {
          connectOrCreate: body.tags?.map((tagName: string) => ({
            where: { name: tagName.toLowerCase() },
            create: { name: tagName.toLowerCase() }
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
        tags: true
      }
    })

    return NextResponse.json(media, { status: 201 })

  } catch (error: any) {
    console.error('Error creating media:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Duplicate media entry' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}