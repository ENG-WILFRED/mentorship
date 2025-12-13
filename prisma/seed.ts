// prisma/seed.ts
import { PrismaClient, MediaType, MediaCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with 10 real media items...')

  // Clear existing media and tags (keep users!)
  console.log('🧹 Cleaning existing media and tags...')
  await prisma.media.deleteMany({})
  await prisma.tag.deleteMany({})

  // Find an existing user to attach media to
  console.log('👤 Looking for existing user...')
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { role: 'ADMIN' },
        { role: 'MENTOR' }
      ]
    },
    orderBy: { id: 'asc' }
  })

  if (!existingUser) {
    const anyUser = await prisma.user.findFirst({
      orderBy: { id: 'asc' }
    })
    
    if (!anyUser) {
      console.error('❌ No users found! Please create a user first.')
      console.log('💡 Tip: Register a user through your auth system first.')
      return
    }
    
    console.log(`👤 Using user: ${anyUser.firstName} ${anyUser.lastName} (${anyUser.role})`)
  } else {
    console.log(`👤 Found user: ${existingUser.firstName} ${existingUser.lastName} (${existingUser.role})`)
  }

  const userId = existingUser?.id || 1

  // Create tags
  console.log('🏷️ Creating tags...')
  const tags = [
    'mission', 'outreach', 'youth', 'school', 'leadership',
    'workshop', 'sermon', 'worship', 'event', 'students',
    'community', 'faith', 'bible', 'prayer', 'training'
  ]

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName }
    })
  }

  console.log(`✅ Created ${tags.length} tags`)

  // 10 REAL Media Items (using Unsplash images)
  console.log('📸 Creating 10 media items...')
  
  const mediaItems = [
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      caption: 'Nairobi High School Outreach Mission',
      type: 'IMAGE' as MediaType,
      category: 'MISSION' as MediaCategory,
      date: new Date('2024-01-15'),
      location: 'Nairobi High School, Nairobi',
      description: 'Successful mentorship program with 250+ students attending career guidance and spiritual sessions.',
      likes: 156,
      views: 842,
      tags: ['mission', 'school', 'outreach', 'youth', 'leadership'],
      cloudinaryPublicId: 'unsplash/nairobi_high_school_01'
    },
    {
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
      caption: 'St. Mary\'s Academy Leadership Workshop',
      type: 'IMAGE' as MediaType,
      category: 'MISSION' as MediaCategory,
      date: new Date('2024-01-12'),
      location: 'St. Mary\'s Academy, Nairobi',
      description: 'Interactive leadership development workshop focusing on teamwork and communication skills.',
      likes: 98,
      views: 512,
      tags: ['workshop', 'leadership', 'training', 'students'],
      cloudinaryPublicId: 'unsplash/st_marys_leadership_01'
    },
    {
      // Video - store YouTube test link and id
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      caption: 'Sunday Youth Service Full Recording',
      type: 'VIDEO' as MediaType,
      category: 'SERMON' as MediaCategory,
      date: new Date('2024-01-14'),
      location: 'Main Church Sanctuary',
      description: 'Complete recording of youth Sunday service with powerful message on spiritual growth and purpose.',
      likes: 243,
      views: 1250,
      tags: ['sermon', 'youth', 'worship', 'faith'],
      youtubeId: 'dQw4w9WgXcQ',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659',
      thumbnail: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=300&fit=crop',
      caption: 'Weekly Bible Study: Book of Proverbs',
      type: 'IMAGE' as MediaType,
      category: 'MISSION' as MediaCategory,
      date: new Date('2024-01-08'),
      location: 'Community Center Hall',
      description: 'In-depth bible study session focusing on wisdom and character development from Proverbs.',
      likes: 87,
      views: 432,
      tags: ['bible', 'study', 'faith', 'wisdom']
    },
    {
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
      caption: 'Career Guidance & University Prep Seminar',
      type: 'IMAGE' as MediaType,
      category: 'EVENT' as MediaCategory,
      date: new Date('2024-01-10'),
      location: 'Tech Institute Auditorium',
      description: 'Comprehensive career guidance for final year students exploring university options and career paths.',
      likes: 132,
      views: 698,
      tags: ['career', 'seminar', 'education', 'students'],
      cloudinaryPublicId: 'unsplash/career_guidance_01'
    },
    {
      url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
      thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop',
      caption: 'Community Service & Clean-up Campaign',
      type: 'IMAGE' as MediaType,
      category: 'MISSION' as MediaCategory,
      date: new Date('2024-01-05'),
      location: 'Local Community Park, Nairobi',
      description: 'Students and volunteers participating in community service and environmental conservation activities.',
      likes: 201,
      views: 945,
      tags: ['community', 'service', 'outreach', 'environment']
    },
    {
      // Video - sample YouTube upload
      url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
      thumbnail: 'https://img.youtube.com/vi/oHg5SJYRHA0/hqdefault.jpg',
      caption: 'Prayer & Worship Night for Students',
      type: 'VIDEO' as MediaType,
      category: 'SERMON' as MediaCategory,
      date: new Date('2024-01-07'),
      location: 'Church Main Hall',
      description: 'Special prayer night dedicated to students preparing for national examinations and life decisions.',
      likes: 178,
      views: 876,
      tags: ['prayer', 'worship', 'students', 'faith'],
      youtubeId: 'oHg5SJYRHA0',
      videoUrl: 'https://www.youtube.com/watch?v=oHg5SJYRHA0'
    },
    {
      url: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a',
      thumbnail: 'https://images.unsplash.com/photo-1565688534245-05d6b3f8f5be?w=400&h=300&fit=crop',
      caption: 'Student Testimonies & Impact Report',
      type: 'DOCUMENT' as MediaType,
      category: 'STUDENT' as MediaCategory,
      date: new Date('2024-01-18'),
      location: 'Youth Center Conference Room',
      description: 'Document compiling student testimonies about how mentorship transformed their academic and personal lives.',
      likes: 65,
      views: 321,
      tags: ['testimony', 'students', 'impact', 'report']
    },
    {
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
      caption: 'Music & Creative Arts Talent Show',
      type: 'IMAGE' as MediaType,
      category: 'EVENT' as MediaCategory,
      date: new Date('2024-01-20'),
      location: 'Creative Arts Center, Nairobi',
      description: 'Annual talent show showcasing student talents in music, dance, poetry, and visual arts.',
      likes: 189,
      views: 1024,
      tags: ['arts', 'music', 'talent', 'event', 'students']
    },
    {
      url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
      thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=300&fit=crop',
      caption: 'Sports & Team Building Tournament',
      type: 'IMAGE' as MediaType,
      category: 'EVENT' as MediaCategory,
      date: new Date('2024-01-22'),
      location: 'School Sports Complex',
      description: 'Inter-school sports tournament promoting teamwork, discipline, and healthy competition among students.',
      likes: 145,
      views: 756,
      tags: ['sports', 'teamwork', 'fitness', 'event']
    }
  ]

  // Create each media item
  for (let i = 0; i < mediaItems.length; i++) {
    const data = mediaItems[i]
    
    const media = await prisma.media.create({
      data: {
        url: data.url,
        thumbnail: data.thumbnail,
        caption: data.caption,
        type: data.type,
        category: data.category,
        date: data.date,
        location: data.location,
        description: data.description,
        likes: data.likes,
        views: data.views,
        uploaderId: userId,
        tags: {
          // Use connectOrCreate so seeding is resilient if tags were not pre-created
          connectOrCreate: data.tags.map(tagName => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        },
        // Optional cloudinary and youtube test fields (mostly for manual inspection)
        cloudinaryPublicId: data.cloudinaryPublicId || null,
        youtubeId: data.youtubeId || null,
        videoUrl: data.videoUrl || null
      }
    })
    
    console.log(`✅ ${i + 1}. ${media.caption}`)
  }

  console.log('\n🎉 SEEDING COMPLETED SUCCESSFULLY!')
  console.log('=' .repeat(50))
  console.log(`📊 Total Media Items: ${mediaItems.length}`)
  console.log(`🏷️ Total Tags: ${tags.length}`)
  console.log(`👤 Uploaded by: User ID ${userId}`)
  console.log('=' .repeat(50))
  console.log('\n🚀 Your MediaGallery is now ready with REAL data!')
  console.log('👉 Restart your dev server and check the dashboard.')
}

main()
  .catch((e) => {
    console.error('❌ SEEDING ERROR:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })