import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, PieChart, Brain, Calendar, Target } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ExpenseAnalyticsDashboard = () => {
  const { authToken: userToken } = useContext(AuthContext);
  const [weeklyData, setWeeklyData] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('weekly');

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [weeklyRes, topRes, categoryRes, predWeekRes, predMonthRes] = await Promise.all([
        fetch('/api/analytics/weekly-spending/', { headers: { Authorization: `Token ${userToken}` } }),
        fetch('/api/analytics/top-expenses/', { headers: { Authorization: `Token ${userToken}` } }),
        fetch('/api/analytics/by-category/', { headers: { Authorization: `Token ${userToken}` } }),
        fetch('/api/analytics/predict-weekly/', { headers: { Authorization: `Token ${userToken}` } }),
        fetch('/api/analytics/predict-monthly/', { headers: { Authorization: `Token ${userToken}` } }),
      ]);

      const weekly = await weeklyRes.json();
      const top = await topRes.json();
      const category = await categoryRes.json();
      const weeklyPrediction = await predWeekRes.json();
      const monthlyPrediction = await predMonthRes.json();

      setWeeklyData(weekly);
      setTopExpenses(top);
      setCategoryData(category);

      setPredictionData([
        ...(weeklyPrediction.history || []),
        { period: 'Next Week', actual: null, predicted: weeklyPrediction.prediction },
        { period: 'Next Month', actual: null, predicted: monthlyPrediction.prediction }
      ]);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Amount: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const totalWeeklySpending = weeklyData.reduce((sum, day) => sum + day.amount, 0);
  const avgDailySpending = totalWeeklySpending / 7;

  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Expense Analytics</h1>
          <p className="text-gray-600">Track your spending patterns and get insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="This Week"
            value={formatCurrency(totalWeeklySpending)}
            icon={DollarSign}
            trend={12.5}
            color="blue"
          />
          <StatCard
            title="Daily Average"
            value={formatCurrency(avgDailySpending)}
            icon={Calendar}
            trend={-3.2}
            color="green"
          />
          <StatCard
            title="Top Category"
            value="Food"
            icon={PieChart}
            color="purple"
          />
          <StatCard
            title="Predicted Next Month"
            value={formatCurrency(predictionData?.find(p => p.period === 'Next Month')?.predicted || 0)}
            icon={Brain}
            color="orange"
         />
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 mb-6 space-x-1 overflow-x-auto bg-gray-100 rounded-lg">
          {[
            { id: 'weekly', label: 'Weekly Trend', icon: TrendingUp },
            { id: 'top', label: 'Top Expenses', icon: DollarSign },
            { id: 'category', label: 'By Category', icon: PieChart },
            { id: 'prediction', label: 'ML Prediction', icon: Brain }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Weekly Spending Trend */}
              {activeTab === 'weekly' && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Weekly Spending Trend</h3>
                  {weeklyData.length < 2 ? (
                    <div className="flex items-center justify-center h-80">
                      <span className="text-gray-500 text-lg">Not enough data has been collected to make the chart yet.</span>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="day" 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="amount" 
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}

              {/* Top Expenses */}
              {activeTab === 'top' && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Expenses This Month</h3>
                  {topExpenses.length < 1 ? (
                    <div className="flex items-center justify-center h-80">
                      <span className="text-gray-500 text-lg">Not enough data has been collected to make the chart yet.</span>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topExpenses} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            type="number" 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                            tickFormatter={(value) => `$${value}`}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            tick={{ fontSize: 11 }}
                            stroke="#6b7280"
                            width={120}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="amount" 
                            fill="#8b5cf6"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}

              {/* Category Spending */}
              {activeTab === 'category' && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Spending by Category</h3>
                  {categoryData.length < 1 ? (
                    <div className="flex items-center justify-center h-80">
                      <span className="text-gray-500 text-lg">Not enough data has been collected to make the chart yet.</span>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="category" 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            stroke="#6b7280"
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="amount" 
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}

              {/* ML Prediction */}
              {activeTab === 'prediction' && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">ML-Based Expense Prediction</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="period" 
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          name="Actual"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                          name="Predicted"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-4 mt-4 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Prediction Model:</span> Based on your spending patterns from the last 3 months, 
                      our ML model predicts you'll spend approximately {formatCurrency(1580.25)} next month.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h4 className="mb-2 font-semibold text-gray-900">💡 Spending Insight</h4>
            <p className="text-sm text-gray-600">
              You spend most on weekends. Consider setting weekend budgets to control expenses.
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h4 className="mb-2 font-semibold text-gray-900">🎯 Budget Status</h4>
            <p className="text-sm text-gray-600">
              You're 15% over your monthly food budget. Try meal planning to reduce costs.
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h4 className="mb-2 font-semibold text-gray-900">📈 Trend Alert</h4>
            <p className="text-sm text-gray-600">
              Transport costs increased 23% this month. Consider carpooling or public transit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalyticsDashboard;