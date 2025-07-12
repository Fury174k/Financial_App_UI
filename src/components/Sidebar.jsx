import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ isOpen = true, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const sidebarRef = useRef(null);

  const handleNavClick = (section) => {
    if (onClose) onClose();
    switch (section) {
      case 'dashboard': navigate('/'); break;
      case 'cards': navigate('/cards'); break;
      case 'analytics': navigate('/analytics'); break;
      case 'add-expense': navigate('/add-expense'); break;
      case 'settings': navigate('/settings'); break;
      default: break;
    }
  };

  const isActive = (path) => {
    if (path === 'dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(`/${path}`);
  };

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'cards', icon: '💳', label: 'Cards' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'add-expense', icon: '💸', label: 'Add Expense' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  // ⛔️ Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={sidebarRef}
      className={`sidebar z-40 fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white p-4 shadow-2xl min-h-screen transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      {/* Close Button (Mobile) */}
      <button
        className="absolute p-2 text-indigo-200 transition-all duration-200 rounded-lg top-4 right-4 md:hidden hover:bg-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onClick={onClose}
        aria-label="Close sidebar menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          <span className="text-indigo-300">Fin</span>Dash
        </h1>
        <p className="mt-1 text-sm text-indigo-300 opacity-90">Financial Dashboard</p>
        <div className="mt-3 h-0.5 bg-gradient-to-r from-indigo-400 via-indigo-300 to-transparent rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  isActive(item.id)
                    ? 'bg-indigo-700/60 text-white border-l-4 border-indigo-300 shadow-lg'
                    : 'text-indigo-200 hover:bg-indigo-700/40 hover:text-white hover:border-l-4 hover:border-indigo-400'
                }`}
              >
                <span className={`mr-3 text-lg transition-transform duration-200 ${
                  isActive(item.id) ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                {isActive(item.id) && (
                  <span className="w-2 h-2 ml-auto bg-indigo-300 rounded-full animate-pulse"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center justify-center w-full p-3 mb-4 font-semibold text-white transition-all duration-200 transform bg-red-600 rounded-xl hover:bg-red-700 hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <span className="mr-2">🚪</span> Logout
        </button>
        
        <div className="p-3 transition-all duration-200 border rounded-xl bg-indigo-700/30 border-indigo-600/30 backdrop-blur-sm hover:bg-indigo-700/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-indigo-200">Need help?</p>
              <p className="text-xs text-indigo-300">Contact support</p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600/50">
              <span className="text-sm">💬</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
