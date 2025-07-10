import { useEffect, useState, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { AuthContext } from "../context/AuthContext";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a1caf1", "#c94c4c"];

export default function Reports({ className }) {
  const { authToken } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("pie"); // "pie" or "bar"

  useEffect(() => {
    if (!authToken) return;

    fetch("https://financial-tracker-api-1wlt.onrender.com/api/transactions/", {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then((response) => {
        const transactions = Array.isArray(response)
          ? response
          : response.results || [];

        // ✅ Filter for only 'expense' type
        const expenses = transactions.filter(t => t.type === "expense");

        if (expenses.length === 0) {
          setData([]);
          return;
        }

        const categoryTotals = {};
        let total = 0;

        expenses.forEach((item) => {
          const cat = item.category;
          const amt = parseFloat(item.amount);
          total += amt;
          categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
        });

        const formatted = Object.entries(categoryTotals).map(
          ([category, value]) => ({
            name: category,
            value,
            percent: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
          })
        );

        setData(formatted);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setData([]);
      });
  }, [authToken]);

  const renderChart = () => {
    if (chartType === "pie") {
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            label={({ name, percent }) => `${name} (${percent}%)`}
            labelLine={false}
            labelStyle={{ fontSize: '11px', fontWeight: 500 }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
            contentStyle={{ fontSize: '13px' }}
          />
          <Legend 
            verticalAlign="bottom" 
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            iconType="circle"
          />
        </PieChart>
      );
    } else {
      return (
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value, name) => [`$${value.toFixed(2)}`, "Amount"]}
            contentStyle={{ fontSize: '13px' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      );
    }
  };

  return (
    <div className={`${className} bg-white p-3 rounded-lg shadow-sm min-h-[200px]`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-indigo-800">
          Spending by Category
        </h2>
        <button
          onClick={() => setChartType(chartType === "pie" ? "bar" : "pie")}
          className="px-2 py-1 text-xs font-medium text-indigo-600 transition-colors duration-200 rounded-md bg-indigo-50 hover:bg-indigo-100"
        >
          {chartType === "pie" ? "Bar" : "Pie"}
        </button>
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-gray-500">No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </div>
  );
}