"use server";

import { prisma } from "@/lib/prisma";

export async function getPrayerRequestStats(userId?: number, mentorId?: number) {
  try {
    const where = userId ? { createdById: userId } : mentorId ? { assignedMentorId: mentorId } : {};

    
    const [total, pending, inProgress, fulfilled, totalStudents] = await Promise.all([
      prisma.prayerRequest.count({ where }),
      prisma.prayerRequest.count({ where: { ...where, status: "PENDING" } }),
      prisma.prayerRequest.count({ where: { ...where, status: "IN_PROGRESS" } }),
      prisma.prayerRequest.count({ where: { ...where, status: "FULFILLED" } }),
      // Count unique students from prayer requests
      prisma.prayerRequest.findMany({
        where,
        select: { studentId: true },
        distinct: ['studentId'],
      }).then(results => results.filter(r => r.studentId).length),
    ]);

    return {
      total,
      pending,
      inProgress,
      fulfilled,
      totalStudents,
    };
  } catch (e) {
    console.error("Failed to get prayer stats", e);
    throw new Error("Failed to get prayer request statistics");
  }
}