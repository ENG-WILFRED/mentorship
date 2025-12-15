"use server";

import { prisma } from '@/lib/prisma';

export async function getTransactions({ take = 50, skip = 0, userId }: { take?: number; skip?: number; userId?: number } = {}) {
  try {
    const where = userId ? { userId } : {};
    const txs = await prisma.transaction.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    });

    // Normalize to include `date` used by client components
    return txs.map((t) => ({ ...t, date: t.createdAt }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function createTransaction(data: {
  userId?: number;
  amount: number;
  currency?: string;
  type: string;
  status?: string;
  description?: string;
  metadata?: any;
}) {
  try {
    const tx = await prisma.transaction.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        currency: data.currency ?? '$',
        type: data.type,
        status: data.status ?? 'completed',
        description: data.description,
        metadata: data.metadata ?? {},
      },
    });
    return tx;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export async function updateTransaction(id: number, data: {
  amount?: number;
  currency?: string;
  type?: string;
  status?: string;
  description?: string | null;
  metadata?: any;
}) {
  try {
    const tx = await prisma.transaction.update({
      where: { id },
      data: {
        amount: data.amount,
        currency: data.currency,
        type: data.type,
        status: data.status,
        description: data.description,
        metadata: data.metadata,
      },
    });
    return tx;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export async function deleteTransaction(id: number) {
  try {
    await prisma.transaction.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
