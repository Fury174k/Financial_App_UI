import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Alert from "./Alert";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const { authToken, user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "info" });
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch user profile and accounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch accounts
        const accRes = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/accounts/", {
          headers: { Authorization: `Token ${authToken}` },
        });
        const accData = accRes.ok ? await accRes.json() : [];
        setAccounts(accData);

        // Fetch user profile (assuming /api/profile/ exists)
        const profRes = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/profile/", {
          headers: { Authorization: `Token ${authToken}` },
        });
        const profData = profRes.ok ? await profRes.json() : {};
        setProfile(profData);
      } catch (err) {
        setAlert({ message: "Failed to load settings data.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authToken]);

  useEffect(() => {
    if (!loading && accounts.length === 0) {
      navigate("/add-account", { replace: true });
    }
  }, [accounts, loading, navigate]);

  // Handle tab change with animation
  const handleTabChange = (newTab) => {
    if (newTab === activeTab || isTransitioning) return;
    setIsTransitioning(true);
    setActiveTab(newTab);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Handle input changes for editing
  const handleEditChange = (type, id, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [`${type}-${id}`]: {
        ...prev[`${type}-${id}`],
        [field]: value,
      },
    }));
  };

  // Save changes for account or profile
  const handleSave = async (type, id) => {
    setLoading(true);
    try {
      let url = "";
      let method = "PATCH";
      let body = {};
      if (type === "account") {
        url = `https://financial-tracker-api-iq2a.onrender.com/api/accounts/${id}/`;
        body = editing[`account-${id}`];
      } else if (type === "profile") {
        url = `https://financial-tracker-api-iq2a.onrender.com/api/profile/`;
        body = editing[`profile-${id}`];
      }
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setAlert({ message: "Changes saved!", type: "success" });
        setEditing((prev) => ({ ...prev, [`${type}-${id}`]: undefined }));
        // Refresh data
        if (type === "account") {
          const accRes = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/accounts/", {
            headers: { Authorization: `Token ${authToken}` },
          });
          setAccounts(accRes.ok ? await accRes.json() : []);
        } else if (type === "profile") {
          const profRes = await fetch("https://financial-tracker-api-iq2a.onrender.com/api/profile/", {
            headers: { Authorization: `Token ${authToken}` },
          });
          setProfile(profRes.ok ? await profRes.json() : {});
        }
      } else {
        setAlert({ message: "Failed to save changes.", type: "error" });
      }
    } catch (err) {
      setAlert({ message: "Error saving changes.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion (not user deletion)
  const handleDeleteAccount = async (accountId) => {
    setShowDeleteConfirm(accountId);
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://financial-tracker-api-iq2a.onrender.com/api/accounts/${showDeleteConfirm}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${authToken}` },
      });
      if (res.ok) {
        setAccounts((prev) => prev.filter((acc) => acc.id !== showDeleteConfirm));
        setShowDeleteConfirm(false);
        setAlert({ message: "Account deleted.", type: "success" });
        setTimeout(() => {
          navigate("/add-account", { replace: true });
        }, 1200);
      } else {
        setAlert({ message: "Failed to delete account.", type: "error" });
      }
    } catch {
      setAlert({ message: "Network error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Only show profile section if profile data is available and not empty
  const hasProfile = profile && (profile.first_name || profile.last_name || profile.email);

  // Render editable field
  const EditableField = ({
    type,
    id,
    field,
    value,
    label,
    inputType = "text",
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold tracking-wide text-gray-700">{label}</label>
      <input
        type={inputType}
        className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-900 focus:ring-4 focus:ring-indigo-900/10 bg-gray-50 hover:bg-white"
        value={editing[`${type}-${id}`]?.[field] ?? value ?? ""}
        onChange={(e) => handleEditChange(type, id, field, e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  const tabs = [
    { id: 0, label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: 1, label: "Accounts", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-indigo-900 rounded-full border-t-transparent animate-spin"></div>
          <div className="text-lg font-medium text-gray-600">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 py-4 bg-gradient-to-br from-slate-50 to-gray-100 md:px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">Manage your profile and account preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="flex p-1 border shadow bg-white/60 backdrop-blur-sm rounded-xl border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-indigo-900 text-white shadow scale-105'
                    : 'text-gray-600 hover:text-indigo-900 hover:bg-white/50'
                }`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="relative overflow-x-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${activeTab * 100}%)` }}
          >
            {/* Profile Section */}
            <div className={`w-full flex-shrink-0 transition-all duration-300 ${
              activeTab === 0 ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
            }`}>
              {hasProfile ? (
                <div className="overflow-hidden border shadow bg-white/80 backdrop-blur-sm border-white/20 rounded-xl">
                  <div className="px-4 py-4 bg-gradient-to-r from-indigo-900 to-indigo-800">
                    <h2 className="flex items-center text-lg font-bold text-white">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Information
                    </h2>
                    <p className="mt-1 text-xs text-indigo-100">Update your personal details</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <EditableField
                        type="profile"
                        id={user?.id || "me"}
                        field="first_name"
                        value={profile.first_name}
                        label="First Name"
                      />
                      <EditableField
                        type="profile"
                        id={user?.id || "me"}
                        field="last_name"
                        value={profile.last_name}
                        label="Last Name"
                      />
                    </div>
                    <EditableField
                      type="profile"
                      id={user?.id || "me"}
                      field="email"
                      value={profile.email}
                      label="Email Address"
                      inputType="email"
                    />
                    <div className="flex justify-end pt-2">
                      <button
                        className="px-6 py-2 text-sm font-semibold text-white transition-all duration-200 transform bg-indigo-900 rounded-lg shadow hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-900/20 hover:scale-105 hover:shadow-xl"
                        onClick={() => handleSave("profile", user?.id || "me")}
                        type="button"
                      >
                        Save Profile
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border shadow bg-white/80 backdrop-blur-sm border-white/20 rounded-xl">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-base text-gray-500">No profile information available</p>
                </div>
              )}
            </div>

            {/* Bank Accounts Section */}
            <div className={`w-full flex-shrink-0 transition-all duration-300 ${
              activeTab === 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
            }`}>
              <div className="overflow-hidden border shadow bg-white/80 backdrop-blur-sm border-white/20 rounded-xl">
                <div className="px-4 py-4 bg-gradient-to-r from-indigo-900 to-indigo-800">
                  <h2 className="flex items-center text-lg font-bold text-white">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Bank Accounts
                  </h2>
                  <p className="mt-1 text-xs text-indigo-100">Manage your connected accounts</p>
                </div>
                <div className="p-4">
                  {accounts.length === 0 ? (
                    <div className="py-8 text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-base text-gray-500">No bank accounts found</p>
                      <p className="mt-1 text-xs text-gray-400">Add your first account to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {accounts.map((acc, index) => (
                        <div key={acc.id} className="p-4 transition-all duration-200 border border-gray-100 rounded-lg bg-gray-50/50 hover:border-indigo-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-800">Account #{index + 1}</h3>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-xs text-gray-600">Active</span>
                            </div>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <EditableField
                              type="account"
                              id={acc.id}
                              field="bank_name"
                              value={acc.bank_name}
                              label="Bank Name"
                            />
                            <EditableField
                              type="account"
                              id={acc.id}
                              field="account_number"
                              value={acc.account_number}
                              label="Account Number"
                            />
                          </div>
                          <div className="mt-4">
                            <EditableField
                              type="account"
                              id={acc.id}
                              field="balance"
                              value={acc.balance}
                              label="Current Balance ($)"
                              inputType="number"
                            />
                          </div>
                          <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-200 sm:flex-row">
                            <button
                              className="flex-1 px-4 py-2 font-semibold text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-900/20 transform hover:scale-[1.02] transition-all duration-200 shadow hover:shadow-lg text-sm"
                              onClick={() => handleSave("account", acc.id)}
                              type="button"
                            >
                              Save Changes
                            </button>
                            <button
                              className="flex-1 px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/20 transform hover:scale-[1.02] transition-all duration-200 shadow hover:shadow-lg text-sm"
                              onClick={() => handleDeleteAccount(acc.id)}
                              type="button"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-indigo-900 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xs mx-2 overflow-hidden bg-white shadow-2xl rounded-xl">
              <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 bg-red-100 rounded-full">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-red-900">Confirm Deletion</h2>
                    <p className="text-xs text-red-700">This action cannot be undone</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  This will permanently delete this bank account and all related transaction data. Are you sure you want to continue?
                </p>
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 bg-red-600 rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-600/20 hover:shadow-lg"
                    onClick={confirmDeleteAccount}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "info" })} />
    </div>
  );
}