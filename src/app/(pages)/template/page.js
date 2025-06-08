"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/libs/supabase/client"

export default function TemplateStore() {
  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")
  const router = useRouter()

  useEffect(() => {
    const fetchTemplates = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      const { data } = await supabase
        .from("templates")
        .select("*, template_code_blocks(*)")
        .eq("user_id", user.id)
        .eq("visibility", "private")
        .order("created_at", { ascending: sortOrder === "asc" })

      setTemplates(data || [])
    }
    fetchTemplates()
  }, [sortOrder])

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
  }

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(search.toLowerCase()) ||
    template.subtitle?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">My Private Templates</h1>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full max-w-sm"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border p-5 shadow-md hover:shadow-xl cursor-pointer transition"
            onClick={() => router.push(`/template/${template.id}`)}
          >
            <img
              src={template.cover_image || "/placeholder.png"}
              className="w-full h-40 object-cover rounded-md mb-4"
              alt="Cover"
            />
            <h2 className="text-xl font-semibold">{template.title}</h2>
            <p className="text-sm text-gray-500">{template.subtitle}</p>
            <p className="text-xs text-gray-400 mt-1">Blocks: {template.template_code_blocks?.length}</p>
          </div>
        ))}
      </div>
    </div>
  )
}