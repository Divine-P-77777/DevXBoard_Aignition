"use client";

import clsx from "clsx";
import { LayoutDashboard, Share2, Users } from "lucide-react";

export default function TemplateSidebar({ activeSection, setActiveSection, isDarkMode }) {
  const items = [
    { id: "myTemplates", label: "My Templates", icon: LayoutDashboard },
    { id: "sharedByMe", label: "Shared by Me", icon: Share2 },
    { id: "sharedWithMe", label: "Shared with Me", icon: Users },
  ];

  return (
    <aside
      className={clsx(
        "flex md:flex-col w-full pt-30 md:w-64 border-b md:border-b-0 md:border-r transition-all duration-300",
        isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
      )}
    >
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveSection(id)}
          className={clsx(
            "flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 px-4 py-3 font-medium transition-all duration-300",
            activeSection === id
              ? isDarkMode
                ? "bg-purple-700 text-white"
                : "bg-purple-100 text-purple-800"
              : isDarkMode
              ? "text-gray-400 hover:text-purple-300 hover:bg-gray-800"
              : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
          )}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}
