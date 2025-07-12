💰 Financial Tracker UI
A sleek, modern, and responsive React-based dashboard designed to simplify personal finance management. This app helps users monitor expenses, manage multiple accounts, and visualize their financial habits with interactive charts and ML-powered insights — all backed by a Django REST API.

✨ Features
🔐 Authentication – Secure token-based login and registration system.

📊 Dashboard Overview – View total balance, recent transactions, and shortcuts to key actions.

🏦 Account Management – Add and manage multiple bank accounts with ease.

💸 Track Expenses & Income – Log and categorize financial activity in a clean, intuitive UI.

📈 Analytics – Get spending trends, breakdowns, and predictive insights (mock data for now).

📑 Reports – Interactive pie and bar charts for visual breakdowns of spending by category.

🔔 Notifications – System alerts and updates delivered in a collapsible panel.

⚙️ Settings – Manage profile preferences and user configuration.

📱 Mobile Ready – Fully responsive layout with optimized sidebar and transitions.

🧱 Project Structure

financial-ui/
├── src/
│   ├── components/     # Reusable UI components (e.g., Sidebar, AddExpense, Analytics)
│   ├── context/        # AuthContext for managing authentication state
│   ├── pages/          # Top-level page views (Dashboard, Login, Home, etc.)
│   ├── assets/         # Animations, icons, and media
│   └── styles/         # Tailwind customizations (if used)
├── public/             # Static files and root HTML
├── package.json        # Project dependencies
└── tailwind.config.js  # Tailwind CSS config
🧩 Key Modules & Status
Module	Description	Status
Authentication	Login & register with feedback for slow or failed responses	✅ Fully functional
Dashboard	Balance, recent activity, and fast-access cards	✅ Functional & stable
Add Account / Expense	Create and categorize financial entries, with live alerts	✅ Integrated
Transaction History	Expandable list of transactions, with delete support	✅ Complete
Total Balance	Aggregates account totals and updates in real time	✅ Live
Analytics	Charts for weekly trends, category spend, and ML predictions (mocked)	⚠️ Uses mock data
Reports	Visual spending summaries via pie/bar charts	✅ Connected to real data
Notifications	Real-time alert panel powered by backend	✅ Working with live API
Responsive Sidebar	Closes on mobile, supports route navigation	✅ Fixed & smooth

🛠️ Areas to Improve
API Integration: Replace mock chart data in Analytics.jsx with real backend data.

Error Feedback: Add clearer user messages for edge cases and failed API calls.

Testing: Expand test coverage for UI components and backend interactions.

Accessibility: Improve ARIA labels and keyboard support (especially for modals).

Performance: Optimize long lists and consider memo/useCallback where necessary.

Code Cleanup: Remove dead imports/variables and enforce consistent formatting.

⚠️ Known Limitations
Analytics.jsx: Currently uses hardcoded data for trends and ML predictions.

Some placeholder content may appear if the backend isn't returning expected values.

Notifications require the backend to be live and reachable.

🚀 Getting Started
Install dependencies:


npm install
Start the dev server:


npm start
Environment:

Ensure your backend API is live (default: https://financial-tracker-api-1wlt.onrender.com).

Auth tokens are stored securely in localStorage.

🌍 Deployment
Frontend: https://financial-app-ui.vercel.app

Backend API: Hosted on Render (URL customizable)

🤝 Contributing
Contributions are welcome!
If you’ve got an idea, improvement, or bug fix, feel free to open an issue or submit a pull request.
For significant changes, let’s start a discussion first to stay aligned with the project's goals.

📬 Contact
Have questions or want to collaborate?
Reach out via GitHub Issues or contact the project maintainer directly.