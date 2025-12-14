"use server";

import { prisma } from "@/lib/prisma";

export async function removePrayerFromPrayerRequest(
  prayerRequestId: number,
  userId: number
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.prayerRequestPrayedBy.delete({
      where: {
        prayerRequestId_userId: {
          prayerRequestId,
          userId,
        },
      },
    });

    return {
      success: true,
      message: "Prayer removed successfully",
    };
  } catch (e) {
    console.error("Failed to remove prayer", e);
    if (e instanceof Error) {
      throw new Error(`Failed to remove prayer: ${e.message}`);
    }
    throw new Error("An unknown error occurred while removing prayer.");
  }
}