import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CodePromptPopup({ visible, onClose, onGenerate, description }) {
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
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold mb-2">Generate Code from Prompt</h2>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe what code you want to generate..."
          className="w-full h-24 p-2 border rounded resize-none dark:bg-gray-800 dark:border-gray-600"
        />
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleGenerate}
          >
            Generate
          </button>
          <button
            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 ml-auto"
            onClick={handleUseDescription}
            disabled={!description}
            title={description ? "Use description as prompt" : "No description set"}
          >
            Use Description
          </button>
        </div>
      </div>
    </div>
  );
}