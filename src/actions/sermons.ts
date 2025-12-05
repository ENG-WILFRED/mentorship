"use server";

import { prisma } from '@/lib/prisma';

export async function getSermons() {
  return prisma.sermon.findMany({
    orderBy: { createdAt: 'desc' },
    include: { comments: { orderBy: { createdAt: 'desc' } }, reactions: true },
  });
}

export async function getSermonById(id: number) {
  return prisma.sermon.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: 'desc' } }, reactions: true },
  });
}

export async function createSermon(data: {
  title: string;
  description?: string | null;
  topic?: string | null;
  author?: string | null;
  videoUrl?: string | null;
  createdById?: number | null;
}) {
  const sermon = await prisma.sermon.create({ data: {
    title: data.title,
    description: data.description ?? undefined,
    topic: data.topic ?? undefined,
    author: data.author ?? undefined,
    videoUrl: data.videoUrl ?? undefined,
    createdById: data.createdById ?? undefined,
  }});
  return sermon;
}

export async function createSermonFromForm(formData: FormData) {
  const title = formData.get('title') as string | null;
  const description = formData.get('description') as string | null;
  const topic = formData.get('topic') as string | null;
  const author = formData.get('author') as string | null;
  const uploadedById = formData.get('uploadedById') as string | null;
  // file handling left as placeholder; store filename as videoUrl
  const file = formData.get('video') as File | null;
  const videoUrl = file ? `/uploads/${file.name}` : null;

  if (!title) throw new Error('Title required');

  return createSermon({
    title,
    description,
    topic,
    author,
    videoUrl,
    createdById: uploadedById ? Number(uploadedById) : undefined,
  });
}

export async function addComment(sermonId: number, message: string, userId?: number) {
  if (!message || message.trim().length === 0) throw new Error('Message required');
  return prisma.sermonComment.create({ data: { sermonId, message, userId: userId ?? undefined } });
}

export async function toggleReaction(sermonId: number, emoji: string, userId?: number) {
  if (!emoji) throw new Error('Emoji required');
  const existing = await prisma.sermonReaction.findFirst({ where: { sermonId, userId: userId ?? null, emoji } });
  if (existing) {
    await prisma.sermonReaction.delete({ where: { id: existing.id } });
    return { removed: true };
  }
  const reaction = await prisma.sermonReaction.create({ data: { sermonId, emoji, userId: userId ?? undefined } });
  return reaction;
}
