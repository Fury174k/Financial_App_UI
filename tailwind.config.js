module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html"
  ],
  safelist: [
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'hidden',
    'block',
    'lg:block',
    'lg:hidden',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'lg:grid-cols-4',
    'text-green-500',
    'bg-blue-500',
    'flex',
    'lg:flex',
    'lg:w-64',
    'lg:fixed',
    'lg:static',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

