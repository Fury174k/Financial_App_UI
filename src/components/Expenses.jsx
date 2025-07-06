import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from './Skeleton';

export default function Expenses({ className }) {
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cacheKey = "monthlyExpensesCache";
    const cache = localStorage.getItem(cacheKey);
    let useCache = false;
    if (cache) {
      try {
        const parsed = JSON.parse(cache);
        const now = Date.now();
        if (parsed.timestamp && now - parsed.timestamp < 10 * 60 * 1000) {
          setMonthlyBudget(parsed.monthlyBudget);
          setTotalSpent(parsed.totalSpent);
          setIsLoading(false);
          useCache = true;
        }
      } catch (e) {
        // Ignore parse errors, fallback to fetch
      }
    }
    if (useCache) return;
    fetchData(cacheKey);
  }, []);

  const fetchData = async (cacheKey) => {
    const token = localStorage.getItem("authToken");
    try {
      // Fetch current month's budget
      const budgetResponse = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/budget/current/", {
        headers: { Authorization: `Token ${token}` }
      });
      let budgetAmount = null;
      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();
        budgetAmount = budgetData.amount;
        setMonthlyBudget(budgetAmount);
      }
      // Fetch transactions
      const transactionsResponse = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/transactions/", {
        headers: { Authorization: `Token ${token}` }
      });
      let totalExpenses = 0;
      if (transactionsResponse.ok) {
        const data = await transactionsResponse.json();
        const transactionsArray = Array.isArray(data) ? data : Object.values(data);
        // Filter for current month's expenses
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthExpenses = transactionsArray.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transaction.type === "expense" &&
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        });
        totalExpenses = currentMonthExpenses.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount),
          0
        );
        setTotalSpent(totalExpenses);
      }
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          monthlyBudget: budgetAmount,
          totalSpent: totalExpenses,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-white p-4 rounded-lg shadow-sm border border-gray-100`}>
        <div className="space-y-4">
          <Skeleton width="33%" height="1.5rem" />
          <Skeleton width="50%" height="2rem" />
          <Skeleton height="0.5rem" />
        </div>
      </div>
    );
  }

  // If no budget is set, show setup message
  if (!monthlyBudget) {
    return (
      <div className={`${className} bg-white p-4 rounded-lg shadow-sm border border-gray-100`}>
        <h2 className="mb-4 text-lg font-semibold text-indigo-800">Monthly Expenses</h2>
        <div className="py-8 text-center">
          <div className="mb-4 text-4xl">📊</div>
          <h3 className="mb-2 text-lg font-medium text-gray-800">Set Your Budget</h3>
          <p className="mb-4 text-gray-600">
            Start tracking your expenses by setting up your monthly budget
          </p>
          <Link
            to="/budget-setup"
            className="px-6 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Set Budget
          </Link>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const remaining = monthlyBudget - totalSpent;
  const percentageUsed = (totalSpent / monthlyBudget) * 100;
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  const daysRemaining = daysInMonth - today + 1; // include today
  const dailyAllocation = daysRemaining > 0 ? remaining / daysRemaining : 0;

  const getStatusColor = () => {
    if (percentageUsed >= 90) return "text-red-600";
    if (percentageUsed >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (percentageUsed >= 90) return "bg-red-500";
    if (percentageUsed >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
  <div className={`${className} bg-white p-3 rounded-lg shadow-sm border border-gray-100`}>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-indigo-800">Monthly Expenses</h2>
      <Link 
        to="/budget-setup"
        className="text-xs text-indigo-600 hover:text-indigo-800"
      >
        Edit Budget
      </Link>
    </div>
    
    <div className="space-y-3">
      {/* Budget vs Spent */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600">Budget</p>
          <p className="text-lg font-semibold text-gray-800">
            ${monthlyBudget.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Spent</p>
          <p className={`text-lg font-semibold ${getStatusColor()}`}>
            ${totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Progress</span>
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Remaining & Daily Allowance */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-600">Remaining</p>
          <p className={`text-sm font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(remaining).toFixed(2)}
            {remaining < 0 && <span className="ml-1 text-xs">over</span>}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Daily Allocation</p>
          <p className="text-sm font-semibold text-gray-700">
            ${Math.max(dailyAllocation, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Status Message */}
      <div className="p-2 rounded-lg bg-gray-50">
        <p className="text-xs text-gray-700">
          {percentageUsed >= 90 
            ? "⚠️ Close to budget limit!" 
            : percentageUsed >= 75 
            ? "⚡ Approaching budget limit" 
            : "✅ On track with spending"}
        </p>
      </div>
    </div>
  </div>
);
}