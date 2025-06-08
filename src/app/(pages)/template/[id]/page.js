"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import supabase from "@/libs/supabase/client"
import Navbar from '@/components/Navbar'


export default function TemplateDetailPage() {
  const { id } = useParams()
  const [template, setTemplate] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTemplate = async () => {
      const { data } = await supabase
        .from("templates")
        .select("*, template_code_blocks(*)")
        .eq("id", id)
        .single()

      setTemplate(data || null)
    }
    if (id) fetchTemplate()
  }, [id])

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
  }

  if (!template) return <p className="p-6">Loading...</p>

  return (
    <>
            <Navbar />
    <div className="max-w-4xl pt-20 mx-auto px-6 py-10 space-y-6">
      <button onClick={() => router.back()} className="text-blue-500 hover:underline">
        ← Back
      </button>
      <h2 className="text-3xl font-bold">{template.title}</h2>
      <p className="text-gray-600">{template.subtitle}</p>

      {template.template_code_blocks.map((block, i) => (
        <div key={i} className="bg-gray-900 text-green-300 p-4 rounded-xl relative">
          <p className="text-white font-semibold mb-2">{block.description}</p>
          <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
            {block.corrected_code || block.code}
          </pre>
          <button
            className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
            onClick={() => copyCode(block.corrected_code || block.code)}
          >
            Copy
          </button>
        </div>
      ))}
    </div>
    </>
  )
}
