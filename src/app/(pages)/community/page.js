"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Search, Box, User, Loader2 } from "lucide-react";

export default function CommunityTemplates() {
  const [templates, setTemplates] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/template/community");
        const json = await res.json();
        if (res.ok && json.success) setTemplates(json.data);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.profiles.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  if (loading)
    return (
      <div
        className={clsx(
          "flex justify-center items-center min-h-screen text-lg gap-2",
          isDarkMode ? "text-white" : "text-gray-800"
        )}
      >
        <Loader2 className="animate-spin" /> Loading templates...
      </div>
    );

  return (
    <div
      className={clsx(
        "mx-auto px-6 pt-30 min-h-[1000px]  space-y-8",
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
      )}
    >
      <h1 className="text-4xl font-bold mb-4 text-center">Community Templates</h1>

      <form
        onSubmit={handleSearch}
        className="flex gap-2 max-w-md mx-auto mb-8"
      >
        <div
          className={clsx(
            "flex items-center w-full rounded-lg border px-3 py-2 focus-within:ring-2",
            isDarkMode
              ? "border-gray-700 focus-within:ring-purple-500 bg-gray-800 text-gray-200"
              : "border-gray-300 focus-within:ring-blue-500 bg-white text-gray-900"
          )}
        >
          <Search className={clsx("mr-2", isDarkMode ? "text-gray-400" : "text-gray-500")} />
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

      {filteredTemplates.length === 0 ? (
        <div className="text-center mt-20 text-lg">
          No templates found. Try a different search!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={clsx(
                "bg-white dark:bg-gray-800 rounded-xl border shadow-md p-5 hover:shadow-xl hover:scale-105 transition-all duration-300",
                isDarkMode ? "border-gray-700" : "border-gray-200"
              )}
            >
              <img
                src={template.cover_image || "/placeholder.png"}
                alt={template.title}
                className="w-full h-44 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold mb-1">{template.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{template.subtitle}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  {template.profiles.username}
                </div>
                <div className="flex items-center gap-1">
                  <Box size={14} />
                  {template.template_code_blocks?.length || 0} Blocks
                </div>
              </div>

              <button
                onClick={() => router.push(`/template/${template.id}`)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-2 rounded transition-transform hover:scale-105 flex items-center justify-center gap-2"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
