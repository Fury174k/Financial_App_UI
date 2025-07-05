import NotificationPanel from "./NotificationPanel";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  BellIcon, 
  CogIcon, 
  ChevronDownIcon 
} from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const { user, authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
  <div className="w-full p-2 bg-white border-b border-gray-100 shadow-sm navbar">
    <div className="flex justify-between items-center w-full max-w-[100vw]">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-lg text-indigo-700 hover:bg-indigo-100 focus:outline-none"
        onClick={onMenuClick}
        aria-label="Open sidebar menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-lg font-semibold text-indigo-800">
        Welcome back{user?.username ? `, ${user.username}` : ""}!
      </h1>
      
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative">
          <NotificationPanel userToken={authToken} showBellWithBadge />
        </div>

        {/* Settings Icon */}
        <button
          className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
          onClick={() => navigate('/settings')}
        >
          <CogIcon className="w-5 h-5" />
        </button>

        {/* User Profile Section */}
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1.5 transition-colors duration-200">
          {/* Profile Picture */}
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt="Profile"
              className="object-cover w-8 h-8 border-2 border-indigo-200 rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600">
              {user?.username?.charAt(0) || "?"}
            </div>
          )}
          
          {/* Username and Chevron */}
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-700">
              {user?.username || "User"}
            </span>
            <ChevronDownIcon className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
}