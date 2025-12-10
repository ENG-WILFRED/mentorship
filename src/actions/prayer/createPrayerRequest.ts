"use server";

import { prisma } from "@/lib/prisma";
import { sendPrayerRequestEmail } from "../email/sendPrayerRequestEmail";

export type CreatePrayerRequestInput = {
  request: string;
  school?: string;
  priority?: 'high' | 'medium' | 'low';
  mentor?: string;
  notes?: string;
  studentId?: string;
  grade?: string;
  subject?: string;
  category?: string;
  email?: string;
  name?: string;
};

export async function createPrayerRequest(input: CreatePrayerRequestInput) {
  const priorityMap: Record<string, any> = { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };
  const data = {
    request: input.request,
    school: input.school,
    priority: priorityMap[input.priority ?? 'medium'],
    mentor: input.mentor,
    notes: input.notes,
    studentId: input.studentId,
    grade: input.grade,
    subject: input.subject,
    category: input.category,
    email: input.email,
    name: input.name,
  };

  const prayer = await prisma.prayerRequest.create({ data });

  // Send notification email (fire-and-forget)
  try {
    await sendPrayerRequestEmail({ prayer });
  } catch (e) {
    // Log but don't fail the creation if email fails
    console.error('Failed to send prayer notification email', e);
  }

  return prayer;
}
