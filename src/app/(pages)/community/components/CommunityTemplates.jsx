"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Loader2, Search } from "lucide-react";
import clsx from "clsx";
import Sidebar from "./Sidebar";
import TemplateCard from "./TemplateCard";
import CommentModal from "./CommentModal";
import { useAuth } from "@/hooks/useAuth";

export default function CommunityTemplates() {
  const [templates, setTemplates] = useState([]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [likedTemplates, setLikedTemplates] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [view, setView] = useState("all");
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();
  const user_id = user?.id;

  // --- Fetch all templates
  const fetchTemplates = useCallback(
    async (reset = false, filter = view) => {
      if (loadingMore || (!hasMore && !reset)) return;
      reset ? setLoading(true) : setLoadingMore(true);

      try {
        const res = await fetch(
          `/api/template/community?limit=10&offset=${reset ? 0 : page * 10}&filter=${filter}`
        );
        const json = await res.json();
        if (!res.ok) throw new Error("Template fetch failed");

        let templatesFetched = json.templates || [];

        if (user_id) {
          // Fetch both saved and liked status in parallel
          const [savedRes, likedRes] = await Promise.all([
            fetch(`/api/template/save?user_id=${user_id}`),
            fetch(`/api/template/like?user_id=${user_id}`),
          ]);

          const [savedJson, likedJson] = await Promise.all([
            savedRes.json(),
            likedRes.json(),
          ]);

          const savedIds = new Set(savedJson.saved_templates?.map((s) => s.template_id));
          const likedIds = new Set(likedJson.liked_templates?.map((l) => l.template_id));

          templatesFetched = templatesFetched.map((t) => ({
            ...t,
            saved: savedIds.has(t.id),
            liked: likedIds.has(t.id),
          }));
        }

        if (reset) {
          setTemplates(templatesFetched);
          setPage(1);
        } else {
          setTemplates((prev) => [...prev, ...templatesFetched]);
          setPage((prev) => prev + 1);
        }

        setHasMore(templatesFetched.length === 10);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        reset ? setLoading(false) : setLoadingMore(false);
      }
    },
    [page, loadingMore, hasMore, view, user_id]
  );

  // --- Fetch saved templates
  const fetchSavedTemplates = useCallback(async () => {
    if (!user_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/template/save?user_id=${user_id}`);
      const json = await res.json();
      if (res.ok && json.saved_templates) {
        setSavedTemplates(
          json.saved_templates.map((t) => ({
            ...t.templates,
            saved: true,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching saved templates:", err);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  // --- Fetch liked templates
  const fetchLikedTemplates = useCallback(async () => {
    if (!user_id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/template/like?user_id=${user_id}`);
      const json = await res.json();
      if (res.ok && json.liked_templates) {
        setLikedTemplates(
          json.liked_templates.map((t) => ({
            ...t.templates,
            liked: true,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching liked templates:", err);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  // --- Handle view switching
  useEffect(() => {
    if (view === "saved") fetchSavedTemplates();
    else if (view === "liked") fetchLikedTemplates();
    else fetchTemplates(true, view);
  }, [view, fetchTemplates, fetchSavedTemplates, fetchLikedTemplates]);

  // --- Handle like toggle
  const handleLike = async (templateId) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? { ...t, like_count: (t.like_count || 0) + (t.liked ? -1 : 1), liked: !t.liked }
          : t
      )
    );

    setLikedTemplates((prev) => {
      const exists = prev.find((t) => t.id === templateId);
      if (exists) {
        return prev.filter((t) => t.id !== templateId);
      } else {
        const likedTemplate = templates.find((t) => t.id === templateId);
        return likedTemplate ? [...prev, { ...likedTemplate, liked: true }] : prev;
      }
    });

    await fetch("/api/template/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: templateId, user_id }),
    });
  };

  // --- Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // --- Filter templates by view & search
  const baseTemplates =
    view === "saved" ? savedTemplates : view === "liked" ? likedTemplates : templates;

  const filteredTemplates = baseTemplates.filter(
    (t) =>
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Save/Unsave handler
  const handleSave = async (templateId) => {
    // Optimistic UI
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId ? { ...t, saved: !t.saved } : t
      )
    );

    try {
      const res = await fetch("/api/template/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: templateId, user_id }),
      });
      const data = await res.json();

      // Update based on backend response
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId ? { ...t, saved: data.saved } : t
        )
      );

      // Update saved templates list if in "saved" view
      if (view === "saved") fetchSavedTemplates();
    } catch (err) {
      console.error("Save toggle failed:", err);
    }
  };

  const handleComment = async (e, templateId, text) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId
          ? {
              ...t,
              comments: [...(t.comments || []), { comment: text, user: "You" }],
              comment_count: (t.comment_count || 0) + 1,
            }
          : t
      )
    );
    await fetch("/api/template/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: templateId, user_id, comment: text }),
    });
  };

  return (
    <div
      className={clsx(
        "flex min-h-screen transition-colors duration-300 ",
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-900"
      )}
    >
      <Sidebar view={view} setView={setView} isDarkMode={isDarkMode} />

      <main className="flex-1 px-4 md:px-8 py-8 space-y-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gradient bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">
          {view === "liked"
            ? "Liked Blogs"
            : view === "saved"
            ? "Saved Templates"
            : "Community Templates"}
        </h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <div
            className={clsx(
              "flex items-center w-full rounded-xl border px-3 py-2 transition-colors duration-300 shadow-sm",
              isDarkMode
                ? "border-gray-700 focus-within:ring-2 focus-within:ring-purple-500 bg-gray-800 text-gray-200"
                : "border-gray-300 focus-within:ring-2 focus-within:ring-pink-400 bg-white text-gray-900"
            )}
          >
            <Search
              className={clsx("mr-2", isDarkMode ? "text-gray-400" : "text-gray-500")}
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
            className="bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Search
          </button>
        </form>

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-500" size={32} />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center mt-20 text-lg text-gray-500">
            No templates found. Try a different search!
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTemplates.map((t) => (
              <TemplateCard
                key={t.id}
                t={t}
           
                isDarkMode={isDarkMode}
                handleLike={handleLike}
                handleSave={handleSave}
                setSelectedTemplate={setSelectedTemplate}
              />
            ))}
            {loadingMore && (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-purple-500" />
              </div>
            )}
          </div>
        )}
      </main>

      <CommentModal
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        isDarkMode={isDarkMode}
        handleComment={handleComment}
      />
    </div>
  );
}
