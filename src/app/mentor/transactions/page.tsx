import React from 'react';
import TransactionsClient from './TransactionsClient';
import { getTransactions } from '@/actions/transactions';

interface Transaction {
  id: number | string;
  date: string | Date;
  description: string | null;
  amount: number;
  status: string;
  type: string;
  currency?: string;
  createdAt?: Date;
  userId?: number | null;
  metadata?: any;
}

export default async function TransactionsPage() {
  const transactions = await getTransactions({ take: 100 });

  return <TransactionsClient transactions={transactions as Transaction[]} />;
}