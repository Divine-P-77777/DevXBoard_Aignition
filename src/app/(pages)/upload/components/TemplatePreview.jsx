import React from "react";

/**
 * TemplatePreview
 * Props:
 * - title: string
 * - subtitle: string
 * - visibility: "public" | "private"
 * - image: url string
 * - codeBlocks: array [{ id, description, code }]
 */
export default function TemplatePreview({
  title,
  subtitle,
  visibility,
  image,
  codeBlocks = [],
  className = "",
}) {
  return (
    <div
      className={`border rounded-xl shadow-md max-w-3xl mx-auto p-0 bg-white dark:bg-gray-900 ${className}`}
    >
      {/* Banner */}
      {image && (
        <div className="w-full h-48 md:h-64 rounded-t-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <img
            src={image}
            alt="Banner"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6 pb-2">
        {/* Visibility and Title */}
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              visibility === "public"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
            title={visibility === "public" ? "Public" : "Private"}
          >
            {visibility === "public" ? "🌍 Public" : "🔒 Private"}
          </span>
          <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white break-all">
            {title}
          </span>
        </div>
        {/* Subtitle */}
        {subtitle && (
          <div className="text-md md:text-lg text-gray-500 dark:text-gray-300 mb-6 break-all">
            {subtitle}
          </div>
        )}

        {/* Code Blocks */}
        <div className="space-y-8">
          {codeBlocks.map((block, idx) => (
            <div key={block.id || idx} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
              {block.description && (
                <div className="mb-4 text-base md:text-lg font-semibold text-indigo-700 dark:text-indigo-300 break-words">
                  {block.description}
                </div>
              )}
              {block.code && (
                <pre
                  className="bg-gray-900 dark:bg-black/80 text-cyan-200 dark:text-cyan-300 p-4 rounded-md text-sm md:text-base overflow-x-auto"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {block.code}
                </pre>
              )}
              {!block.code && !block.description && (
                <div className="text-gray-400 text-sm italic">No code or description.</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}