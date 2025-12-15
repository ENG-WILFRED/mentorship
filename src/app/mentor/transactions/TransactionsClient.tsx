"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/Toast";

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

export default function TransactionsClient({ transactions = [] }: { transactions: Transaction[] }) {
  const router = useRouter();
  const toast = useToast();
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailAdditionalInfo, setEmailAdditionalInfo] = useState("");
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    amount: "",
    type: "Income",
    status: "Completed"
  });
  const itemsPerPage = 5;

  // Fetch latest transactions from the API
  const fetchAll = async () => {
    try {
      const res = await fetch('/api/transactions?take=1000');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLocalTransactions(data || []);
    } catch (err) {
      console.error('Failed to refresh transactions', err);
    }
  };

  const downloadAll = () => {
    setIsDownloading(true);
    try {
      window.location.href = '/api/transactions/download';
      toast('Download started...', 'success');
    } catch (err) {
      console.error(err);
      toast('Download failed', 'error');
    } finally {
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };

  const emailAll = async () => {
    if (!emailInput.trim()) {
      toast('Please enter an email address', 'error');
      return;
    }
    setIsEmailing(true);
    try {
      const res = await fetch('/api/transactions/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, additionalInfo: emailAdditionalInfo }),
      });
      const data = await res.json();
      if (res.ok) {
        toast('Transactions emailed successfully!', 'success');
        setIsEmailModalOpen(false);
        setEmailInput('');
        setEmailAdditionalInfo('');
      } else {
        toast(data.error || 'Failed to send email', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Failed to send email', 'error');
    } finally {
      setIsEmailing(false);
    }
  };

  // Ensure client state syncs with server-provided prop on mount
  useEffect(() => {
    setLocalTransactions(transactions || []);
  }, [transactions]);

  const filteredTransactions = localTransactions.filter((t) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Income"
        ? t.amount > 0
        : filter === "Expense"
        ? t.amount < 0
        : t.status.toLowerCase() === filter.toLowerCase();
    
    const matchesSearch = (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const tDate = new Date(t.date);
    const sDate = startDate ? new Date(startDate) : null;
    const eDate = endDate ? new Date(endDate) : null;
    
    // Check date range (inclusive)
    const matchesDate = (!sDate || tDate >= sDate) && 
                        (!eDate || tDate <= new Date(eDate.getTime() + 86400000)); // Add 1 day to include the end date

    return matchesFilter && matchesSearch && matchesDate;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, startDate, endDate]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Chart Data Preparation
  const chartData = filteredTransactions.reduce((acc: any[], t) => {
    const date = new Date(t.date);
    const key = date.toLocaleString('default', { month: 'short', year: '2-digit' }); // e.g., "Oct 23"
    
    let period = acc.find(p => p.name === key);
    if (!period) {
      period = { name: key, income: 0, expense: 0, dateObj: date };
      acc.push(period);
    }
    
    if (t.amount > 0) period.income += Number(t.amount);
    else period.expense += Math.abs(Number(t.amount));
    
    return acc;
  }, []).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const totalIncome = localTransactions.reduce((acc, t) => (t.amount > 0 ? acc + Number(t.amount) : acc), 0);
  const totalExpense = localTransactions.reduce((acc, t) => (t.amount < 0 ? acc + Number(t.amount) : acc), 0);

  // Monthly Summary Logic
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthTxs = localTransactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const prevMonthTxs = localTransactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
  });

  const getTotals = (txs: Transaction[]) => ({
    income: txs.reduce((acc, t) => t.amount > 0 ? acc + Number(t.amount) : acc, 0),
    expense: txs.reduce((acc, t) => t.amount < 0 ? acc + Math.abs(Number(t.amount)) : acc, 0)
  });

  const currentStats = getTotals(currentMonthTxs);
  const prevStats = getTotals(prevMonthTxs);

  const calculateGrowth = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0;
    return ((current - prev) / prev) * 100;
  };

  const incomeGrowth = calculateGrowth(currentStats.income, prevStats.income);
  const expenseGrowth = calculateGrowth(currentStats.expense, prevStats.expense);

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const amountVal = parseFloat(formData.amount);
    const finalAmount = formData.type === 'Expense' ? -Math.abs(amountVal) : Math.abs(amountVal);
    (async () => {
      try {
        if (isEditing && editId) {
          const res = await fetch('/api/transactions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editId, amount: finalAmount, type: formData.type, status: formData.status, description: formData.description }),
          });
          if (!res.ok) throw new Error('Update failed');
          toast('✅ Transaction updated successfully!', 'success');
        } else {
          const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: finalAmount, type: formData.type, status: formData.status, description: formData.description }),
          });
          if (!res.ok) throw new Error('Create failed');
          toast('✅ Transaction added successfully!', 'success');
        }
        // refresh list
        await fetchAll();
      } catch (err) {
        console.error(err);
        toast('❌ Failed to save transaction', 'error');
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
        resetForm();
      }
    })();
  };
  

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      type: "Income",
      status: "Completed"
    });
    setIsEditing(false);
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const initiateEdit = (t: Transaction) => {
    setFormData({
      date: typeof t.date === 'string' ? t.date.split('T')[0] : new Date(t.date).toISOString().split('T')[0],
      description: t.description || '',
      amount: Math.abs(t.amount).toString(),
      type: t.type || (t.amount > 0 ? 'Income' : 'Expense'),
      status: t.status
    });
    setEditId(t.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const initiateDelete = (t: Transaction) => {
    setTransactionToDelete(t);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    (async () => {
      if (!transactionToDelete) return;
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/transactions?id=${transactionToDelete.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        toast('✅ Transaction deleted successfully!', 'success');
        await fetchAll();
      } catch (err) {
        console.error(err);
        toast('❌ Failed to delete transaction', 'error');
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setTransactionToDelete(null);
      }
    })();
  };

  const downloadReceipt = (t: Transaction) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(107, 33, 168); // purple-800
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Transaction Receipt", 105, 25, { align: "center" });
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    let y = 60;
    const lineHeight = 10;
    const leftCol = 20;
    const rightCol = 80;

    doc.text(`Transaction ID:`, leftCol, y);
    doc.text(`${t.id}`, rightCol, y);
    y += lineHeight;
    
    doc.text(`Date:`, leftCol, y);
    doc.text(`${new Date(t.date).toLocaleDateString()}`, rightCol, y);
    y += lineHeight;
    
    doc.text(`Description:`, leftCol, y);
    doc.text(`${t.description}`, rightCol, y);
    y += lineHeight;
    
    doc.text(`Type:`, leftCol, y);
    doc.text(`${t.type || (t.amount > 0 ? 'Income' : 'Expense')}`, rightCol, y);
    y += lineHeight;
    
    doc.text(`Status:`, leftCol, y);
    doc.text(`${t.status}`, rightCol, y);
    y += lineHeight;
    
    // Amount
    y += 10;
    doc.setFillColor(243, 244, 246); // gray-100
    doc.rect(leftCol, y - 6, 170, 14, 'F');
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount:`, leftCol + 5, y + 4);
    const amountStr = `${t.amount < 0 ? '-' : '+'}$${Math.abs(Number(t.amount)).toFixed(2)}`;
    doc.text(amountStr, 185, y + 4, { align: "right" });
    
    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your partnership.", 105, 280, { align: "center" });
    
    doc.save(`receipt_${t.id}.pdf`);
  };

  return (
    <main className="flex-1 w-full px-2 md:px-8 lg:px-16 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Transactions</h1>
          <p className="text-gray-600 text-sm md:text-base">Manage and view your financial history</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={openAddModal}
            disabled={isLoading}
            className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <span className="animate-spin">⏳</span> : '+'} Add Transaction
          </button>
          <button
            onClick={downloadAll}
            disabled={isDownloading}
            className="hidden md:inline-flex px-4 py-3 bg-white border border-purple-200 text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition-all shadow-sm hover:shadow-md text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed items-center justify-center gap-2"
          >
            {isDownloading ? <span className="animate-spin">⏳</span> : '↓'} Download CSV
          </button>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            disabled={isEmailing}
            className="hidden md:inline-flex px-4 py-3 bg-white border border-purple-200 text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition-all shadow-sm hover:shadow-md text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed items-center justify-center gap-2"
          >
            {isEmailing ? <span className="animate-spin">⏳</span> : '✉️'} Email CSV
          </button>
          <button
            onClick={() => router.back()}
            className="flex-1 md:flex-none px-6 py-3 bg-white border border-purple-200 text-purple-700 font-bold rounded-lg hover:bg-purple-50 transition-all shadow-sm hover:shadow-md text-sm md:text-base"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Monthly Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Income Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6 relative overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase">Monthly Income</p>
              <h3 className="text-3xl font-bold text-green-600 mt-1">${currentStats.income.toFixed(2)}</h3>
            </div>
            <div className={`p-2 rounded-lg text-xs font-bold ${incomeGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {incomeGrowth >= 0 ? '↗' : '↘'} {Math.abs(incomeGrowth).toFixed(1)}%
            </div>
          </div>
          <p className="text-xs text-gray-500">vs last month (${prevStats.income.toFixed(2)})</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6 relative overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase">Monthly Expenses</p>
              <h3 className="text-3xl font-bold text-red-600">${currentStats.expense.toFixed(2)}</h3>
            </div>
            <div className={`p-2 rounded-lg text-xs font-bold ${expenseGrowth <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {expenseGrowth > 0 ? '↗' : '↘'} {Math.abs(expenseGrowth).toFixed(1)}%
            </div>
          </div>
          <p className="text-xs text-gray-500">vs last month (${prevStats.expense.toFixed(2)})</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-sm font-semibold uppercase">Monthly Net Balance</p>
          <h3 className={`text-3xl font-bold mt-1 ${currentStats.income - currentStats.expense >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
            ${(currentStats.income - currentStats.expense).toFixed(2)}
          </h3>
          <p className="text-xs text-gray-500 mt-4">
            Total Balance: ${(totalIncome + totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-4 md:p-6 mb-8 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-bold text-purple-700 mb-4">Income vs Expenses</h2>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow p-4 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
          {['All', 'Income', 'Expense', 'Completed', 'Pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
            <thead className="bg-purple-50/50">
              <tr>
                <th className="p-4 text-sm font-bold text-purple-800">Date</th>
                <th className="p-4 text-sm font-bold text-purple-800">Description</th>
                <th className="p-4 text-sm font-bold text-purple-800">Type</th>
                <th className="p-4 text-sm font-bold text-purple-800">Amount</th>
                <th className="p-4 text-sm font-bold text-purple-800">Status</th>
                <th className="p-4 text-sm font-bold text-purple-800">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((t, i) => (
                  <tr key={i} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-800 font-medium">{t.description}</td>
                    <td className="p-4 text-sm text-gray-600">{t.type || (t.amount > 0 ? 'Income' : 'Expense')}</td>
                    <td className={`p-4 text-sm font-bold ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {t.amount < 0 ? '-' : '+'}${Math.abs(Number(t.amount)).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          String(t.status).toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : String(t.status).toLowerCase() === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadReceipt(t)}
                          className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1"
                        >
                          📄 Receipt
                        </button>
                        <button
                          onClick={() => initiateEdit(t)}
                          className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md font-medium transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => initiateDelete(t)}
                          className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md font-medium transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-bold ${
                    currentPage === page 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSaveTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Donation"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                    <option value="Donation">Donation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? <span className="animate-spin">⏳</span> : ''} {isEditing ? 'Update Transaction' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Email Transactions CSV</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">Enter the email address where you'd like to receive the transactions CSV file.</p>
              <input
                type="email"
                placeholder="recipient@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <textarea
                placeholder="Additional information (optional)"
                value={emailAdditionalInfo}
                onChange={(e) => setEmailAdditionalInfo(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={emailAll}
                  disabled={isEmailing}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isEmailing ? <span className="animate-spin">⏳</span> : '✉️'} Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Transaction?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? <span className="animate-spin">⏳</span> : ''} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}