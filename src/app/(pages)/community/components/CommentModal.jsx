// components/CommentModal.js
"use client";
import clsx from "clsx";
import { X, User } from "lucide-react";

export default function CommentModal({ selectedTemplate, setSelectedTemplate, isDarkMode, handleComment }) {
  if (!selectedTemplate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        className={clsx(
          "rounded-xl p-6 w-full max-w-lg relative transition-colors duration-300",
          isDarkMode ? "bg-gray-900" : "bg-white"
        )}
      >
        <button
          onClick={() => setSelectedTemplate(null)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          Comments on {selectedTemplate.title}
        </h2>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {selectedTemplate.comments?.map((c, idx) => (
            <div key={idx} className="flex items-start gap-2 border-b pb-2 border-gray-200">
              <User size={16} />
              <p className="text-sm">{c.comment}</p>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            const input = e.target.elements.comment;
            handleComment(e, selectedTemplate.id, input.value);
            input.value = "";
          }}
          className="mt-4 flex gap-2"
        >
          <input
            name="comment"
            type="text"
            placeholder="Add a comment..."
            className={clsx(
              "flex-1 rounded-xl border px-3 py-2 outline-none transition-all duration-300",
              isDarkMode ? "border-gray-700 bg-gray-800 text-gray-200" : "border-gray-300 bg-white text-gray-900"
            )}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
