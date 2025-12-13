// app/api/media/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest, context: any) {
  const { params } = context || {}
  try {
    const id = parseInt(params.id)
    
    const media = await prisma.media.findUnique({
      where: { id },
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
    
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await prisma.media.update({
      where: { id },
      data: { views: { increment: 1 } }
    })
    
    return NextResponse.json(media)
    
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: any) {
  const { params } = context || {}
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const id = parseInt(params.id)
    const body = await request.json()
    
    // Check if media exists and user owns it
    const existing = await prisma.media.findUnique({
      where: { id }
    })
    
    if (!existing) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }
    
    // Only owner or admin can update
    if (existing.uploaderId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not authorized to update this media' },
        { status: 403 }
      )
    }
    
    // Update media
    const updated = await prisma.media.update({
      where: { id },
      data: {
        caption: body.caption,
        description: body.description,
        category: body.category,
        tags: body.tags ? {
          set: [], // Clear existing tags
          connectOrCreate: body.tags.map((tagName: string) => ({
            where: { name: tagName.toLowerCase() },
            create: { name: tagName.toLowerCase() }
          }))
        } : undefined
      },
      include: {
        uploader: true,
        tags: true
      }
    })
    
    return NextResponse.json(updated)
    
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}