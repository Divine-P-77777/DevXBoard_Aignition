import React from 'react'

function Toggle({ pressed, onPressedChange, children }) {
  return (
    <button
      type="button"
      onClick={() => onPressedChange(!pressed)}
      className={`px-4 py-1 rounded-full font-medium transition 
        ${pressed ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"}
        dark:${pressed ? "bg-green-500 text-black" : "bg-gray-700 text-gray-100"}`}
    >
      {children}
    </button>
  );
}


export default Toggle
