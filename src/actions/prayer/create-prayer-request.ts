"use server";

import { prisma } from "@/lib/prisma";
import { sendPrayerRequestEmail } from "../email/sendPrayerRequestEmail";
import { CreatePrayerRequestInput, PrayerRequestResponse } from "@/app/mentor/prayer-requests/lib/types";

export async function createPrayerRequest(
  input: CreatePrayerRequestInput
): Promise<PrayerRequestResponse> {
  // Validate and map priority
  const mappedPriority = input.priority?.toUpperCase() as "HIGH" | "MEDIUM" | "LOW" || "MEDIUM";

  // Validate and map status
  const mappedStatus = input.status?.toUpperCase() as "PENDING" | "IN_PROGRESS" | "FULFILLED" || "PENDING";

  try {
    // Create the prayer request in the database
    const prayer = await prisma.prayerRequest.create({
      data: {
        request: input.request,
        school: input.school ?? null,
        priority: mappedPriority,
        notes: input.notes ?? null,
        studentId: input.studentId ?? null,
        grade: input.grade ?? null,
        subject: input.subject ?? null,
        status: mappedStatus,
        category: input.category ?? null,
        email: input.email ?? null,
        name: input.name ?? null,
        
        // NEW: Connect to user who created it
        createdById: input.createdById ?? null,
        
        // NEW: Connect to assigned mentor
        assignedMentorId: input.assignedMentorId ?? null,
      },
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
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Send notification email (fire-and-forget)
    try {
      await sendPrayerRequestEmail({ prayer });
    } catch (e) {
      console.error("Failed to send prayer notification email", e);
    }

    return prayer;
  } catch (e) {
    console.error("Failed to create prayer request", e);
    if (e instanceof Error) {
      throw new Error(`Failed to create prayer request: ${e.message}`);
    }
    throw new Error("An unknown error occurred while creating the prayer request.");
  }
}