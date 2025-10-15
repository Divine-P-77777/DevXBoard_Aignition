"use client";

import { Eye, Pencil, Clock, Box, Users, Lock } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Image from "next/image";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

export default function TemplateGrid({
  templates,
  isDarkMode,
  activeSection,
  onEdit,
}) {
  const router = useRouter();

  return (
    <div
      className={clsx(
        "grid gap-6 px-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        isDarkMode ? "text-gray-100" : "text-gray-800"
      )}
    >
      {templates.map((template) => (
        <div
          key={template.id}
          className={clsx(
            "rounded-2xl overflow-hidden border shadow-sm flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
            isDarkMode
              ? "bg-gray-900 border-gray-800 hover:border-purple-500"
              : "bg-white border-gray-200 hover:border-purple-400"
          )}
          onClick={() => router.push(`/template/view/${template.id}`)}
        >
          {/* Cover */}
          <div className="relative w-full h-44 group">
            <Image
              src={template.cover_image || "/placeholder.png"}
              alt={template.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {activeSection === "sharedWithMe" && template.owner_profile && (
              <div className="absolute bottom-2 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <Image
                  src={template.owner_profile.pic || "/avatar.png"}
                  alt={template.owner_profile.username}
                  width={20}
                  height={20}
                  className="rounded-full border border-purple-400"
                />
                <span className="text-xs text-white">
                  @{template.owner_profile.username}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-1 truncate">
              {template.title}
            </h2>
            <p
              className={clsx(
                "text-sm mb-3 line-clamp-2",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}
            >
              {template.subtitle || "No description"}
            </p>

            {/* Info row */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <Box size={14} />
                <span>{template.template_code_blocks?.length || 0} blocks</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{timeAgo(template.created_at)}</span>
              </div>
            </div>

            {/* Section label */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              {activeSection === "myTemplates" && (
                <span
                  className={clsx(
                    "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                    isDarkMode
                      ? "bg-gray-800 text-green-300"
                      : "bg-green-100 text-green-700"
                  )}
                >
                  <Lock size={12} /> Private
                </span>
              )}

              {activeSection === "sharedByMe" && (
                <span
                  className={clsx(
                    "px-2 py-1 rounded-md text-xs font-medium",
                    isDarkMode
                      ? "bg-gray-800 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  Shared privately by you
                </span>
              )}

              {activeSection === "sharedWithMe" &&
                template.owner_profile && (
                  <span
                    className={clsx(
                      "px-2 py-1 rounded-md text-xs font-medium italic",
                      isDarkMode
                        ? "bg-gray-800 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                    )}
                  >
                    Shared with you
                  </span>
                )}
            </div>

            {/* Shared user list */}
            {activeSection === "sharedByMe" &&
              template.sharedUsernames?.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <Users size={14} className="text-purple-400" />
                  <span className="text-xs text-gray-400">
                    Shared with{" "}
                    {template.sharedUsernames
                      .slice(0, 3)
                      .map((u) => `@${u}`)
                      .join(", ")}
                    {template.sharedUsernames.length > 3 &&
                      ` +${template.sharedUsernames.length - 3}`}
                  </span>
                </div>
              )}

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-auto">
              {(activeSection === "myTemplates" ||
                activeSection === "sharedByMe") && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(template);
                  }}
                  title="Edit Template"
                  className={clsx(
                    "p-2 rounded-lg transition-colors hover:bg-purple-100 dark:hover:bg-gray-700",
                    isDarkMode ? "text-purple-100" : "text-purple-800"
                  )}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/template/view/${template.id}`);
                }}
                title="View Template"
                className={clsx(
                  "p-2 rounded-lg transition-colors hover:bg-purple-100 dark:hover:bg-gray-700",
                  isDarkMode ? "text-purple-100" : "text-purple-800"
                )}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
  