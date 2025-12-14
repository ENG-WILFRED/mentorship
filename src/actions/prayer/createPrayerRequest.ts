"use server";

import { prisma } from "@/lib/prisma";
import { sendPrayerRequestEmail } from "../email/sendPrayerRequestEmail";
import {
  PrayerRequest,
  PriorityOptions,
  StatusOptions,
} from "@/app/mentor/prayer-requests/lib/types";

// Create Prayer Request
export async function createPrayerRequest(input: PrayerRequest) {
  // Ensure priority is valid, default to 'MEDIUM' if not
  const mappedPriority: "HIGH" | "MEDIUM" | "LOW" =
    ((input.priority?.toLowerCase() as PriorityOptions)?.toUpperCase() as
      | "HIGH"
      | "MEDIUM"
      | "LOW") || "MEDIUM";

  // Map status to PrayerStatus enum
  const mappedStatus: "PENDING" | "IN_PROGRESS" | "FULFILLED" = input.status
    ? ((input.status.toLowerCase() as StatusOptions).toUpperCase() as
        | "PENDING"
        | "IN_PROGRESS"
        | "FULFILLED")
    : "PENDING";

  const data = {
    request: input.request,
    school: input.school ?? undefined,
    priority: input.priority as PriorityOptions,
    prayedBy: input.prayedBy || [],
    notes: input.notes || "",
    studentId: input.studentId ?? undefined,
    grade: input.grade ?? undefined,
    subject: input.subject ?? undefined,
    status: input.status as StatusOptions,
    date: new Date().toISOString(),
    category: input.category ?? undefined,
    email: input.email ?? undefined,
    name: input.name ?? undefined,
  };

  try {
    // Create the prayer request in the database
    const prayer = await prisma.prayerRequest.create({ data });

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
    } else {
      throw new Error(
        "An unknown error occurred while creating the prayer request."
      );
    }
  }
}
