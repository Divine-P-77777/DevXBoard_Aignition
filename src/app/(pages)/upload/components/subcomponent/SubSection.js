"use client";

import { Sparkles, Loader2, Undo2 } from "lucide-react";
import Toggle from "../Toggle";
import CodeBlockCell from "../CodeBlockItem";

/* ---------------- Title Section ---------------- */
export function TitleSection({
  title,
  setTitle,
  handleAICorrectTitle,
  titleCorrection,
  undoTitle,
  subtitle,
  setSubtitle,
  handleAICorrectSubtitle,
  subtitleCorrection,
  undoSubtitle,
}) {
  return (
    <div className="space-y-2">
      {/* Title */}
      <div className="flex gap-2 items-center">
        <input
          className="w-full px-4 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none 
            dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          placeholder="Enter Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleAICorrectTitle}
          className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={titleCorrection.loading}
        >
          <Sparkles size={16} />
          {titleCorrection.loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            "AI"
          )}
        </button>
        {titleCorrection.showUndo && (
          <button
            onClick={undoTitle}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            <Undo2 size={14} /> Undo
          </button>
        )}
      </div>

      {/* Subtitle */}
      <div className="flex gap-2 items-center">
        <input
          className="w-full px-4 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none 
            dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          placeholder="Subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <button
          onClick={handleAICorrectSubtitle}
          className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={subtitleCorrection.loading}
        >
          <Sparkles size={16} />
          {subtitleCorrection.loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            "AI"
          )}
        </button>
        {subtitleCorrection.showUndo && (
          <button
            onClick={undoSubtitle}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            <Undo2 size={14} /> Undo
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Visibility Section ---------------- */
export function VisibilitySection({ visibility, setVisibility }) {
  return (
    <div className="flex gap-4 items-center">
      <span className="font-medium">Visibility:</span>
      <Toggle
        pressed={visibility === "public"}
        onPressedChange={() =>
          setVisibility((v) => (v === "public" ? "private" : "public"))
        }
      >
        {visibility === "public" ? "🌍 Public" : "🔒 Private"}
      </Toggle>
    </div>
  );
}

/* ---------------- Code Blocks Section ---------------- */
export function CodeBlocksSection({
  codeBlocks,
  updateCodeBlock,
  removeCodeBlock,
  handleAI,
  handlePromptClick,
  isDarkMode,
  undoCode,
  descLoading,
  descPrev,
  handleGenDescription,
  undoDesc,
}) {
  return (
    <>
      {codeBlocks.map((block, idx) => (
        <CodeBlockCell
          key={block.id}
          block={block}
          idx={idx}
          onChange={updateCodeBlock}
          onRemove={removeCodeBlock}
          onAI={handleAI}
          onPromptClick={handlePromptClick}
          isDarkMode={isDarkMode}
          undoCode={undoCode}
          canUndo={!!block.prevCode}
          onGenDescription={handleGenDescription}
          genDescLoading={!!descLoading[block.id]}
          descCanUndo={!!descPrev[block.id]}
          undoDesc={undoDesc}
        
        />
      ))}
    </>
  );
}
