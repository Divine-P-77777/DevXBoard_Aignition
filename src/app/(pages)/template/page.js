"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import clsx from "clsx"
import { Search, Box, Edit, Loader2 } from "lucide-react"

export default function TemplateStore() {
  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/template/me", { credentials: "include" })
        const json = await res.json()
        if (res.ok && json.success) {
          let data = json.data
          data.sort((a, b) =>
            sortOrder === "asc"
              ? new Date(a.created_at) - new Date(b.created_at)
              : new Date(b.created_at) - new Date(a.created_at)
          )
          setTemplates(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [sortOrder])

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(search.toLowerCase()) ||
    template.subtitle?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading)
    return (
      <div className={clsx("flex justify-center items-center min-h-screen gap-2", isDarkMode ? "text-white" : "text-gray-800")}>
        <Loader2 className="animate-spin" /> Loading templates...
      </div>
    )

  return (
    <div className={clsx(" mx-auto px-6 pt-30 min-h-[1000px] space-y-6", isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900")}>
      <h1 className="text-3xl font-bold text-center">My Private Templates</h1>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Privacy in your hands</p>

      {/* Search + Sort */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div className={clsx("flex items-center rounded-lg border px-3 py-2 w-full max-w-sm focus-within:ring-2", 
          isDarkMode ? "border-gray-700 bg-gray-800 focus-within:ring-purple-500" : "border-gray-300 bg-white focus-within:ring-blue-500"
        )}>
          <Search className={clsx("mr-2", isDarkMode ? "text-gray-400" : "text-gray-500")} />
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
          className={clsx("border rounded px-4 py-2", isDarkMode ? "border-gray-700 bg-gray-800 text-gray-200" : "border-gray-300 bg-white text-gray-900")}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className={clsx(
            "rounded-xl border shadow-md p-5 hover:shadow-xl hover:scale-105 transition-all duration-300",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <img
              src={template.cover_image || "/placeholder.png"}
              alt={template.title}
              className="w-full h-44 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-1">{template.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{template.subtitle}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <Box size={14} /> {template.template_code_blocks?.length || 0} Blocks
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => router.push(`/template/${template.id}`)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-2 rounded transition-transform hover:scale-105 flex items-center justify-center gap-2"
              >
                View
              </button>
              <button
                onClick={() => router.push(`/template/edit/${template.id}`)}
                className={clsx(
                  "flex-1 border rounded py-2 flex items-center justify-center gap-2",
                  isDarkMode ? "border-gray-600 text-gray-200 hover:bg-gray-700" : "border-gray-300 text-gray-900 hover:bg-gray-100"
                )}
              >
                <Edit size={16} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
