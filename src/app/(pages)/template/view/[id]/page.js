"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import {
  ArrowLeft, Search, Sun, Moon, Copy, UserCircle2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { useAuth } from "@/hooks/useAuth";
import useScrollDirection from "@/hooks/useScrollDirection";


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
  if (!text) return "1 min read";
  const wpm = 200;
  const words = text.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / wpm))} min read`;
}

const TemplateViewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const navHidden = useScrollDirection();

  const [template, setTemplate] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);
const [scrollProgress, setScrollProgress] = useState(0);
  // Fetch template by id + owner profile

  useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    setScrollProgress(scrolled);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        // If user is not logged in, send request without userID
        const viewerId = user?.id || "";
        const res = await fetch(`/api/template/${id}${viewerId ? `?userID=${viewerId}` : ""}`);
        if (res.status === 403) {
          setHasAccess(false);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        const { profile, template } = data.data;
        if (!template) {
          setTemplate(null);
          setHasAccess(false);
          return;
        }

        setTemplate({
          ...template,
          user: {
            username: profile?.username || "Unknown",
            avatar_url: profile?.pic || "",
          },
          blocks: template.template_code_blocks || [],
          isPublic: template.visibility === "public"
        });
        setFilteredBlocks(template.template_code_blocks || []);
        setHasAccess(template.visibility === "public" || (user && user.id));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load template", { transition: Bounce });
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
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
  const styles = {
    bgBase: isDark ? "bg-[#0B0B13]" : "bg-[#F6F6F8]",
    textMain: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-400" : "text-gray-700",
    borderCard: isDark ? "border-gray-700" : "border-gray-200",
    bgCard: isDark ? "bg-[#181825]" : "bg-white",
    bgNavbar: isDark ? "bg-[#13131C]" : "bg-white",
    bgSearch: isDark ? "bg-[#22223C]" : "bg-gray-100",
    inputText: isDark ? "text-white" : "text-gray-900",
    borderIndigo: isDark ? "border-indigo-500" : "border-indigo-600",
    blockDesc: isDark ? "text-indigo-300" : "text-indigo-700",
    preBg: isDark ? "bg-[#14141c]" : "bg-gray-900",
    preText: "text-cyan-200",
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${styles.bgBase}`}>
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${styles.bgBase}`}>
        <span className="text-4xl mb-4">🔒</span>
        <h2 className={`text-2xl font-bold ${styles.textSecondary} mb-2`}>You don't have access</h2>
        <p className={`${styles.textSecondary}`}>This template is private or does not exist.</p>
      </div>
    );
  }
  if (!template) return null;

  // --- Layout: Custom Navbar & Floated Footer ---
  return (
    <div className={`min-h-[1000px] pb-20 pt-20 flex flex-col ${styles.bgBase}`}>
      {/* Custom Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 flex items-center px-4 py-3
    ${styles.bgNavbar} border-b border-gray-200/40 dark:border-gray-700/40
    backdrop-blur-md z-30 transition-transform duration-300`}
        style={{ transform: navHidden ? "translateY(-100%)" : "translateY(0)" }}
      >
{/* Scroll Progress Bar */}
<div
  className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 transition-all"
  style={{ width: `${scrollProgress}%` }}
></div>


        {/* Back Arrow */}
        <button
          onClick={() => router.back()}
          className="mr-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className={isDark ? "text-white" : "text-gray-800"} size={24} />
        </button>
        {/* Blog Title */}
        <div className="flex-1 flex items-center overflow-hidden">
          <h1 className={`font-bold text-lg md:text-xl truncate ${styles.textMain}`}>
            {template.title}
          </h1>
        </div>
        {/* Search Bar (hidden on xs) */}
        <div className={`hidden sm:flex items-center ${styles.bgSearch} rounded-full px-2 py-1 ml-2 mr-3 border ${styles.borderCard}`}>
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`bg-transparent outline-none ${styles.inputText} px-2 py-1 w-28 md:w-40`}
          />
        </div>
        {/* Dark mode button */}
        <button
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => dispatch(toggleDarkMode())}
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="text-yellow-400" size={20} />
          ) : (
            <Moon className="text-gray-800" size={20} />
          )}
        </button>
        {/* User pic, links to /profile */}
        <Link href="/profile" className="ml-2 block">
          {user?.pic || template.user?.avatar_url ? (
            <img
              src={user?.pic || template.user?.avatar_url}
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
              alt={user?.username || template.user?.username || "Profile"}
            />
          ) : (
            <UserCircle2 className="w-9 h-9 text-gray-400" />
          )}
        </Link>
      </nav>

      {/* Mobile search bar */}
      <div className="sm:hidden px-3 py-2">
        <div className={`flex items-center ${styles.bgSearch} rounded-full px-2 py-1 border ${styles.borderCard}`}>
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search blocks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`bg-transparent outline-none ${styles.inputText} px-2 py-1 w-full`}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1   max-w-3xl mx-auto w-full ">
        {/* Banner */}
        {template.cover_image && (
          <div className="group w-full bg-gray-200 dark:bg-gray-900 overflow-hidden rounded-b-lg mb-2 mt-6">
            <img
              src={template.cover_image}
              alt="Banner"
              className="w-full h-auto object-cover md:rounded-xl transition-transform duration-300 group-hover:scale-105"
              style={{ aspectRatio: '16/6' }} // gives nice wide banner
            />
          </div>
        )}


        {/* Title and Meta */}
        <div className="flex flex-col items-center mt-6">
          <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-3 ${styles.textMain}`}>
            {template.title}
          </h2>
          <div className="flex items-center gap-3 mb-3 flex-wrap justify-center">
            {/* Author pic and name */}
            <Link href="/profile">
              {template.user?.avatar_url ? (
                <img src={template.user.avatar_url} className={`w-12 h-12 rounded-full object-cover ${styles.borderIndigo}`} alt={template.user.username} />
              ) : (
                <UserCircle2 className="w-12 h-12 text-indigo-600" />
              )}
            </Link>
            <span className={`font-semibold text-lg ${styles.textMain}`}>{template.user?.username || "Unknown Author"}</span>
            {/* Date */}
            <span className={`${styles.textSecondary} text-sm`}>
              {template.created_at
                ? formatDistanceToNow(new Date(template.created_at), { addSuffix: true })
                : ""}
            </span>
            {/* Reading time */}
            <span className={`${styles.textSecondary} text-sm`}>
              {readingTime(
                template.blocks?.map((b) => b.description + "\n" + b.code).join(" ")
              )}
            </span>
          </div>
          {/* Subtitle */}
          {template.subtitle && (
            <div className={`text-lg mb-6 text-center max-w-2xl ${styles.textSecondary}`}>
              {template.subtitle}
            </div>
          )}
        </div>

        {/* Code Blocks */}
        <div className="space-y-10 mt-8 px-2 md:px-0">
        {filteredBlocks.map((block, idx) => (
  <div
    key={block.id || idx}
    className={`rounded-xl border ${styles.borderCard} ${styles.bgCard} p-6 shadow-sm`}
  >
    {/* Description, if present */}
    {block.description && (
      <div className={`mb-4 text-md md:text-lg font-semibold break-words ${styles.blockDesc}`}>
        {block.description}
      </div>
    )}

    {/* Language and AI badges */}
    <div className="flex gap-2 mb-2 flex-wrap">
      {block.language && (
        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 px-2 py-1 rounded text-xs font-semibold">
          {block.language}
        </span>
      )}
      {block.is_generated ? (
        <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-1 rounded text-xs font-semibold">
          AI Generated
        </span>
      ) : null}
    </div>

    {/* Original Code */}
    {block.code && (
      <div className="relative group mb-4">
        <label className="block mb-1 text-xs font-bold text-gray-400 dark:text-gray-500">Original Code:</label>
        <pre
          className={`${styles.preBg} ${styles.preText} p-4 rounded-lg text-sm md:text-base overflow-x-auto`}
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {block.code}
        </pre>
        <button
          className="absolute top-3 right-3 opacity-80 group-hover:opacity-100 bg-gray-700 dark:bg-gray-900 text-white p-2 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-700 transition"
          onClick={() => handleCopy(block.code)}
          aria-label="Copy code"
        >
          <Copy size={16} />
        </button>
      </div>
    )}

    {/* Corrected Code */}
    {block.corrected_code && (
      <div className="relative group">
        <label className="block mb-1 text-xs font-bold text-green-400 dark:text-green-300">Corrected Code:</label>
        <pre
          className={`${styles.preBg} ${styles.preText} p-4 rounded-lg text-sm md:text-base overflow-x-auto border border-green-500 dark:border-green-700`}
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {block.corrected_code}
        </pre>
        <button
          className="absolute top-3 right-3 opacity-80 group-hover:opacity-100 bg-gray-700 dark:bg-gray-900 text-white p-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition"
          onClick={() => handleCopy(block.corrected_code)}
          aria-label="Copy corrected code"
        >
          <Copy size={16} />
        </button>
      </div>
    )}
  </div>
))}
        </div>
      </div>

      {/* Floated Footer */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none z-40">
        <div
          className={`pointer-events-auto flex gap-4 ${styles.bgBase} ${styles.textMain} py-3 px-6 rounded-2xl shadow-lg backdrop-blur-lg items-center`}
        >
          {[
            {
              title: "Like",
              path: "M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z",
            },
            {
              title: "Comment",
              path: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
            },
            {
              title: "Bookmark",
              path: "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z",
            },
            {
              title: "Share",
              path: "M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
              extra: (
                <>
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                </>
              ),
            },
          ].map((btn, i) => (
            <button
              key={i}
              className={`rounded-full p-2 transition-colors duration-200 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"
                }`}
              title={btn.title}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
                stroke="currentColor"
                strokeWidth="2"
              >
                {btn.extra}
                <path d={btn.path}></path>
              </svg>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TemplateViewPage;