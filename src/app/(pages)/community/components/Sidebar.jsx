// components/Sidebar.js
"use client";
import clsx from "clsx";

export default function Sidebar({ view, setView, isDarkMode }) {
  const views = ["liked", "saved", "all"];
  return (
    <aside
      className={clsx(
        "w-64 px-6 py-8 border-r pt-30 hidden md:block sticky top-0 h-screen transition-colors duration-300",
        isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-300 bg-white"
      )}
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-500">
        Community Dashboard
      </h2>
      <nav className="space-y-3">
        {views.map((v) => {
          const label =
            v === "liked"
              ? "Liked Blogs"
              : v === "saved"
              ? "Saved Templates"
              : "All Templates";
          const color = v === "liked" ? "purple" : v === "saved" ? "pink" : "blue";
          return (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                "block w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-300",
                view === v
                  ? `bg-${color}-500 text-white shadow-lg`
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-200 text-gray-700"
              )}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
