import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import piggyAnim from "../assets/PiggyBank.json";
import GoalCompleteCelebration from "./GoalCompleteCelebration";
import { Trash } from "lucide-react";

export default function Savings({ className }) {
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeGoal, setActiveGoal] = useState(null);
  const [contribution, setContribution] = useState("");
  const [contributionError, setContributionError] = useState("");
  const [contributionLoading, setContributionLoading] = useState(false);
  const [completedGoal, setCompletedGoal] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    fetchSavings();
  }, []);

  const fetchSavings = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/savings/", {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSavingsGoals(data);
        return data; // RETURN the updated list here!
      }
    } catch (err) {
      console.error("Error loading savings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenMenu = (goalId) => {
    setActiveGoal(goalId);
    setContribution("");
    setContributionError("");
  };

  const handleAddContribution = async (goalId) => {
    setContributionLoading(true);
    setContributionError("");
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/savings/contribute/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ goal: goalId, amount: contribution }),
      });

      if (res.ok) {
        setActiveGoal(null);
        setContribution("");

        const prevGoal = savingsGoals.find((g) => g.id === goalId);
        const updatedGoals = await fetchSavings(); // Get latest from backend
        const newGoal = updatedGoals.find((g) => g.id === goalId);

        // ✅ Check if goal has just been completed
        if (
          newGoal &&
          newGoal.saved >= newGoal.target &&
          prevGoal &&
          prevGoal.saved < prevGoal.target
        ) {
          setCompletedGoal(newGoal);
          setShowCelebration(true);
        }
      } else {
        const data = await res.json();
        setContributionError(data.error || "Failed to add contribution");
      }
    } catch (err) {
      setContributionError("Network error");
    } finally {
      setContributionLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`https://financial-tracker-api-iq2a.onrender.com/api/savings/${goalId}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        setSavingsGoals((prev) => prev.filter((g) => g.id !== goalId));
      } else {
        setAlertMsg("Failed to delete goal. Try again.");
        setTimeout(() => setAlertMsg(""), 2500);
      }
    } catch {
      setAlertMsg("Network error. Try again.");
      setTimeout(() => setAlertMsg(""), 2500);
    }
  };

  const handleAddGoalClick = () => {
    if (savingsGoals.length >= 2) {
      setAlertMsg("🚫 Only 2 savings goals allowed! Try focusing your superpowers on those first! 🦸‍♂️");
      setTimeout(() => setAlertMsg(""), 3000);
    } else {
      window.location.href = "/savings-goal";
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-white p-4 rounded-lg shadow-sm`}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white p-3 rounded-lg shadow-sm`}>
      <GoalCompleteCelebration
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
      {alertMsg && (
        <div className="px-4 py-2 mb-2 text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500 rounded animate-bounce">
          {alertMsg}
        </div>
      )}
      <h2 className="mb-3 text-base font-semibold text-indigo-800">Savings Goals</h2>
      <div className="space-y-3">
        <button
          onClick={handleAddGoalClick}
          className="inline-block px-4 py-2 text-xs text-white transition-transform duration-300 bg-indigo-600 rounded-lg hover:scale-105"
        >
          + Create New Goal
        </button>
        {savingsGoals.length === 0 ? (
          <div className="p-4 text-sm text-center text-gray-600">
            <div className="mx-auto mb-2 h-28 w-28">
              <Lottie animationData={piggyAnim} loop={true} />
            </div>
            You haven't set any savings goals yet.
          </div>
        ) : (
          savingsGoals.map((goal) => {
            const saved = Number(goal.saved);
            const target = Number(goal.target);
            const percentage = (saved / target) * 100;
            const remaining = target - saved;
            return (
              <div key={goal.id} className="relative p-2 border border-gray-100 rounded-lg">
                <div
                  className="flex items-center justify-between mb-1 cursor-pointer"
                  onClick={() => handleOpenMenu(goal.id)}
                >
                  <h3 className="text-sm font-semibold text-gray-800">{goal.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      ${saved.toFixed(2)} / ${target.toFixed(2)}
                    </span>
                    <button
                      className="p-1 ml-2 text-xs text-red-500 bg-transparent border-none hover:text-red-700"
                      title="Delete Goal"
                      onClick={e => { e.stopPropagation(); handleDeleteGoal(goal.id); }}
                    >
                      <Trash size={13} />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-1">
                  <div
                    className="h-1.5 bg-green-500 rounded-full"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {remaining > 0
                    ? `$${remaining.toFixed(2)} left to save`
                    : "✅ Goal achieved!"}
                </p>

                {activeGoal === goal.id && (
                  <div className="absolute left-0 right-0 z-10 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-10">
                    <h4 className="mb-2 text-xs font-semibold text-indigo-700">Add Contribution</h4>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={contribution}
                      onChange={(e) => setContribution(e.target.value)}
                      className="w-full px-2 py-1 mb-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Amount"
                    />
                    {contributionError && (
                      <p className="mb-1 text-xs text-red-500">{contributionError}</p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddContribution(goal.id)}
                        className="px-3 py-1 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
                        disabled={contributionLoading || !contribution}
                      >
                        {contributionLoading ? "Saving..." : "Add"}
                      </button>
                      <button
                        onClick={() => setActiveGoal(null)}
                        className="px-3 py-1 text-xs text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
