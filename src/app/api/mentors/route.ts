import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const mentors = await prisma.mentor.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(mentors);
  } catch (error) {
    console.error('GET /api/mentors error', error);
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, age, education, maritalStatus, phone, email, experience, skills, bio } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const created = await prisma.mentor.create({
      data: {
        name,
        location: location ?? null,
        age: age ? Number(age) : null,
        education: education ?? null,
        maritalStatus: maritalStatus ?? null,
        phone: phone ?? null,
        email: email ?? null,
        experience: experience ? Number(experience) : null,
        skills: skills ?? null,
        bio: bio ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST /api/mentors error', error);
    return NextResponse.json({ error: 'Failed to create mentor' }, { status: 500 });
  }
}
