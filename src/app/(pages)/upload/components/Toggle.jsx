import React from "react";

function Toggle({ pressed, onPressedChange, children, isDarkMode }) {
  return (
    <button
      type="button"
      onClick={() => onPressedChange(!pressed)}
      className={`
        px-4 py-1 rounded-full font-medium transition-all duration-300
        shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
        ${pressed
          ? isDarkMode
            ? "bg-gradient-to-r from-green-800 to-green-400 text-white"
            : "bg-gradient-to-r from-green-500 to-green-400 text-white"
          : isDarkMode
            ? "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 hover:from-gray-700 hover:to-gray-600"
            : "bg-gradient-to-r from-gray-200 to-gray-100 text-gray-800 hover:from-gray-300 hover:to-gray-200"
        }
      `}
    >
      {children}
    </button>
  );
}

export default Toggle;

