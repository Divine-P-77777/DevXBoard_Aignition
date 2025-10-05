import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CodePromptPopup({
  visible,
  onClose,
  onGenerate,
  description,
  isDarkMode,
}) {
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (!visible) setPrompt("");
  }, [visible]);

  const handleUseDescription = () => {
    if (!description) {
      toast.warn("No description available to use as prompt!");
      return;
    }
    setPrompt(description);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }
    onGenerate(prompt);
    setPrompt("");
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`rounded-xl p-6 shadow-2xl w-full max-w-md space-y-5 transition-colors duration-300
          ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
        `}
      >
        {/* Header */}
        <h2 className="text-xl font-bold tracking-wide">
          🚀 Generate Code from Prompt
        </h2>

        {/* Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what code you want to generate..."
          className={`w-full h-28 p-3 rounded-lg resize-none border focus:outline-none focus:ring-2 focus:ring-purple-500 transition
            ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-gray-100 border-gray-300 text-gray-900"}
          `}
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            className="flex-1 px-4 py-2 rounded-lg font-medium
              bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md
              hover:scale-105 hover:shadow-lg transition-transform duration-200"
          >
            Generate
          </button>

          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium shadow-md transition
              ${isDarkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-300 text-gray-900 hover:bg-gray-400"}
            `}
          >
            Cancel
          </button>

          <button
            onClick={handleUseDescription}
            disabled={!description}
            title={description ? "Use description as prompt" : "No description set"}
            className={`px-4 py-2 rounded-lg font-medium shadow-md transition ml-auto
              ${description
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"}
            `}
          >
            Use Description
          </button>
        </div>
      </div>
    </div>
  );
}
