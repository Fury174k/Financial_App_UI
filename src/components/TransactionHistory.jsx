import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Skeleton from './Skeleton';

export default function TransactionHistory({ className }) {
  const { authToken } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }

    fetch("https://financial-tracker-api-1wlt.onrender.com/api/transactions/", {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const transactionsArray = Array.isArray(data) ? data : Object.values(data);
        setTransactions(transactionsArray);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }, [authToken, navigate]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://financial-tracker-api-1wlt.onrender.com/api/transactions/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      setTransactions(transactions.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (transactions.length === 0 && !authToken) {
    return (
      <div className={`${className} bg-white p-3 rounded-xl shadow-sm border border-gray-100 max-h-94 flex flex-col`}>
        <div className="space-y-4">
          <Skeleton width="60%" height="1.5rem" />
          <Skeleton width="80%" height="2rem" />
          <Skeleton height="0.5rem" />
        </div>
      </div>
    );
  }

 return (
  <div className={`${className} bg-white p-3 rounded-xl shadow-sm border border-gray-100 max-h-94 flex flex-col min-h-[320px]`}> 
    <div className="flex items-center justify-between flex-shrink-0 mb-3">
      <h2 className="text-base font-semibold text-indigo-800">Transaction History</h2>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
        {transactions.length} transactions
      </span>
    </div>
    
    <div className="flex-1 min-h-0 pr-1 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-6">
          <div className="mb-2 text-2xl">💸</div>
          <p className="text-sm font-medium text-gray-500">No transactions yet</p>
          <p className="mt-1 text-xs text-gray-400">Your transactions will appear here</p>
        </div>
      ) : (
        transactions.map((item, index) => (
          <div key={item.id} className="group">
            <div 
              className="px-3 py-2 transition-all duration-200 border border-transparent rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-200"
              onClick={() => toggleExpand(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0 space-x-3">
                  {/* Transaction Icon */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                    item.type === "income" ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {item.type === "income" ? "+" : "-"}
                  </div>
                  
                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title || item.description || "Untitled Transaction"}
                    </p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {item.category && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                            {item.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Amount and Chevron */}
                <div className="flex items-center space-x-2">
                  <p className={`text-sm font-semibold ${
                    item.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {item.type === "income" ? "+" : "-"}${parseFloat(item.amount).toFixed(2)}
                  </p>
                  <div className="text-gray-400 transition-colors group-hover:text-gray-600">
                    {expandedId === item.id ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M18 15l-6-6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === item.id && (
              <div className="p-3 mx-3 mb-2 duration-300 ease-out border-l-4 border-indigo-400 rounded-lg bg-gray-50 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">Type</span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.type === "income" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                  </div>
                  
                  {item.category && (
                    <div>
                      <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">Category</span>
                      <p className="mt-1 text-sm text-gray-900">{item.category}</p>
                    </div>
                  )}
                </div>
                
                {item.description && (
                  <div className="mb-3">
                    <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">Description</span>
                    <p className="mt-1 text-xs leading-relaxed text-gray-700">{item.description}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Transaction ID: #{item.id}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-red-500 transition-all duration-200 rounded-lg hover:text-red-700 hover:bg-red-50"
                    title="Delete transaction"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" 
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);
}