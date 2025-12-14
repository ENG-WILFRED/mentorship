import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function mapStatus(status: string | undefined) {
  if (!status) return 'UPCOMING';
  const s = status.toString().toUpperCase();
  if (s.includes('COMP')) return 'COMPLETED';
  if (s.includes('ONGO')) return 'ONGOING';
  return 'UPCOMING';
}

export async function GET() {
  try {
    const missions = await prisma.mission.findMany({
      orderBy: { date: 'desc' },
      include: {
        mentors: { include: { mentor: true } },
        schools: { include: { school: true } },
      },
    });
    return NextResponse.json(missions);
  } catch (error) {
    console.error('GET /api/missions error', error);
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, date, topic, description, students, status, mentors, schools } = body;

    if (!title || !date) {
      return NextResponse.json({ error: 'Missing required fields: title or date' }, { status: 400 });
    }

    const created = await prisma.mission.create({
      data: {
        title,
        date: new Date(date),
        topic: topic ?? '',
        description: description ?? null,
        students: Number(students) || 0,
        status: mapStatus(status) as any,
      },
    });

    // associate mentors by name (if provided)
    if (Array.isArray(mentors) && mentors.length > 0) {
      const foundMentors = await prisma.mentor.findMany({ where: { name: { in: mentors } } });
      if (foundMentors.length > 0) {
        const mm = foundMentors.map((m) => ({ missionId: created.id, mentorId: m.id }));
        try {
          await prisma.missionMentor.createMany({ data: mm, skipDuplicates: true });
        } catch (e) {
          // ignore
        }
      }
    }

    // associate schools by name (if provided)
    if (Array.isArray(schools) && schools.length > 0) {
      const foundSchools = await prisma.school.findMany({ where: { name: { in: schools } } });
      if (foundSchools.length > 0) {
        const ms = foundSchools.map((s) => ({ missionId: created.id, schoolId: s.id }));
        try {
          await prisma.missionSchool.createMany({ data: ms, skipDuplicates: true });
        } catch (e) {
          // ignore
        }
      }
    }

    const result = await prisma.mission.findUnique({
      where: { id: created.id },
      include: {
        mentors: { include: { mentor: true } },
        schools: { include: { school: true } },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST /api/missions error', error);
    return NextResponse.json({ error: 'Failed to create mission' }, { status: 500 });
  }
}
