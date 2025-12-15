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

    // Fetch latest transactions (3 most recent) — handle missing table gracefully
    let normalizedTxs: any[] = [];
    try {
      const transactions = await prisma.transaction.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      });
      normalizedTxs = transactions.map((t) => ({ ...t, date: t.createdAt }));
    } catch (txErr: any) {
      // If the Transaction table doesn't exist, Prisma will throw P2021. Log and continue with empty list.
      if (txErr?.code === 'P2021') {
        console.warn('Transaction table not found — skipping transactions in dashboard');
      } else {
        console.error('Error fetching transactions for dashboard:', txErr);
      }
      normalizedTxs = [];
    }

    return {
      schools,
      mentors,
      missions,
      reports,
      prayerRequests,
      transactions: normalizedTxs,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      schools: [],
      mentors: [],
      missions: [],
      reports: [],
      prayerRequests: [],
      transactions: [],
    };
  }
}
