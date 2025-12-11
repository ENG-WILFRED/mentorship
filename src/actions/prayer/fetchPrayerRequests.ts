"use server";

import {
  PrayerRequest,
  StatusOptions,
} from "@/app/mentor/prayer-requests/lib/types"; // Import your enums or types
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Ensure that the FetchPrayerRequestsInput type is properly defined
type FetchPrayerRequestsInput = {
  status?: StatusOptions | "all";
  search?: string;
  limit?: number;
  skip?: number;
};

export async function fetchPrayerRequests(
  input: FetchPrayerRequestsInput = {}
): Promise<PrayerRequest[]> {
  const { status, search, limit = 10, skip = 0 } = input;

  const where: Prisma.PrayerRequestWhereInput = {};

  // Handle status filter
  if (status && status !== "all") {
    where.status = status;
  }

  // Handle search filter (case-insensitive search)
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { request: { contains: search, mode: "insensitive" } },
      { studentId: { contains: search, mode: "insensitive" } },
      { school: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    // Fetch prayer requests from DB
    const prayers = await prisma.prayerRequest.findMany({
      where,
      orderBy: { date: "desc" },
      take: limit,
      skip: skip,
    });

    // Return the raw data (you can adjust this later on the frontend as needed)
    return prayers;
  } catch (e) {
    console.error("Failed to fetch prayer requests", e);

    if (e instanceof Error) {
      throw new Error(`Failed to fetch prayer requests: ${e.message || e}`);
    } else {
      throw new Error(
        "An unknown error occurred while creating the prayer request."
      );
    }
  }
}
