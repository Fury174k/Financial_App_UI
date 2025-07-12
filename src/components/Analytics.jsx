import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, PieChart, Brain, Calendar } from 'lucide-react';

const ExpenseAnalyticsDashboard = () => {
  // Mock data for demonstration
  const [weeklyData] = useState([
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 80 },
    { day: 'Wed', amount: 150 },
    { day: 'Thu', amount: 90 },
    { day: 'Fri', amount: 200 },
    { day: 'Sat', amount: 250 },
    { day: 'Sun', amount: 180 }
  ]);
  const [topExpenses] = useState([
    { name: 'Groceries', amount: 450 },
    { name: 'Gas', amount: 320 },
    { name: 'Restaurants', amount: 280 },
    { name: 'Entertainment', amount: 150 }
  ]);
  const [categoryData] = useState([
    { category: 'Food', amount: 730 },
    { category: 'Transport', amount: 320 },
    { category: 'Entertainment', amount: 180 },
    { category: 'Shopping', amount: 240 }
  ]);
  const [predictionData] = useState([
    { period: 'Week 1', actual: 450, predicted: 440 },
    { period: 'Week 2', actual: 380, predicted: 400 },
    { period: 'Week 3', actual: 520, predicted: 500 },
    { period: 'Week 4', actual: 480, predicted: 460 },
    { period: 'Next Week', actual: null, predicted: 475 },
    { period: 'Next Month', actual: null, predicted: 1580 }
  ]);
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState('weekly');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 text-xs">{label}</p>
          <p className="text-indigo-600 text-xs">
            Amount: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "indigo" }) => (
    <div className="p-2 bg-white border border-gray-100 shadow-sm rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-sm font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-2 rounded-full bg-${color}-100`}>
          <Icon className={`w-3 h-3 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const totalWeeklySpending = weeklyData.reduce((sum, day) => sum + day.amount, 0);
  const avgDailySpending = totalWeeklySpending / 7;

  return (
    <div className="h-screen p-4 bg-gray-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-indigo-800">Expense Analytics</h1>
          <p className="text-gray-600 text-xs">Track your spending patterns and get insights</p>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          
          {/* Left Column - Analytics Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats Cards */}
            <div className="space-y-3">
              <StatCard
                title="This Week"
                value={formatCurrency(totalWeeklySpending)}
                icon={DollarSign}
                trend={12.5}
                color="indigo"
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

            {/* Category Breakdown */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-900 mb-2">Category Breakdown</h3>
              <div className="space-y-1">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">{category.category}</span>
                    <span className="text-xs font-medium text-indigo-800">{formatCurrency(category.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Expenses */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-900 mb-2">Top Expenses</h3>
              <div className="space-y-1">
                {topExpenses.map((expense, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">{expense.name}</span>
                    <span className="text-xs font-medium text-indigo-800">{formatCurrency(expense.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-3 flex flex-col min-h-0">
            {/* Tab Navigation */}
            <div className="flex p-1 mb-4 space-x-1 overflow-x-auto bg-gray-100 rounded-lg">
              {[
                { id: 'weekly', label: 'Weekly Trend', icon: TrendingUp },
                { id: 'category', label: 'By Category', icon: PieChart },
                { id: 'prediction', label: 'ML Prediction', icon: Brain }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Chart Container */}
            <div className="flex-1 p-3 bg-white border border-gray-100 shadow-sm rounded-lg max-h-[535px] flex flex-col">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Weekly Spending Trend */}
                  {activeTab === 'weekly' && (
                    <div className="flex-1 flex flex-col min-h-0">
                      <h3 className="mb-2 text-sm font-semibold text-indigo-800">Weekly Spending Trend</h3>
                      <div className="flex-1 min-h-0" style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="day" 
                              tick={{ fontSize: 10 }}
                              stroke="#6b7280"
                            />
                            <YAxis 
                              tick={{ fontSize: 10 }}
                              stroke="#6b7280"
                              tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                              dataKey="amount" 
                              fill="#4f46e5"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Category Spending */}
                  {activeTab === 'category' && (
                    <div className="flex-1 flex flex-col min-h-0">
                      <h3 className="mb-2 text-sm font-semibold text-indigo-800">Spending by Category</h3>
                      <div className="flex-1 min-h-0" style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="category" 
                              tick={{ fontSize: 10 }}
                              stroke="#6b7280"
                            />
                            <YAxis 
                              tick={{ fontSize: 10 }}
                              stroke="#6b7280"
                              tickFormatter={(value) => `${value}`}
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
                    </div>
                  )}

                  {/* ML Prediction */}
                  {activeTab === 'prediction' && (
                    <div className="flex-1 flex flex-col min-h-0">
                      <h3 className="mb-2 text-sm font-semibold text-indigo-800">ML-Based Expense Prediction</h3>
                      <div className="flex-1 min-h-0" style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={predictionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="period" 
                              tick={{ fontSize: 10 }}
                              stroke="#6b7280"
                            />
                            <YAxis 
                              tick={{ fontSize: 10 }}
                              stroke="#6b7280"
                              tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                              type="monotone" 
                              dataKey="actual" 
                              stroke="#4f46e5" 
                              strokeWidth={3}
                              dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
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
                    </div>
                  )}

                  {/* Spending Insights - Fixed under charts */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="mb-2 text-sm font-semibold text-indigo-800">💡 Smart Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <p className="text-xs text-indigo-800 font-medium">Spending Pattern</p>
                        <p className="text-xs text-indigo-600 mt-1">
                          You spend most on weekends. Consider setting weekend budgets.
                        </p>
                      </div>
                      <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg">
                        <p className="text-xs text-amber-800 font-medium">Budget Alert</p>
                        <p className="text-xs text-amber-600 mt-1">
                          15% over monthly food budget. Try meal planning to save.
                        </p>
                      </div>
                      <div className="p-2 bg-green-50 border border-green-100 rounded-lg">
                        <p className="text-xs text-green-800 font-medium">Trend Notice</p>
                        <p className="text-xs text-green-600 mt-1">
                          Transport costs up 23%. Consider carpooling options.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalyticsDashboard;