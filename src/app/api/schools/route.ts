import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const schools = await prisma.school.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(schools);
  } catch (error) {
    console.error('GET /api/schools error', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, gender, population, location, contact, logo } = body;

    if (!name || !gender || !population || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await prisma.school.create({
      data: {
        name,
        gender,
        population: Number(population) || 0,
        location,
        contact: contact ?? null,
        logo: logo ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST /api/schools error', error);
    return NextResponse.json({ error: 'Failed to create school' }, { status: 500 });
  }
}
