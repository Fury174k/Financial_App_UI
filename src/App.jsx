import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import TotalBalance from "./components/TotalBalance";
import Savings from "./components/Savings";
import Income from "./components/Income";
import Expenses from "./components/Expenses";
import TransactionHistory from "./components/TransactionHistory";
import Reports from "./components/Reports";
import Budget from "./components/Budget";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import AddExpense from "./components/AddExpense";
import { AuthProvider } from "./context/AuthContext";
import AddAccount from "./components/AddAccount";
import BudgetSetup from "./components/BudgetSetup";
import SavingsGoal from "./components/SavingsGoal";
import CardDetails from "./components/CardDetails";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";

function DashboardLayout({ refreshTrigger, handleTransactionChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 overflow-auto">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="p-4">
          <Outlet context={{ refreshTrigger, handleTransactionChange }} />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Add Account Route - Standalone without sidebar/navbar */}
          <Route path="/add-account" element={<AddAccount />} />

          {/* Protected Layout */}
          <Route element={<PrivateRoute />}>
            <Route
              element={
                <DashboardLayout
                  refreshTrigger={refreshTrigger}
                  handleTransactionChange={handleTransactionChange}
                />
              }
            >
              <Route
                path="/"
                element={
                  <>
                    <div className="grid grid-cols-1 gap-4 mt-0 md:grid-cols-2 lg:grid-cols-4">
                      <TotalBalance refreshTrigger={refreshTrigger} />
                      <Expenses />
                      <Savings />
                      <Income />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5 mt-2.5">
                      <TransactionHistory className="lg:col-span-2" refreshTrigger={refreshTrigger} />
                      <div className="space-y-3 lg:col-span-2">
                        <Reports />
                        <Budget />
                      </div>
                    </div>
                  </>
                }
              />

              <Route
                path="/add-expense"
                element={
                  <div className="p-6">
                    <AddExpense
                      className="max-w-7xl mx-auto"
                      onTransactionChange={handleTransactionChange}
                    />
                  </div>
                }
              />
              <Route path="/budget-setup" element={<BudgetSetup />} />
              <Route path="/savings-goal" element={<SavingsGoal />} />
              <Route
                path="/cards"
                element={
                  <div className="p-2">
                    <CardDetails />
                  </div>
                }
              />
              <Route
                path="/analytics"
                element={
                  <div className="p-2">
                    <Analytics />
                  </div>
                }
              />
              <Route
                path="/settings"
                element={
                  <div className="p-2">
                    <Settings />
                  </div>
                }
              />
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
