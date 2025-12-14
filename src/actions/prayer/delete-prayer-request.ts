"use server";

import { prisma } from "@/lib/prisma";

export async function deletePrayerRequest(prayerRequestId: number) {
  try {
    // Delete the prayer request
    const deletedRequest = await prisma.prayerRequest.delete({
      where: { id: prayerRequestId },
    });

    return {
      success: true,
      message: "Prayer request deleted successfully",
      data: deletedRequest,
    };
  } catch (error) {
    console.error("Error deleting prayer request:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete prayer request"
    );
  }
}
