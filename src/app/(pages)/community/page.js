"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import clsx from "clsx";
import {
  Search,
  User,
  Loader2,
  Heart,
  MessageCircle,
  Bookmark,
  X,
  Eye
} from "lucide-react";
import Link from "next/link";

export default function CommunityTemplates() {
  const [templates, setTemplates] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [view, setView] = useState("all"); // "all" | "liked" | "saved"
  const router = useRouter();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // 🔹 Fetch Templates
  const fetchTemplates = useCallback(
    async (reset = false, filter = view) => {
      if (loadingMore || (!hasMore && !reset)) return;
      reset ? setLoading(true) : setLoadingMore(true);

      try {
        const res = await fetch(
          `/api/template/community?limit=10&offset=${reset ? 0 : page * 10
          }&filter=${filter}`
        );
        const json = await res.json();

        if (res.ok && json.templates) {
          if (reset) {
            setTemplates(json.templates);
            setPage(1);
          } else {
            setTemplates((prev) => [...prev, ...json.templates]);
            setPage((prev) => prev + 1);
          }
          setHasMore(json.templates.length === 10);
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        reset ? setLoading(false) : setLoadingMore(false);
      }
    },
    [page, loadingMore, hasMore, view]
  );

  useEffect(() => {
    fetchTemplates(true, view);
  }, [fetchTemplates, view]);

  // 🔹 Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        fetchTemplates(false, view);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchTemplates, view]);



  // 🔹 Toggle Like
  const handleLike = async (templateId) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? {
            ...t,
            like_count: (t.like_count || 0) + (t.liked ? -1 : 1),
            liked: !t.liked,
          }
          : t
      )
    );

    await fetch("/api/template/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: t.id, action: "like" }),
    });
  };

  // 🔹 Toggle Save
  const handleSave = async (templateId) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId ? { ...t, saved: !t.saved } : t
      )
    );

    await fetch("/api/template/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: t.id }),
    });
  };

  // 🔹 Post Comment
  const handleComment = async (e, templateId, text) => {
    e.preventDefault();
    if (!text.trim()) return;

    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? {
            ...t,
            comments: [
              ...(t.comments || []),
              { comment: text, user: "You" },
            ],
            comment_count: (t.comment_count || 0) + 1,
          }
          : t
      )
    );

    await fetch("/api/template/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: t.id, comment: newComment }),
    });
  };

  return (
    <div
      className={clsx(
        "flex min-h-screen pt-20 transition-colors duration-300",
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
      )}
    >
      {/* Sidebar */}
      <aside
        className={clsx(
          "w-64 px-6 py-8 border-r hidden md:block sticky top-20 h-screen transition-colors duration-300",
          isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-300 bg-white"
        )}
      >
        <h2 className="text-xl font-bold mb-6">Community Dashboard</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setView("liked")}
            className={clsx(
              "block w-full text-left px-3 py-2 rounded transition",
              view === "liked"
                ? "bg-purple-500 text-white"
                : isDarkMode
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-200"
            )}
          >
            Liked Blogs
          </button>
          <button
            onClick={() => setView("saved")}
            className={clsx(
              "block w-full text-left px-3 py-2 rounded transition",
              view === "saved"
                ? "bg-pink-500 text-white"
                : isDarkMode
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-200"
            )}
          >
            Saved Templates
          </button>
          <button
            onClick={() => setView("all")}
            className={clsx(
              "block w-full text-left px-3 py-2 rounded transition",
              view === "all"
                ? "bg-blue-500 text-white"
                : isDarkMode
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-200"
            )}
          >
            All Templates
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-8 space-y-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {view === "liked"
            ? "Liked Blogs"
            : view === "saved"
              ? "Saved Templates"
              : "Community Templates"}
        </h1>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 max-w-md mx-auto mb-8"
        >
          <div
            className={clsx(
              "flex items-center w-full rounded-lg border px-3 py-2 focus-within:ring-2 transition-colors duration-300",
              isDarkMode
                ? "border-gray-700 focus-within:ring-purple-500 bg-gray-800 text-gray-200"
                : "border-gray-300 focus-within:ring-blue-500 bg-white text-gray-900"
            )}
          >
            <Search
              className={clsx(
                "mr-2",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded hover:scale-105 transition-transform"
          >
            Search
          </button>
        </form>

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center mt-20 text-lg">
            No templates found. Try a different search!
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTemplates.map((t) => (
              <div
                key={t.id}
                className={clsx(
                  "bg-white dark:bg-gray-900 rounded-xl border shadow-md p-5 hover:shadow-xl transition-all duration-300",
                  isDarkMode ? "border-gray-800" : "border-gray-200"
                )}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.profile?.pic || "/placeholder.png"}
                    alt={t.profile?.username || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">
                    {t.profile?.username || "Unknown"}
                  </span>
                </div>

                {/* Cover */}
                <img
                  src={t.cover_image || "/placeholder.png"}
                  alt={t.title}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />

                {/* Info */}
                <h2 className="text-xl font-semibold">{t.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {t.subtitle?.length > 100 ? (
                    <>
                      {t.subtitle.slice(0, 100)}...{" "}
                      <button className="text-blue-500 hover:underline">
                        View More
                      </button>
                    </>
                  ) : (
                    t.subtitle
                  )}
                </p>

                {/* Comments preview */}
                {t.comments?.slice(0, 2).map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <User size={16} />
                    <span className="text-sm">{c.comment}</span>
                  </div>
                ))}
                {t.comment_count > 2 && (
                  <button
                    onClick={() => setSelectedTemplate(t)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View all comments
                  </button>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 mt-4 text-gray-600 dark:text-gray-400">
                  <button
                    onClick={() => handleLike(t.id)}
                    className={clsx(
                      "flex items-center gap-1",
                      t.liked ? "text-red-500" : "hover:text-red-500"
                    )}
                  >
                    <Heart size={18} /> {t.like_count || 0}
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(t)}
                    className="flex items-center gap-1 hover:text-blue-500"
                  >
                    <MessageCircle size={18} /> {t.comment_count || 0}
                  </button>
                  <button
                    onClick={() => handleSave(t.id)}
                    className={clsx(
                      "flex items-center gap-1",
                      t.saved ? "text-yellow-500" : "hover:text-yellow-500"
                    )}
                  >
                    <Bookmark size={18} /> {t.saved ? "Saved" : "Save"}
                  </button>
                  <Link href={`/template/view/${t.id}`}>
                  <button
                    onClick={() => handleSave(t.id)}
                    className={clsx(
                      "flex items-center gap-1",
                      t.saved ? "text-yellow-500" : "hover:text-yellow-500"
                    )}
                  >
                    <Eye size={18} /> <span>Explore</span>
                  </button>
                  </Link>
                </div>
              </div>
            ))}

            {loadingMore && (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Comment Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className={clsx(
              "bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg relative transition-colors duration-300"
            )}
          >
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Comments on {selectedTemplate.title}
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedTemplate.comments?.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 border-b pb-2 dark:border-gray-700"
                >
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
                  "flex-1 rounded border px-3 py-2 bg-transparent outline-none transition-colors duration-300",
                  isDarkMode
                    ? "border-gray-700 text-gray-200"
                    : "border-gray-300 text-gray-900"
                )}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
