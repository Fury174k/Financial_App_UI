import React, { useState, useEffect } from "react";
import Alert from "./Alert";

export default function AddExpense({ className = "", onTransactionChange }) {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "FOOD",
    account: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    description: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch accounts from API
    const token = localStorage.getItem("authToken");
    fetch("https://financial-tracker-api-1wlt.onrender.com/api/accounts/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        setAccounts(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, account: data[0].id }));
        }
      })
      .catch(() => setAccounts([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);
    setAlertMessage("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://financial-tracker-api-1wlt.onrender.com/api/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          amount: form.amount,
          category: form.category,
          account: form.account,
          date: form.date,
          type: form.type,
          description: form.description,
        }),
      });
      if (response.ok) {
        setAlertType("success");
        setAlertMessage("Transaction added successfully!");
        setShowAlert(true);
        setForm({
          title: "",
          amount: "",
          category: "FOOD",
          account: accounts.length > 0 ? accounts[0].id : "",
          date: new Date().toISOString().split("T")[0],
          type: "expense",
          description: "",
        });
        if (onTransactionChange) onTransactionChange();
      } else {
        setAlertType("error");
        setAlertMessage("Failed to add transaction.");
        setShowAlert(true);
      }
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to add transaction.");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className={`w-full ${className} bg-white/95 backdrop-blur rounded-xl shadow border border-white/20 p-6 transition-all duration-300 hover:shadow-lg overflow-auto`}>
      {showAlert && (
        <Alert message={alertMessage} type={alertType} onClose={() => setShowAlert(false)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-800 to-blue-600 transform transition-transform duration-200 hover:scale-105">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="ml-3">
            <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
            <p className="text-sm text-gray-600">Record your income or expense</p>
          </div>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {['expense', 'income'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setForm({ ...form, type })}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                form.type === type
                  ? 'bg-indigo-800 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              {type === 'expense' ? '📤 Expense' : '📥 Income'}
            </button>
          ))}
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {/* Main Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">Transaction Details</h3>
          
          {/* Title */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
              placeholder="Enter transaction title"
              required
            />
          </div>

          {/* Amount */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                className="w-full py-2.5 px-8 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Account & Date Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">Account & Date</h3>
          
          {/* Account */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
            <select
              name="account"
              value={form.account}
              onChange={handleChange}
              className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
            >
              {accounts.length ? accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>🏦 {acc.bank_name} ({acc.account_number})</option>
              )) : <option value="">No accounts found</option>}
            </select>
          </div>

          {/* Date */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full py-2.5 px-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
              required
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">Additional Info</h3>
          
          {/* Description */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300 resize-none"
              placeholder="Add description"
            />
          </div>
        </div>
      </div>

      {/* Submit Button - Full Width */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-3 font-semibold rounded-lg text-sm shadow-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-95 ${
          isSubmitting
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-800 to-blue-600 text-white hover:from-indigo-900 hover:to-blue-700 hover:shadow-md"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          `Add ${form.type === "expense" ? "Expense" : "Income"}`
        )}
      </button>
    </div>
  );
}