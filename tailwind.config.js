/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#0f172a',
        primary: '#2563eb', // blue-600
        secondary: '#f1f5f9', // slate-100
        accent: '#8b5cf6', // violet-500
        muted: {
          foreground: '#64748b', // slate-500
        },
        input: '#f1f5f9', // slate-100
        card: '#ffffff',
        border: '#e2e8f0', // slate-200
        chart: {
          3: '#10b981', // emerald-500
          4: '#f97316', // orange-500
          5: '#06b6d4', // cyan-500
        }
      },
      fontFamily: {
        heading: ['System'], // フォントは一旦システムフォント
      }
    },
  },
  plugins: [],
}
