"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import { ArrowLeft, Search, Sun, Moon, Copy, UserCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";

// Helper to copy code and show toast
const handleCopy = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied!", { transition: Bounce });
  } catch {
    toast.error("Copy failed");
  }
};

function readingTime(text) {
  // 200 words/minute
  if (!text) return "1 min read";
  const wpm = 200;
  const words = text.split(/\s+/).length;
  const mins = Math.ceil(words / wpm);
  return `${mins} min read`;
}

const TemplateViewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [template, setTemplate] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);

  // Fetch template by id
  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/template/${user.id}`);
        if (res.status === 403) {
          setHasAccess(false);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setTemplate(data.data);
        setFilteredBlocks(data.data.blocks || []);
        setHasAccess(true);
      } catch (err) {
        toast.error("Failed to load template", { transition: Bounce });
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };
    if (id && user) fetchTemplate();
  }, [id, user]);

  // Search within code/desc
  useEffect(() => {
    if (!search.trim()) {
      setFilteredBlocks(template?.blocks || []);
      return;
    }
    const q = search.trim().toLowerCase();
    setFilteredBlocks(
      (template?.blocks || []).filter(
        (b) =>
          b.description?.toLowerCase().includes(q) ||
          b.code?.toLowerCase().includes(q)
      )
    );
  }, [search, template]);

  // Theme styles
  const isDark = theme === "dark";
  const bgBase = isDark ? "bg-[#0B0B13]" : "bg-[#F6F6F8]";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-700";
  const borderCard = isDark ? "border-gray-700" : "border-gray-200";
  const bgCard = isDark ? "bg-[#181825]" : "bg-white";
  const bgNavbar = isDark ? "bg-[#13131C]" : "bg-[#101014]";
  const bgSearch = isDark ? "bg-[#22223C]" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const borderIndigo = isDark ? "border-indigo-500" : "border-indigo-600";
  const blockDesc = isDark ? "text-indigo-300" : "text-indigo-700";
  const preBg = isDark ? "bg-[#14141c]" : "bg-gray-900";
  const preText = isDark ? "text-cyan-200" : "text-cyan-200";

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgBase}`}>
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${bgBase}`}>
        <span className="text-4xl mb-4">🔒</span>
        <h2 className={`text-2xl font-bold ${textSecondary} mb-2`}>You don't have access</h2>
        <p className={`${textSecondary}`}>This template is private or does not exist.</p>
      </div>
    );
  }

  if (!template) return null;

  // --- Layout: Custom Navbar & Floated Footer ---
  return (
    <div className={`min-h-screen flex flex-col ${bgBase}`}>
      {/* Custom Navbar */}
      <div className={`flex items-center px-4 py-3 ${bgNavbar} border-b border-gray-800 relative z-20`}>
        {/* Back Arrow */}
        <button onClick={() => router.back()} className="mr-2 p-1 rounded hover:bg-gray-800">
          <ArrowLeft className="text-white" size={24} />
        </button>
        {/* Blog Title */}
        <h1 className={`font-bold text-lg md:text-xl flex-1 truncate text-white`}>{template.title}</h1>
        {/* Search Bar */}
        <div className={`flex items-center ${bgSearch} rounded-full px-2 py-1 ml-2 mr-3`}>
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`bg-transparent outline-none ${inputText} px-2 py-1 w-28 md:w-40`}
          />
        </div>
        {/* Dark mode button */}
        <button
          className="p-2 rounded-full hover:bg-gray-800 transition"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="text-white" size={20} />
          ) : (
            <Moon className="text-gray-800" size={20} />
          )}
        </button>
        {/* User pic */}
        <div className="ml-2">
          {template.user?.avatar_url ? (
            <img
              src={template.user.avatar_url}
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-700"
              alt={template.user.username}
            />
          ) : (
            <UserCircle2 className="w-9 h-9 text-gray-400" />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-32 max-w-3xl mx-auto w-full">
        {/* Banner */}
        {template.cover_image && (
          <div className="w-full h-44 md:h-60 bg-gray-200 flex items-center justify-center overflow-hidden rounded-b-lg mb-2">
            <img src={template.cover_image} alt="Banner" className="object-cover w-full h-full" />
          </div>
        )}

        {/* Title and Meta */}
        <div className="flex flex-col items-center mt-6">
          <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-3 ${textMain}`}>
            {template.title}
          </h2>
          <div className="flex items-center gap-3 mb-3">
            {/* Author pic and name */}
            {template.user?.avatar_url ? (
              <img src={template.user.avatar_url} className={`w-12 h-12 rounded-full object-cover ${borderIndigo}`} alt={template.user.username} />
            ) : (
              <UserCircle2 className="w-12 h-12 text-indigo-600" />
            )}
            <span className={`font-semibold text-lg ${textMain}`}>{template.user?.username || "Unknown Author"}</span>
            {/* Date */}
            <span className={`${textSecondary} text-sm`}>
              {template.created_at
                ? formatDistanceToNow(new Date(template.created_at), { addSuffix: true })
                : ""}
            </span>
            {/* Reading time */}
            <span className={`${textSecondary} text-sm`}>
              {readingTime(
                template.blocks?.map((b) => b.description + "\n" + b.code).join(" ")
              )}
            </span>
          </div>
          {/* Subtitle */}
          {template.subtitle && (
            <div className={`text-lg mb-6 text-center max-w-2xl ${textSecondary}`}>
              {template.subtitle}
            </div>
          )}
        </div>

        {/* Code Blocks */}
        <div className="space-y-10 mt-8 px-2 md:px-0">
          {filteredBlocks.length === 0 ? (
            <div className={`text-center ${textSecondary}`}>No blocks found.</div>
          ) : (
            filteredBlocks.map((block, idx) => (
              <div
                key={block.id || idx}
                className={`rounded-xl border ${borderCard} ${bgCard} p-6 shadow-sm`}
              >
                {block.description && (
                  <div className={`mb-4 text-md md:text-lg font-semibold break-words ${blockDesc}`}>
                    {block.description}
                  </div>
                )}
                {block.code && (
                  <div className="relative group">
                    <pre
                      className={`${preBg} ${preText} p-4 rounded-lg text-sm md:text-base overflow-x-auto`}
                      style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                    >
                      {block.code}
                    </pre>
                    <button
                      className="absolute top-3 right-3 opacity-80 group-hover:opacity-100 bg-gray-700 text-white p-2 rounded-lg hover:bg-indigo-600 transition"
                      onClick={() => handleCopy(block.code)}
                      aria-label="Copy code"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floated Footer */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-40">
        <div className="pointer-events-auto flex gap-4 bg-gray-900/90 text-gray-200 py-3 px-6 rounded-2xl shadow-lg backdrop-blur-lg items-center">
          {/* Footer: Like, Comment, Bookmark, Share, etc. For now, icons only (customize as needed) */}
          <button className="hover:bg-gray-800 rounded-full p-2" title="Like">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"></path></svg>
          </button>
          <button className="hover:bg-gray-800 rounded-full p-2" title="Comment">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path></svg>
          </button>
          <button className="hover:bg-gray-800 rounded-full p-2" title="Bookmark">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
          </button>
          <button className="hover:bg-gray-800 rounded-full p-2" title="Share">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateViewPage;