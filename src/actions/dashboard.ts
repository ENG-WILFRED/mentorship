'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardData() {
  try {
    const [schools, mentors, missions, reports, prayerRequests] = await Promise.all([
      prisma.school.findMany({
        take: 10,
      }),
      prisma.mentor.findMany({
        take: 10,
        include: {
          missions: true,
        },
      }),
      prisma.mission.findMany({
        take: 10,
        orderBy: {
          date: 'desc',
        },
        include: {
          mentors: {
            include: {
              mentor: true,
            },
          },
          schools: {
            include: {
              school: true,
            },
          },
        },
      }),
      prisma.report.findMany({
        take: 10,
        orderBy: {
          date: 'desc',
        },
        include: {
          mission: true,
          school: true,
        },
      }),
      prisma.prayerRequest.findMany({
        take: 10,
        orderBy: {
          date: 'desc',
        },
        include: {
          createdBy: true,
          assignedMentor: true,
        },
      }),
    ]);

    return {
      schools,
      mentors,
      missions,
      reports,
      prayerRequests,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      schools: [],
      mentors: [],
      missions: [],
      reports: [],
      prayerRequests: [],
    };
  }
}
