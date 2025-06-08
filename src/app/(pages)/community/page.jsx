"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import supabase from "@/libs/supabase/client"
import Navbar from "@/components/Navbar";


export default function CommunityPage() {
  const [templates, setTemplates] = useState([])
  const [profilesMap, setProfilesMap] = useState({})
  const [sortOrder, setSortOrder] = useState("desc")
  const router = useRouter()

  useEffect(() => {
    const fetchTemplatesAndProfiles = async () => {
      // Fetch public templates
      const { data: templatesData, error: templatesError } = await supabase
        .from("templates")
        .select("*, template_code_blocks(*)")
        .eq("visibility", "public")
        .order("created_at", { ascending: sortOrder === "asc" })

      if (templatesError) {
        console.error("Template fetch error:", templatesError)
        return
      }

      setTemplates(templatesData || [])

      // Extract unique user_ids from templates
      const userIds = [...new Set(templatesData.map(t => t.user_id))]

      // Fetch related profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds)

      if (profilesError) {
        console.error("Profiles fetch error:", profilesError)
        return
      }

      // Create a lookup map for profiles
      const profilesMap = {}
      profilesData.forEach(profile => {
        profilesMap[profile.id] = profile
      })

      setProfilesMap(profilesMap)
    }

    fetchTemplatesAndProfiles()
  }, [sortOrder])

  const handleShare = (id) => {
    const url = `${window.location.origin}/community/${id}`
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
  }

  return (
    <>
        <Navbar />
    <div className="max-w-6xl pt-20 mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Community Templates</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const profile = profilesMap[template.user_id]

          return (
            <div
              key={template.id}
              className="bg-white rounded-xl border p-5 shadow-md hover:shadow-xl transition relative cursor-pointer"
              onClick={() => router.push(`/community/${template.id}`)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src={profile?.avatar_url || "/user-placeholder.png"}
                    alt="Author Avatar"
                    fill
                    className="rounded-full object-cover"
                    sizes="32px"
                  />
                </div>
                <span className="text-sm font-semibold">
                  {profile?.username || "Anonymous"}
                </span>
              </div>

              <div className="relative w-full h-40 mb-4">
                <Image
                  src={template?.cover_image || "/placeholder.png"}
                  alt="Template Cover"
                  fill
                  className="rounded-md object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>

              <h2 className="text-xl font-semibold">{template.title}</h2>
              <p className="text-sm text-gray-500">{template.subtitle}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare(template.id)
                }}
                className="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Share
              </button>
            </div>
          )
        })}
      </div>
    </div>
   </>
  )
}
