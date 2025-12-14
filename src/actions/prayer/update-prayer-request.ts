"use server";

import { PrayerRequestResponse, PriorityOptions, StatusOptions } from "@/app/mentor/prayer-requests/lib/types";
import { prisma } from "@/lib/prisma";

type UpdatePrayerRequestInput = {
  id: number;
  status?: StatusOptions;
  priority?: PriorityOptions;
  notes?: string;
  assignedMentorId?: number | null;
};

export async function updatePrayerRequest(
  input: UpdatePrayerRequestInput
): Promise<PrayerRequestResponse> {
  try {
    const prayer = await prisma.prayerRequest.update({
      where: { id: input.id },
      data: {
        status: input.status,
        priority: input.priority,
        notes: input.notes,
        assignedMentorId: input.assignedMentorId,
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

    return prayer;
  } catch (e) {
    console.error("Failed to update prayer request", e);
    if (e instanceof Error) {
      throw new Error(`Failed to update prayer request: ${e.message}`);
    }
    throw new Error("An unknown error occurred while updating prayer request.");
  }
}