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
}) {
  const descRef = useRef();
  const codeRef = useRef();
  // --- Smooth expanding for textarea ---
  useLayoutEffect(() => {
    if (descRef.current) {
      descRef.current.style.height = "auto";
      descRef.current.style.height = descRef.current.scrollHeight + "px";
    }
  }, [block.description]);
  useLayoutEffect(() => {
    if (codeRef.current) {
      codeRef.current.style.height = "auto";
      codeRef.current.style.height = codeRef.current.scrollHeight + "px";
    }
  }, [block.code]);

  return (
    <div
      className={`relative rounded-xl border shadow-sm p-4 space-y-4
        ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white"}`}
    >
      <button
        onClick={() => onRemove(block.id)}
        className=" absolute top-[-40px] right-0 text-pink-500 hover:text-red-700"
        type="button"
      >
        <X size={30} className="bg-black m-2 rounded-full border" />
      </button>
      {/* --- Description --- */}
      <div className="flex gap-2 items-start">
        <textarea
          ref={descRef}
          placeholder={`Description for block ${idx + 1}`}
          value={block.description}
          onChange={e => onChange(block.id, "description", e.target.value)}
          className="w-full border rounded px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-500
            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition-all"
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
      {/* --- Code Input + Loader Overlay --- */}
      <div className="relative">
        {block.language && (
          <span className="absolute top-0 right-0 mt-1 mr-2 text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {block.language.toUpperCase()}
          </span>
        )}
        <textarea
          ref={codeRef}
          className="w-full resize-none overflow-hidden bg-gray-900 text-cyan-400 font-mono p-4 rounded-md
            focus:ring-2 focus:ring-blue-500 dark:bg-black transition-all"
          value={block.code}
          onChange={e => {
            onChange(block.id, "code", e.target.value);
            onChange(block.id, "language", (window.detectLanguage || (()=>''))(e.target.value));
          }}
          placeholder="💻 Write your code here..."
          rows={3}
          style={{ minHeight: 60, maxHeight: 400, transition: "height 0.2s" }}
        />
        {block.loading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md z-10">
            <Loader2 size={32} className="animate-spin text-white" />
          </div>
        )}
      </div>
      {/* --- Buttons --- */}
      {block.code.trim() === "" ? (
        <button
          onClick={() => onPromptClick(block.id)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="button"
        >
          <Wand2 size={16} />
          Generate Code from Prompt
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onAI(block.id)}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={block.loading}
            type="button"
          >
            <Bot size={16} />
            {block.loading ? "Generating..." : "AI Autocorrect"}
            {block.loading && <Loader2 className="animate-spin" size={16} />}
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
    </div>
  );
}