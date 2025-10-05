"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Search, Box, Edit, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast, Bounce } from "react-toastify";


export default function TemplateStore() {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await fetch("/api/template/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        const json = await res.json();
        if (res.ok && json.templates) {
          let data = json.templates;
          data.sort((a, b) =>
            sortOrder === "asc"
              ? new Date(a.created_at) - new Date(b.created_at)
              : new Date(b.created_at) - new Date(a.created_at)
          );
          setTemplates(data);
        } else {
          setTemplates([]);
        }
      } catch (err) {
        console.error("Fetch templates error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [sortOrder, user?.id]);

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(search.toLowerCase()) ||
      template.subtitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div
        className={clsx(
          "flex justify-center items-center min-h-screen gap-2",
          isDarkMode ? "text-purple-100 bg-gray-900" : "text-purple-800 bg-purple-50"
        )}
      >
        <Loader2 className="animate-spin" /> Loading templates...
      </div>
    );

  return (
    <div
      className={clsx(
        "mx-auto px-6 pt-30 min-h-[1000px] space-y-6",
        isDarkMode ? "bg-gray-900 text-purple-100" : "bg-purple-50 text-purple-800"
      )}
    >
      <h1
        className={clsx(
          "text-3xl font-bold text-center",
          isDarkMode ? "text-purple-100" : "text-purple-800"
        )}
      >
        My Private Templates
      </h1>
      <p className="text-center text-sm text-gray-400 mb-6">
        Privacy in your hands
      </p>

      {/* Search + Sort */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div
          className={clsx(
            "flex items-center rounded-xl border px-3 py-2 w-full max-w-sm focus-within:ring-2 transition-all duration-300",
            isDarkMode
              ? "border-gray-700 bg-gray-800 focus-within:ring-purple-500 text-purple-100"
              : "border-gray-300 bg-white focus-within:ring-pink-400 text-purple-800"
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none placeholder-gray-400"
          />
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={clsx(
            "border rounded px-4 py-2 transition-all duration-300",
            isDarkMode
              ? "border-gray-700 bg-black text-purple-100"
              : "border-gray-300 bg-purple-50 text-purple-800"
          )}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={clsx(
              "rounded-xl border shadow-md p-5 hover:shadow-2xl hover:scale-105 transition-all duration-300",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}
          >
            <img
              src={template.cover_image || "/placeholder.png"}
              alt={template.title}
              className="w-full h-44 object-cover rounded-md mb-4 border-2 border-purple-400"
            />
            <h2
              className={clsx(
                "text-xl font-semibold mb-1",
                isDarkMode ? "text-purple-100" : "text-purple-800"
              )}
            >
              {template.title}
            </h2>
            <p className={clsx("text-sm mb-3", isDarkMode ? "text-gray-400" : "text-gray-600")}>
              {template.subtitle}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Box size={14} /> {template.template_code_blocks?.length || 0} Blocks
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => router.push(`/template/view/${template.id}`)}
                className="flex-1 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 text-white py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
              >
                View
              </button>
              <button
                onClick={() => {router.push(`/upload`)
                  toast.success("Click on the pencil icon to edit!", { transition: Bounce, theme: isDarkMode ? "dark" : "light" });
                }}
                className={clsx(
                  "flex-1 border rounded-xl py-2 flex items-center justify-center gap-2 transition-all duration-300",
                  isDarkMode
                    ? "border-gray-600 text-purple-100 hover:bg-gray-700"
                    : "border-gray-300 text-purple-800 hover:bg-gray-100"
                )}
              >
                <Edit size={16} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
