"use client";

import { Sparkles, Loader2, Undo2, Globe, Lock } from "lucide-react";
import Toggle from "../Toggle";
import CodeBlockCell from "../CodeBlockItem";

/* ---------------- Utility for Theme ---------------- */
function getInputClasses(isDarkMode) {
  return `
    w-full px-4 py-2 rounded-md border shadow-sm outline-none 
    focus:ring-2 focus:ring-blue-500 transition-all
    ${isDarkMode 
      ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
    }
  `;
}

function getButtonClasses(base, isDarkMode, color) {
  const colors = {
    green: isDarkMode 
      ? "bg-green-600 hover:bg-green-500 text-white" 
      : "bg-green-500 hover:bg-green-600 text-white",
    yellow: isDarkMode 
      ? "bg-yellow-600 hover:bg-yellow-500 text-white" 
      : "bg-yellow-500 hover:bg-yellow-600 text-white",
  };
  return `flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${colors[color]} ${base}`;
}

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
  isDarkMode,
}) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex gap-2 items-center">
        <input
          className={getInputClasses(isDarkMode)}
          placeholder="Enter Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleAICorrectTitle}
          className={getButtonClasses("", isDarkMode, "green")}
          disabled={titleCorrection.loading}
        >
          <Sparkles size={16} />
          {titleCorrection.loading ? (
            <Loader2 className="animate-spin text-purple-500" size={14} />
          ) : (
            "AI"
          )}
        </button>
        {titleCorrection.showUndo && (
          <button
            onClick={undoTitle}
            className={getButtonClasses("", isDarkMode, "yellow")}
          >
            <Undo2 size={14} /> Undo
          </button>
        )}
      </div>

      {/* Subtitle */}
      <div className="flex gap-2 items-center">
        <input
          className={getInputClasses(isDarkMode)}
          placeholder="Subtitle (optional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <button
          onClick={handleAICorrectSubtitle}
          className={getButtonClasses("", isDarkMode, "green")}
          disabled={subtitleCorrection.loading}
        >
          <Sparkles size={16} />
          {subtitleCorrection.loading ? (
            <Loader2 className="animate-spin text-purple-500" size={14} />
          ) : (
            "AI"
          )}
        </button>
        {subtitleCorrection.showUndo && (
          <button
            onClick={undoSubtitle}
            className={getButtonClasses("", isDarkMode, "yellow")}
          >
            <Undo2 size={14} /> Undo
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Visibility Section ---------------- */
export function VisibilitySection({ visibility, setVisibility, isDarkMode }) {
  return (
    <div className="flex gap-4 items-center mt-4 ">
      <span
        className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
      >
        Visibility:
      </span>
      <Toggle isDarkMode={isDarkMode}
        pressed={visibility === "public"}
        onPressedChange={() =>
          setVisibility((v) => (v === "public" ? "private" : "public"))
        }
      >
        {visibility === "public" ? (
          <div className="flex gap-2 items-center text-sm font-medium ">
            <Globe
              color={isDarkMode ? "white" : "black"}
              className="w-5 h-5"
            />
            <span className={isDarkMode ? "text-white" : "text-black"}>Public</span>
          </div>
        ) : (
          <div className="flex gap-2 items-center text-sm font-medium">
            <Lock
              color={isDarkMode ? "white" : "black"}
              className="w-5 h-5"
            />
            <span className={isDarkMode ? "text-white" : "text-black"}>Private</span>
          </div>
        )}
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
    <div className="space-y-4 mt-6">
      {codeBlocks.map((block, idx) => (
        <div key={block.id || idx} className="relative">
          <CodeBlockCell
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
          {/* Purple loader overlay for block generation/correction */}
          {/* {block.loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 dark:bg-black/60 rounded-xl z-10">
              <Loader2 className="animate-spin text-purple-500" size={38} />
            </div>
          )} */}
        </div>
      ))}
    </div>
  );
}