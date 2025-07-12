import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Budget({ className, refreshTrigger }) {
  const [budget, setBudget] = useState(null);
  const [spent, setSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const budgetRes = await fetch("https://financial-tracker-api-1wlt.onrender.com/api/budget/current/", {
        headers: { Authorization: `Token ${token}` },
      });
      const budgetData = await budgetRes.json();
      setBudget(budgetData.amount);

      // Fetch expenses instead of transactions
      const expRes = await fetch("https://financial-tracker-api-1wlt.onrender.com/api/expenses/", {
        headers: { Authorization: `Token ${token}` },
      });
      const expData = await expRes.json();
      const now = new Date();
      const thisMonth = Array.isArray(expData)
        ? expData.filter((e) => {
            const d = new Date(e.date);
            return (
              d.getMonth() === now.getMonth() &&
              d.getFullYear() === now.getFullYear()
            );
          })
        : [];
      const totalSpent = thisMonth.reduce(
        (sum, e) => sum + parseFloat(e.amount),
        0
      );
      setSpent(totalSpent);
    } catch (error) {
      console.error("Budget load failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [refreshTrigger]);

  const percentUsed = budget ? (spent / budget) * 100 : 0;

  const getColor = () => {
    if (percentUsed >= 90) return "text-red-600";
    if (percentUsed >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className={`${className} bg-white p-3 rounded-lg shadow-sm border border-gray-100 min-h-[110px]`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-indigo-800 text-md">Budget Overview</h2>
        <div className="flex items-center gap-2">
          <Link to="/budget-setup" className="text-xs text-indigo-600 hover:text-indigo-800">
            Adjust
          </Link>
          <button
            onClick={fetchData}
            className="text-xs text-indigo-400 hover:text-indigo-700 border border-indigo-200 rounded px-2 py-0.5 ml-1"
            title="Refresh budget"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-xs text-gray-400">Loading...</div>
      ) : budget === null ? (
        <div className="text-xs text-gray-600">
          No budget set. <Link to="/budget-setup" className="underline">Set now</Link>.
        </div>
      ) : (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Budget</span>
            <span>${parseFloat(budget).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Spent</span>
            <span className={getColor()}>${spent.toFixed(2)}</span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 rounded-full bg-gray-200">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${getColor()}`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>

          {/* Status Message */}
          <div className={`text-xs mt-1 ${getColor()}`}>
            {percentUsed >= 100
              ? "You've exceeded your budget"
              : percentUsed >= 75
              ? "You're nearing your budget"
              : "You're within your budget"}
          </div>
        </div>
      )}
    </div>
  );
}
