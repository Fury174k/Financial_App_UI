import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Lottie from "lottie-react";
import coinAnimation from "../assets/MoneyLoop.json";


export default function TotalBalance({ className, refreshTrigger }) {
  const [totalBalance, setTotalBalance] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useContext(AuthContext);

  const fetchFreshData = async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);

    try {
      const [balanceRes, accountsRes] = await Promise.all([
        fetch("https://financial-tracker-api-1wlt.onrender.com/api/total-balance/", {
          headers: { Authorization: `Token ${authToken}` },
        }),
        fetch("https://financial-tracker-api-1wlt.onrender.com/api/accounts/", {
          headers: { Authorization: `Token ${authToken}` },
        }),
      ]);

      if (!balanceRes.ok || !accountsRes.ok) throw new Error("Fetch failed");

      const balanceData = await balanceRes.json();
      const accountData = await accountsRes.json();

      setTotalBalance(balanceData.total_balance);
      setAccounts(accountData);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch account data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return;
    fetchFreshData();
  }, [authToken, refreshTrigger]);

  const handleRetry = () => {
    fetchFreshData();
  };

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(balance);
  };

  return (
    <div className={`${className} bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-indigo-800 text-md">Total Balance</h2>
        <div className="w-8 h-8 opacity-80">
          <Lottie animationData={coinAnimation} loop autoplay />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-2 border-indigo-800 rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="py-4 text-center">
          <p className="mb-2 text-sm text-red-500">{error}</p>
          <button
            onClick={handleRetry}
            className="text-xs text-indigo-800 underline hover:text-indigo-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="mb-1 text-3xl font-bold text-indigo-800">
              {formatBalance(totalBalance || 0)}
            </p>
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              {accounts.length} Account{accounts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-32">
            {accounts.length === 0 ? (
              <div className="py-3 text-center text-gray-400">
                <p className="text-xs">No accounts found</p>
              </div>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-2 text-xs transition-colors duration-200 border border-indigo-100 rounded-lg bg-indigo-50 hover:bg-indigo-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-indigo-800">{acc.bank_name}</p>
                      <p className="text-gray-600">
                        •••• {acc.account_number.slice(-4)}
                      </p>
                    </div>
                    <p className="font-semibold text-indigo-800">
                      {formatBalance(acc.balance)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
