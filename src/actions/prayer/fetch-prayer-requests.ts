"use server";

import { PrayerRequestResponse, StatusOptions } from "@/app/mentor/prayer-requests/lib/types";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type FetchPrayerRequestsInput = {
  status?: StatusOptions | "all";
  search?: string;
  limit?: number;
  skip?: number;
  createdById?: number;  // NEW: Filter by creator
  assignedMentorId?: number;  // NEW: Filter by assigned mentor
  includePrayedBy?: boolean;  // NEW: Whether to include who prayed
};

export async function fetchPrayerRequests(
  input: FetchPrayerRequestsInput = {}
): Promise<PrayerRequestResponse[]> {
  const { 
    status, 
    search, 
    limit = 10, 
    skip = 0,
    createdById,
    assignedMentorId,
    includePrayedBy = true
  } = input;

  const where: Prisma.PrayerRequestWhereInput = {};

  // Handle status filter
  if (status && status !== "all") {
    where.status = status;
  }

  // NEW: Filter by creator
  if (createdById) {
    where.createdById = createdById;
  }

  // NEW: Filter by assigned mentor
  if (assignedMentorId) {
    where.assignedMentorId = assignedMentorId;
  }

  // Handle search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { request: { contains: search, mode: "insensitive" } },
      { studentId: { contains: search, mode: "insensitive" } },
      { school: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    if (includePrayedBy) {
      const prayers = await prisma.prayerRequest.findMany({
        where,
        orderBy: { date: "desc" },
        take: limit,
        skip: skip,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignedMentor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          prayedByUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
              prayedAt: true,
            },
            orderBy: {
              prayedAt: "desc",
            },
          },
        },
      });

      return prayers as any;
    } else {
      const prayers = await prisma.prayerRequest.findMany({
        where,
        orderBy: { date: "desc" },
        take: limit,
        skip: skip,
        include: {
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          assignedMentor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return prayers as any;
    }
  } catch (e) {
    console.error("Failed to fetch prayer requests", e);
    if (e instanceof Error) {
      throw new Error(`Failed to fetch prayer requests: ${e.message}`);
    }
    throw new Error("An unknown error occurred while fetching prayer requests.");
  }
}