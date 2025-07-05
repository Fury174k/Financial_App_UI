import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";

export default function IncomeVsExpense({ className }) {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoading(true);
    fetch("http://localhost:8000/api/transactions/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then((data) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const transactions = Array.isArray(data) ? data : Object.values(data);

        const thisMonth = transactions.filter((tx) => {
          const date = new Date(tx.date);
          return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        });

        const totalIncome = thisMonth
          .filter((tx) => tx.type === "income")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const totalExpense = thisMonth
          .filter((tx) => tx.type === "expense")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        setIncome(totalIncome);
        setExpenses(totalExpense);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const spentRatio = income > 0 ? (expenses / income) * 100 : 0;
  const balance = income - expenses;

  const getStatusMessage = () => {
    if (income === 0) return "No income recorded yet.";
    if (spentRatio > 100) return "⚠️ You're overspending!";
    if (spentRatio > 80) return "🟡 Watch your spending!";
    return "✅ You're managing your income well.";
  };

  const getBarColor = () => {
    if (spentRatio > 100) return "bg-red-500";
    if (spentRatio > 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-white p-4 rounded-lg shadow-sm`}>
        <div className="space-y-4">
          <Skeleton width="40%" height="1.5rem" />
          <Skeleton width="60%" height="2rem" />
          <Skeleton height="0.5rem" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white p-4 rounded-lg shadow-sm`}>
      <h2 className="mb-3 text-base font-semibold text-indigo-800">
        Income vs Expenses
      </h2>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Income</span>
          <span className="font-semibold text-green-600">
            ${income.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Expenses</span>
          <span className="font-semibold text-red-600">
            ${expenses.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <span>Balance</span>
          <span
            className={`font-semibold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${balance.toFixed(2)}
          </span>
        </div>

        {/* Progress Bar */}
        {income > 0 && (
          <div className="mt-3">
            <div className="flex justify-between mb-1 text-xs text-gray-500">
              <span>Spending Ratio</span>
              <span>{Math.min(spentRatio, 150).toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${getBarColor()} transition-all`}
                style={{ width: `${Math.min(spentRatio, 100)}%`, maxWidth: "100%" }}
              ></div>
            </div>
          </div>
        )}

        {/* Status Message */}
        <div className="mt-2 text-sm text-gray-600">{getStatusMessage()}</div>
      </div>
    </div>
  );
}
