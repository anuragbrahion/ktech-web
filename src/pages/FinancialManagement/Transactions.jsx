import React, { useEffect, useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';

const TransactionModal = ({ isOpen, onClose, onSave, transactionData, isEditing }) => {
  const [formData, setFormData] = useState({
    type: '',
    categoryType: '',
    amount: '',
    remark: '',
    paymentMode: '',
    date: new Date().toLocaleDateString('en-GB')
  });

  const categories = [
    'Umarwada Collection INCOME',
    'Umarwada expense',
    'School Fees INCOME',
    'Salary EXPENSE',
    'Electricity Bill EXPENSE',
    'Donation INCOME',
    'Maintenance EXPENSE',
    'Transportation EXPENSE',
    'Office Supplies EXPENSE',
    'Tuition Fees INCOME'
  ];

  useEffect(() => {
    if (transactionData && isEditing) {
      setFormData({
        type: transactionData.type || '',
        categoryType: transactionData.categoryType || '',
        amount: transactionData.amount.toString() || '',
        remark: transactionData.remark || '',
        paymentMode: transactionData.paymentMode || '',
        date: transactionData.date || new Date().toLocaleDateString('en-GB')
      });
    } else {
      // Reset form for new transaction
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB');
      const formattedTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }).toUpperCase();
      
      setFormData({
        type: '',
        categoryType: '',
        amount: '',
        remark: '',
        paymentMode: '',
        date: formattedDate,
        time: formattedTime
      });
    }
  }, [transactionData, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.type || !formData.categoryType || !formData.amount || !formData.paymentMode) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    // Format date with time
    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();

    onSave({
      ...formData,
      amount: amount,
      date: formData.date,
      createdAt: formattedDateTime
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Transaction</h2>
              <h3 className="text-lg font-semibold text-gray-600 mt-1">
                {isEditing ? 'Edit Transaction' : 'Add Transaction'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-gray-700 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    formData.categoryType === 'INCOME' 
                      ? 'bg-green-100 border-green-300' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="categoryType"
                      value="INCOME"
                      checked={formData.categoryType === 'INCOME'}
                      onChange={handleInputChange}
                      className="hidden"
                      required
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-2">💰</span>
                      <span className="font-medium text-gray-800">INCOME</span>
                      <span className="text-sm text-gray-500 mt-1">Money Coming In</span>
                    </div>
                  </label>
                  
                  <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    formData.categoryType === 'EXPENSE' 
                      ? 'bg-red-100 border-red-300' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="categoryType"
                      value="EXPENSE"
                      checked={formData.categoryType === 'EXPENSE'}
                      onChange={handleInputChange}
                      className="hidden"
                      required
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-2">💸</span>
                      <span className="font-medium text-gray-800">EXPENSE</span>
                      <span className="text-sm text-gray-500 mt-1">Money Going Out</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-gray-700 mb-2">Remark</label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  placeholder="Enter remarks (optional)"
                />
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-gray-700 mb-2">Payment Mode</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Payment Mode</option>
                  <option value="CASH">CASH</option>
                  <option value="BANK TRANSFER">BANK TRANSFER</option>
                  <option value="ONLINE PAYMENT">ONLINE PAYMENT</option>
                  <option value="CHEQUE">CHEQUE</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    }).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {isEditing ? 'Update Transaction' : 'Create Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      type: 'Umarwada Collection INCOME', 
      categoryType: 'INCOME', 
      paymentMode: 'CASH', 
      amount: 110, 
      remark: 'WADA PW AND MURGI', 
      date: '02/12/2025',
      createdAt: '02/12/2025 10:30 AM'
    },
    { 
      id: 2, 
      type: 'Umarwada expense', 
      categoryType: 'EXPENSE', 
      paymentMode: 'CASH', 
      amount: 90, 
      remark: 'DIYA GHAR NE', 
      date: '02/12/2025',
      createdAt: '02/12/2025 11:15 AM'
    },
    { 
      id: 3, 
      type: 'Umarwada Collection INCOME', 
      categoryType: 'INCOME', 
      paymentMode: 'CASH', 
      amount: 12, 
      remark: '', 
      date: '29/11/2025',
      createdAt: '29/11/2025 09:45 AM'
    },
    { 
      id: 4, 
      type: 'School Fees INCOME', 
      categoryType: 'INCOME', 
      paymentMode: 'BANK TRANSFER', 
      amount: 5000, 
      remark: 'Monthly fees collection', 
      date: '28/11/2025',
      createdAt: '28/11/2025 02:30 PM'
    },
    { 
      id: 5, 
      type: 'Salary EXPENSE', 
      categoryType: 'EXPENSE', 
      paymentMode: 'BANK TRANSFER', 
      amount: 25000, 
      remark: 'Staff salary for November', 
      date: '27/11/2025',
      createdAt: '27/11/2025 10:00 AM'
    },
    { 
      id: 6, 
      type: 'Electricity Bill EXPENSE', 
      categoryType: 'EXPENSE', 
      paymentMode: 'ONLINE PAYMENT', 
      amount: 1500, 
      remark: 'Monthly electricity bill', 
      date: '26/11/2025',
      createdAt: '26/11/2025 04:45 PM'
    },
    { 
      id: 7, 
      type: 'Donation INCOME', 
      categoryType: 'INCOME', 
      paymentMode: 'CASH', 
      amount: 500, 
      remark: 'Charity donation', 
      date: '25/11/2025',
      createdAt: '25/11/2025 11:00 AM'
    },
    { 
      id: 8, 
      type: 'Maintenance EXPENSE', 
      categoryType: 'EXPENSE', 
      paymentMode: 'CASH', 
      amount: 750, 
      remark: 'Building maintenance', 
      date: '24/11/2025',
      createdAt: '24/11/2025 03:20 PM'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  // Action handlers
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveTransaction = (transactionData) => {
    if (isEditing && selectedTransaction) {
      // Update existing transaction
      setTransactions(transactions.map(transaction => 
        transaction.id === selectedTransaction.id 
          ? { 
              ...transaction, 
              ...transactionData,
              amount: parseFloat(transactionData.amount),
              date: transactionData.date || new Date().toLocaleDateString('en-GB')
            }
          : transaction
      ));
    } else {
      // Add new transaction
      const newTransaction = {
        id: transactions.length + 1,
        ...transactionData,
        amount: parseFloat(transactionData.amount),
        date: transactionData.date || new Date().toLocaleDateString('en-GB'),
        createdAt: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setTransactions([...transactions, newTransaction]);
    }
    setShowModal(false);
    setSelectedTransaction(null);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = filters.category === '' || 
      transaction.categoryType === filters.category;
    
    let matchesDate = true;
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const transactionDate = new Date(transaction.date.split('/').reverse().join('-'));
      matchesDate = matchesDate && transactionDate >= startDate;
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const transactionDate = new Date(transaction.date.split('/').reverse().join('-'));
      matchesDate = matchesDate && transactionDate <= endDate;
    }
    
    return matchesCategory && matchesDate;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['Type', 'Payment Mode', 'Amount', 'Remark', 'Date', 'Actions'];

  const getCategoryTypeColor = (type) => {
    return type === 'INCOME' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getPaymentModeColor = (mode) => {
    switch(mode) {
      case 'CASH':
        return 'bg-blue-100 text-blue-800';
      case 'BANK TRANSFER':
        return 'bg-purple-100 text-purple-800';
      case 'ONLINE PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.categoryType === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.categoryType === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <p className="text-gray-600 mt-2">Manage and track all financial transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-800 mt-2">₹ {totalIncome.toFixed(2)}</p>
            </div>
            <div className="text-3xl text-green-500">💰</div>
          </div>
          <p className="text-green-600 text-sm mt-3">
            {filteredTransactions.filter(t => t.categoryType === 'INCOME').length} income transactions
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Expense</p>
              <p className="text-2xl font-bold text-red-800 mt-2">₹ {totalExpense.toFixed(2)}</p>
            </div>
            <div className="text-3xl text-red-500">💸</div>
          </div>
          <p className="text-red-600 text-sm mt-3">
            {filteredTransactions.filter(t => t.categoryType === 'EXPENSE').length} expense transactions
          </p>
        </div>

        <div className={`border rounded-xl p-6 ${
          netBalance >= 0 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                Net Balance
              </p>
              <p className={`text-2xl font-bold mt-2 ${
                netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}>
                ₹ {netBalance.toFixed(2)}
              </p>
            </div>
            <div className={`text-3xl ${
              netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'
            }`}>
              {netBalance >= 0 ? '📈' : '📉'}
            </div>
          </div>
          <p className={`text-sm mt-3 ${
            netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            {netBalance >= 0 ? 'Positive balance' : 'Negative balance'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 justify-between">
          <div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>
          </div>
            <button 
              onClick={handleResetFilters}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
            >
              Reset Filters
            </button>
            <button
              onClick={handleAddTransaction}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>Add Transaction</span>
            </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentTransactions}
            renderRow={(transaction, index) => (
              <tr 
                key={transaction.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <div className="font-medium text-gray-800">{transaction.type}</div>
                    <span className={`mt-1 px-2 py-1 rounded-full text-xs w-fit ${getCategoryTypeColor(transaction.categoryType)}`}>
                      {transaction.categoryType}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getPaymentModeColor(transaction.paymentMode)}`}>
                    {transaction.paymentMode}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className={`font-bold text-lg ${
                    transaction.categoryType === 'INCOME' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.categoryType === 'INCOME' ? '+' : '-'}₹ {transaction.amount.toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-700 max-w-xs truncate">
                    {transaction.remark || '-'}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-700">{transaction.date}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewTransaction(transaction)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full"
                      title="View/Edit Transaction"
                    >
                      <span className="text-xl">👁️</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(f => f !== '') 
                ? "No transactions match your filter criteria" 
                : "No transactions available. Click 'Add Transaction' to create one."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            
            <div className="flex items-center space-x-2 my-4 md:my-0">
              {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 4) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 3 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 4 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === totalPages
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTransaction(null);
        }}
        onSave={handleSaveTransaction}
        transactionData={selectedTransaction}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Transactions;