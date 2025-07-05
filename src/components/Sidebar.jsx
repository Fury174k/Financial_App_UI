import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar({ isOpen = true, onClose }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (onClose) onClose();
    switch (section) {
      case 'dashboard':
        navigate('/');
        break;
      case 'cards':
        navigate('/cards');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'add-expense':
        navigate('/add-expense');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`sidebar z-40 fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-4 shadow-xl min-h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 md:hidden p-2 rounded-lg text-indigo-200 hover:bg-indigo-700 focus:outline-none"
        onClick={onClose}
        aria-label="Close sidebar menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          <span className="text-indigo-300">Fin</span>Dash
        </h1>
        <p className="mt-1 text-sm text-indigo-300">Financial Dashboard</p>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-3">
          <li>
            <button 
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 border border-indigo-600/30 ${activeSection === 'dashboard' ? 'bg-indigo-700/50 text-white hover:bg-indigo-600/70' : 'text-indigo-200 hover:bg-indigo-700/50 hover:text-white'}`}
            >
              <span className="mr-3 text-lg">📊</span>
              <span className="font-medium">Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('cards')}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${activeSection === 'cards' ? 'bg-indigo-700/50 text-white' : 'text-indigo-200 hover:bg-indigo-700/50 hover:text-white'}`}
            >
              <span className="mr-3 text-lg">💳</span>
              <span className="font-medium">Cards</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('analytics')}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${activeSection === 'analytics' ? 'bg-indigo-700/50 text-white' : 'text-indigo-200 hover:bg-indigo-700/50 hover:text-white'}`}
            >
              <span className="mr-3 text-lg">📈</span>
              <span className="font-medium">Analytics</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('add-expense')}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${activeSection === 'add-expense' ? 'bg-indigo-700/50 text-white' : 'text-indigo-200 hover:bg-indigo-700/50 hover:text-white'}`}
            >
              <span className="mr-3 text-lg">💸</span>
              <span className="font-medium">Add Expense</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${activeSection === 'settings' ? 'bg-indigo-700/50 text-white' : 'text-indigo-200 hover:bg-indigo-700/50 hover:text-white'}`}
            >
              <span className="mr-3 text-lg">⚙️</span>
              <span className="font-medium">Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center justify-center w-full p-3 mb-3 font-semibold text-white transition-all duration-200 bg-red-600 rounded-xl hover:bg-red-700"
        >
          <span className="mr-2">🚪</span> Logout
        </button>
        <div className="p-3 border rounded-lg bg-indigo-700/30 border-indigo-600/30">
          <p className="text-xs font-medium text-indigo-200">Need help?</p>
          <p className="text-xs text-indigo-300">Contact support</p>
        </div>
      </div>
    </div>
  );
}