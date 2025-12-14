"use server";

import { prisma } from "@/lib/prisma";

export async function addPrayerToPrayerRequest(
  prayerRequestId: number,
  userId: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user already prayed for this request
    const existing = await prisma.prayerRequestPrayedBy.findUnique({
      where: {
        prayerRequestId_userId: {
          prayerRequestId,
          userId,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        message: "You have already prayed for this request",
      };
    }

    // Add the prayer
    await prisma.prayerRequestPrayedBy.create({
      data: {
        prayerRequestId,
        userId,
      },
    });

    return {
      success: true,
      message: "Prayer added successfully",
    };
  } catch (e) {
    console.error("Failed to add prayer", e);
    if (e instanceof Error) {
      throw new Error(`Failed to add prayer: ${e.message}`);
    }
    throw new Error("An unknown error occurred while adding prayer.");
  }
}