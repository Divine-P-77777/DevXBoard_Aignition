"use client";

import { Sparkles, Loader2, Undo2, Globe, Lock } from "lucide-react";

import CodeBlockCell from "../CodeBlockItem";
import {useState,useEffect , useRef} from "react"



export function VisibilitySection({
  visibility,
  setVisibility,
  isDarkMode,
  sharedUsernames,
  setSharedUsernames,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 🔍 Fetch usernames matching the query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/profile/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.profiles || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400); // debounce typing

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // ⏬ Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAddUser = (username) => {
    if (!sharedUsernames.includes(username)) {
      setSharedUsernames([...sharedUsernames, username]);
      setQuery("");
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      handleAddUser(results[0].username);
    }
  };

  const handleRemove = (username) => {
    setSharedUsernames(sharedUsernames.filter((u) => u !== username));
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Visibility toggle */}
      <div className="flex gap-4 items-center">
        <span
          className={`font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Visibility:
        </span>
        <button
          type="button"
          onClick={() =>
            setVisibility((v) => (v === "public" ? "private" : "public"))
          }
          className={`flex gap-2 items-center px-3 py-1 rounded transition ${
            visibility === "public"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {visibility === "public" ? (
            <>
              <Globe size={18} />
              <span>Public</span>
            </>
          ) : (
            <>
              <Lock size={18} />
              <span>Private</span>
            </>
          )}
        </button>
      </div>

      {/* Private section for shared users */}
      {visibility === "private" && (
        <div
          className={`space-y-3 border rounded-md p-3 mt-2 ${
            isDarkMode
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <p className="text-sm text-gray-500">
            Search usernames to grant private access:
          </p>
          <p className={`text-sm ${isDarkMode ? "text-cyan-500" : "text-cyan-900"} `}>
            Note : In private mode, If you don't add any usernames, only you will
            have access.
          </p>

          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={handleEnter}
              placeholder="Search username..."
              className={`w-full px-3 py-2 rounded border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />

            {/* Loader or Results dropdown */}
            {showDropdown && query.trim() && (
              <div
                className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg border ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
                  </div>
                ) : results.length > 0 ? (
                  results.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => handleAddUser(u.username)}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer  ${isDarkMode ?"hover:bg-gray-100 ":"hover:bg-gray-800 "}  ${
                        sharedUsernames.includes(u.username)
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      <img
                        src={u.pic || "/default-avatar.png"}
                        alt={u.username}
                        className="w-7 h-7 rounded-full"
                      />
                      <span className="text-sm">{u.username}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Added users */}
          <div className="flex flex-wrap gap-2 mt-2">
            {sharedUsernames.map((username) => (
              <span
                key={username}
                className={`px-2 py-1 text-sm rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"} flex items-center gap-1 border-purple-500 border`}
              >
                {username}
                <button
                  type="button"
                  onClick={() => handleRemove(username)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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