import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Lottie from "lottie-react";
import coinAnimation from "../assets/MoneyLoop.json";

export default function TotalBalance({ className }) {
  const [totalBalance, setTotalBalance] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    if (!authToken) return;

    const cacheKey = "totalBalanceCache";
    const cache = localStorage.getItem(cacheKey);
    let useCache = false;
    if (cache) {
      try {
        const parsed = JSON.parse(cache);
        const now = Date.now();
        if (parsed.timestamp && now - parsed.timestamp < 10 * 60 * 1000) {
          setTotalBalance(parsed.total_balance);
          setAccounts(parsed.accounts);
          setLoading(false);
          useCache = true;
        }
      } catch (e) {
        // Ignore parse errors, fallback to fetch
      }
    }
    if (useCache) return;

    const fetchTotalBalance = fetch(
      "http://localhost:8000/api/total-balance/",
      {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch total balance");
      return res.json();
    });

    const fetchAccounts = fetch("http://localhost:8000/api/accounts/", {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch accounts");
      return res.json();
    });

    Promise.all([fetchTotalBalance, fetchAccounts])
      .then(([balanceData, accountData]) => {
        setTotalBalance(balanceData.total_balance);
        setAccounts(accountData);
        setLoading(false);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            total_balance: balanceData.total_balance,
            accounts: accountData,
            timestamp: Date.now(),
          })
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to fetch account data");
        setLoading(false);
      });
  }, [authToken]);

  return (
    <div className={`${className} bg-white p-3 rounded-lg shadow-sm`}>
      <h2 className="mb-3 text-base font-semibold text-indigo-800">
        Total Balance
      </h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-2xl font-bold">{totalBalance} $</p>
            <div className="w-10 h-10">
              <Lottie
                animationData={coinAnimation}
                loop={true}
                autoplay={true}
              />
            </div>
          </div>
          <div className="space-y-2">
            {accounts.length === 0 ? (
              <p className="text-xs text-gray-600">No accounts found</p>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-2 text-xs text-gray-600 rounded bg-gray-50"
                >
                  <p>
                    <strong>Bank:</strong> {acc.bank_name}
                  </p>
                  <p>
                    <strong>Account:</strong> **** {acc.account_number.slice(-4)}
                  </p>
                  <p>
                    <strong>Balance:</strong> ${acc.balance}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
