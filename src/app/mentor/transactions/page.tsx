import React from 'react';
import TransactionsClient from './TransactionsClient';

// Mock Data - Replace with actual data fetching logic
const transactions = [
  { id: 1, date: '2023-10-01', description: 'Monthly Support', amount: 500, status: 'Completed', type: 'Donation' },
  { id: 2, date: '2023-10-05', description: 'Mission Expenses', amount: -120.50, status: 'Completed', type: 'Expense' },
  { id: 3, date: '2023-10-12', description: 'School Supplies', amount: -350, status: 'Pending', type: 'Expense' },
  { id: 4, date: '2023-10-15', description: 'One-time Gift', amount: 200, status: 'Completed', type: 'Donation' },
  { id: 5, date: '2023-10-20', description: 'Transport', amount: -45, status: 'Completed', type: 'Expense' },
];

export default function TransactionsPage() {
  return (
    <TransactionsClient transactions={transactions} />
  );
}