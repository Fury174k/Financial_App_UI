import React, { useState, useEffect } from "react";

export default function AddExpense({ className = "" }) {
  const [accounts, setAccounts] = useState([
    { id: 1, bank_name: "Chase Bank", account_number: "****1234" },
    { id: 2, bank_name: "Wells Fargo", account_number: "****5678" }
  ]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "FOOD",
    account: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
  });
  const [alert, setAlert] = useState({ message: "", type: "info" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate loading accounts
    if (accounts.length > 0) {
      setForm((prev) => ({ ...prev, account: accounts[0].id }));
    }
  }, [accounts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setAlert({ message: "Transaction added successfully!", type: "success" });
      setIsSubmitting(false);
      // Reset form
      setForm({
        title: "",
        amount: "",
        category: "FOOD",
        account: accounts.length > 0 ? accounts[0].id : "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      });
    }, 1000);
  };

  const categories = [
    { value: "FOOD", label: "🍽️ Food", color: "text-orange-600" },
    { value: "TRANSPORT", label: "🚗 Transport", color: "text-blue-600" },
    { value: "UTILITIES", label: "💡 Utilities", color: "text-green-600" },
    { value: "ENTERTAINMENT", label: "🎬 Entertainment", color: "text-purple-600" },
    { value: "SHOPPING", label: "🛍️ Shopping", color: "text-pink-600" },
    { value: "HEALTHCARE", label: "🏥 Healthcare", color: "text-red-600" },
    { value: "OTHER", label: "📝 Other", color: "text-gray-600" }
  ];

  return (
    <div
      className={`w-full max-w-lg mx-auto ${className} bg-white/95 backdrop-blur rounded-xl shadow border border-white/20 p-2 sm:p-4 md:p-6 overflow-y-auto`}
      style={{ maxHeight: '90vh', minHeight: '400px' }}
    >
      {/* Alert Display */}
      {alert.message && (
        <div className={`mb-3 p-3 rounded-lg border text-sm sm:text-base ${
          alert.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : alert.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {alert.type === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {alert.type === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3 text-sm font-medium">
              {alert.message}
            </div>
            <button 
              onClick={() => setAlert({ message: "", type: "info" })}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-lg sm:w-10 sm:h-10 sm:mr-2 bg-gradient-to-r from-indigo-800 to-blue-600">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">Add Transaction</h2>
          <p className="text-xs text-gray-600 sm:text-sm">Record your income or expense</p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-4">
        {/* Transaction Type Toggle */}
        <div>
          <label className="block mb-2 text-xs font-semibold text-gray-700 sm:mb-3 sm:text-sm">
            Transaction Type
          </label>
          <div className="flex p-0.5 sm:p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "expense" })}
              className={`flex-1 py-2 px-2 sm:py-2.5 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 ${
                form.type === "expense"
                  ? "bg-indigo-800 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📤 Expense
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "income" })}
              className={`flex-1 py-2 px-2 sm:py-2.5 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 ${
                form.type === "income"
                  ? "bg-indigo-800 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📥 Income
            </button>
          </div>
        </div>

        {/* Title Field */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 text-xs sm:text-base"
            placeholder="Enter transaction title"
            required
          />
        </div>

        {/* Amount Field */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none sm:pl-4">
              <span className="font-medium text-gray-500">$</span>
            </div>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              className="w-full pl-7 pr-3 py-2.5 sm:pl-8 sm:pr-4 sm:py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 text-xs sm:text-base"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Category Field */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
            Category
          </label>
          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer text-xs sm:text-base"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none sm:pr-4">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Account Field */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
            Account
          </label>
          <div className="relative">
            <select
              name="account"
              value={form.account}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer text-xs sm:text-base"
              required
            >
              {accounts.length === 0 ? (
                <option value="">No accounts found</option>
              ) : (
                accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    🏦 {acc.bank_name} ({acc.account_number})
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none sm:pr-4">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Field */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 text-xs sm:text-base"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none sm:pr-4">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 sm:py-4 px-3 sm:px-4 font-semibold rounded-lg transition-all duration-200 shadow hover:shadow-lg transform hover:scale-[1.02] text-sm sm:text-base ${
            isSubmitting
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-800 to-blue-600 hover:from-indigo-900 hover:to-blue-700 text-white"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 mr-1 border-2 border-gray-300 rounded-full sm:w-5 sm:h-5 sm:mr-2 border-t-gray-600 animate-spin"></div>
              <span className="text-sm sm:text-base">Processing...</span>
            </div>
          ) : (
            `Add ${form.type === "expense" ? "Expense" : "Income"}`
          )}
        </button>
      </div>
    </div>
  );
}