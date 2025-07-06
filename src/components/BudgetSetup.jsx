import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BudgetSetup() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("authToken");
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    try {
      const res = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/budget/current/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ amount, month, year }),
      });
      if (res.ok) {
        navigate("/"); // or trigger a state update if you want to stay on the page
      } else {
        const data = await res.json();
        setError(data.error || "Failed to set budget");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Set Your Monthly Budget</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Saving..." : "Set Budget"}
        </button>
      </form>
    </div>
  );
}
