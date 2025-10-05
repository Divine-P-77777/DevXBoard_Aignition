import React, { useRef, useLayoutEffect } from "react";
import { X, Bot, Undo2, Wand2, Loader2, Sparkles } from "lucide-react";

export default function CodeBlockCell({
  block,
  idx,
  onChange,
  onRemove,
  onAI,
  onPromptClick,
  isDarkMode,
  undoCode,
  canUndo,
  onGenDescription,
  genDescLoading,
  descCanUndo,
  undoDesc,
  handleAICorrectCode
}) {
  const descRef = useRef();
  const codeRef = useRef();

  // --- Smooth resizing for description ---
  useLayoutEffect(() => {
    if (descRef.current) {
      descRef.current.style.height = "auto";
      descRef.current.style.height = descRef.current.scrollHeight + "px";
    }
  }, [block.description]);

  // --- Smooth resizing for code ---
  useLayoutEffect(() => {
    if (codeRef.current) {
      codeRef.current.style.height = "auto";
      codeRef.current.style.height = codeRef.current.scrollHeight + "px";
    }
  }, [block.code, block.loading]);

  return (
    <div
      className={`relative rounded-xl border shadow-sm p-4 space-y-4 transition-colors
        ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(block.id)}
        className="absolute -top-10 right-0 text-pink-500 hover:text-red-700"
        type="button"
      >
        <X size={30} className="bg-black/70 m-2 rounded-full border" />
      </button>

      {/* --- Description --- */}
      <div className="flex gap-2 items-start">
        <textarea
          ref={descRef}
          placeholder={`Description for block ${idx + 1}`}
          value={block.description}
          onChange={(e) => onChange(block.id, "description", e.target.value)}
          className={`w-full border rounded px-3 py-2 resize-none focus:ring-2 transition-all
            ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-purple-500" : "bg-white border-gray-300 focus:ring-indigo-500"}
          `}
          style={{ minHeight: 36, maxHeight: 200, transition: "height 0.2s" }}
        />
        <button
          onClick={() => onGenDescription(block.id)}
          className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 mt-1"
          disabled={genDescLoading}
          type="button"
        >
          <Sparkles size={16} />
          {genDescLoading ? <Loader2 className="animate-spin" size={14} /> : ""}
        </button>
        {descCanUndo && (
          <button
            onClick={() => undoDesc(block.id)}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 mt-1"
            type="button"
          >
            <Undo2 size={14} /> Undo
          </button>
        )}
      </div>

      {/* --- Code Area with Loader Overlay --- */}
      <div className="relative">
        {block.language && (
          <span
            className={`absolute top-0 right-0 mt-1 mr-2 text-xs px-2 py-0.5 rounded-full
              ${isDarkMode ? "text-gray-300 bg-gray-700" : "text-gray-700 bg-gray-200"}
            `}
          >
            {block.language.toUpperCase()}
          </span>
        )}

        <textarea
          ref={codeRef}
          className={`w-full resize-none overflow-y-auto font-mono p-4 rounded-md focus:ring-2 transition-all
            ${isDarkMode ? "bg-black text-cyan-400 focus:ring-purple-500" : "bg-gray-100 text-gray-900 focus:ring-blue-500"}
            custom-scroll
          `}
          value={block.code}
          onChange={(e) => {
            if (!block.loading) {
              onChange(block.id, "code", e.target.value);
              onChange(block.id, "language", (window.detectLanguage || (() => ""))(e.target.value));
            }
          }}
          placeholder="💻 Write your code here..."
          rows={3}
          style={{ minHeight: 60, maxHeight: 400, transition: "height 0.25s ease" }}
          readOnly={block.loading}
        />
        {/* Loader overlay */}
        {block.loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 dark:bg-black/70 rounded-md z-10">
            <Loader2 className="animate-spin text-purple-400" size={32} />
          </div>
        )}
      </div>

      {/* --- Buttons --- */}
      {block.code.trim() === "" ? (
        <button
          onClick={() => onPromptClick(block.id)}
          className={`flex items-center gap-2 px-4 py-2 
             bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700
             text-white rounded-xl shadow-lg shadow-purple-500/30
             hover:from-pink-500 hover:to-purple-600
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:shadow-pink-500/50"
          type="button`}
        >
          <Wand2 size={18} className="text-white drop-shadow" />
          <span className="font-medium tracking-wide">Generate Code</span>
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onAI(block.id)}
            disabled={block.loading}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 
              rounded-xl shadow-lg transition-all duration-300 ease-in-out
              bg-gradient-to-r from-pink-500 via-purple-600 to-pink-700
              text-white tracking-wide font-medium
              hover:scale-105 hover:shadow-purple-500/50
              ${block.loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <Bot size={18} className="drop-shadow" />
            {block.loading ? (
              <>
                <Loader2 className="animate-spin text-purple-400" size={16} />
                <span>Working...</span>
              </>
            ) : (
              "AI Autocorrect"
            )}
          </button>
          {canUndo && (
            <button
              onClick={() => undoCode(block.id)}
              className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              type="button"
            >
              <Undo2 size={16} /> Undo
            </button>
          )}
        </div>
      )}

      {/* --- Custom Scrollbar --- */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
          border-radius: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7, #9333ea);
          border-radius: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea, #7e22ce);
        }
      `}</style>
    </div>
  );
}