"use client";

import React, { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";

const DEFAULT_AVATAR = "/default-avatar.png";
const DEFAULT_USERNAME = "Preview User";

export default function TemplatePreview({
  title,
  subtitle,
  visibility,
  image,
  codeBlocks = [],
  className = "",
  username,
  avatarUrl,
  onBack,
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (code, idx) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 sec
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div
      className={`border rounded-xl shadow-md max-w-3xl mx-auto pt-20 pb-8 bg-white dark:bg-gray-950 ${className}`}
    >
      {/* Back button */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <ArrowLeft size={22} />
          <span className="font-semibold text-base">Back</span>
        </button>
      </div>

      {/* Banner */}
      {image && (
        <div className="w-full h-56 md:h-64 rounded-t-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <img
            src={image}
            alt="Banner"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}

      <div className="px-6 py-6">
        {/* Profile + Title */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <img
            src={avatarUrl || DEFAULT_AVATAR}
            alt={username || DEFAULT_USERNAME}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400 dark:border-indigo-700"
          />
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">
            {username || DEFAULT_USERNAME}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 break-words">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-md md:text-lg text-gray-500 dark:text-gray-300 mb-6 break-words text-center">
            {subtitle}
          </p>
        )}

        {/* Code Blocks */}
        <div className="space-y-8">
          {codeBlocks.map((block, idx) => (
            <div
              key={block.id || idx}
              className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4"
            >
              {/* Description */}
              {block.description && (
                <div className="mb-3 text-base md:text-lg font-semibold text-indigo-700 dark:text-indigo-300 break-words">
                  {block.description}
                </div>
              )}

              {/* Code */}
              {block.code && (
                <div className="relative">
                  <pre
                    className="bg-gray-900 dark:bg-black/80 text-cyan-200 dark:text-cyan-300 p-4 rounded-md text-sm md:text-base overflow-x-auto whitespace-pre-wrap break-words"
                  >
                    {block.code}
                  </pre>
                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(block.code, idx)}
                    className="absolute top-2 right-2 flex items-center gap-1 bg-indigo-600 dark:bg-indigo-700 text-white text-xs px-2 py-1 rounded hover:bg-indigo-500 transition"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={14} color="green" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14}  class="purple" /> Copy
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Fallback */}
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
