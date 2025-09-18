/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#F59E0B",
        success: "#F59E0B",
        error: "#EF4444",
        surface: "#ffffff",
        background: "#f9fafb",
        text: "#111827",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
