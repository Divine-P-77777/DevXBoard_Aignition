// /ui/popup.js
"use client";

import React from "react";

const ConfirmPopup = ({ visible, onConfirm, onCancel, title = "Confirm Delete", message = "Are you sure you want to delete this item? This action cannot be undone.", confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl space-y-4 w-[90%] max-w-sm">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 rounded"
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
  );
};

export default ConfirmPopup;