import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        mission: true,
        school: true,
      },
      take: 20,
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { missionId, schoolId, date, topic, students, outcome } = body;

    // Validate required fields
    if (!missionId || !schoolId || !date || !topic || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: missionId, schoolId, date, topic, outcome' },
        { status: 400 }
      );
    }

    // Validate that mission and school exist
    const [mission, school] = await Promise.all([
      prisma.mission.findUnique({ where: { id: parseInt(missionId) } }),
      prisma.school.findUnique({ where: { id: parseInt(schoolId) } }),
    ]);

    if (!mission || !school) {
      return NextResponse.json(
        { error: 'Mission or School not found' },
        { status: 404 }
      );
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        missionId: parseInt(missionId),
        schoolId: parseInt(schoolId),
        date: new Date(date),
        topic,
        students: parseInt(students) || 0,
        outcome,
      },
      include: {
        mission: true,
        school: true,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Failed to create report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
