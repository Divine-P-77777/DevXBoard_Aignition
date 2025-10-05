"use client";

import React from "react";
import { useSelector } from "react-redux";

const ConfirmPopup = ({
  visible,
  onConfirm,
  onCancel,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`p-[2px] rounded-xl w-[90%] max-w-sm shadow-2xl ${isDark
          ? "bg-gradient-to-r from-purple-500 to-pink-500"
          : "bg-gradient-to-r from-purple-400 to-pink-400"
        }`}
      >
        <div className={`rounded-lg p-6 space-y-4 ${isDark ? "bg-zinc-900 text-white" : "bg-white text-black"}`}>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className={isDark ? "text-white" : "text-black"}>{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className={`px-4 py-1 text-sm rounded ${isDark
                ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
