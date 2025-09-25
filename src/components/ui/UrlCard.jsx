import Link from "next/link";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getFaviconFromUrl } from "@/utils/getFaviconFromUrl";
import { ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";

const UrlCard = ({ card, onDelete }) => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const isValidUrl = typeof card?.url === "string" && card.url.trim() !== "";
  const [faviconError, setFaviconError] = useState(false);

  return (
    <div
      className={clsx(
        "flex flex-wrap sm:flex-nowrap items-center justify-between rounded-2xl p-4 shadow-xl backdrop-blur-md transition-all duration-300 border w-full gap-4 sm:gap-6",
        isDark
          ? "bg-black border-purple-800 text-pink-100"
          : "bg-[rgba(255,240,255,0.4)] border-pink-300 text-black"
      )}
    >
      {/* Left Content */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <img
          src={
            !faviconError && isValidUrl
              ? getFaviconFromUrl(card.url)
              : "/default-favicon.png"
          }
          onError={() => setFaviconError(true)}
          alt="Site Icon"
          className="w-10 h-10 rounded-full border border-pink-200 shadow object-cover"
        />
        <div className="flex flex-col max-w-full">
          <span className="font-semibold text-sm sm:text-base break-words">
            {card.title || "Untitled"}
          </span>
          <span className="text-xs sm:text-sm mt-1">
            {card.tags || "No Tags"}
          </span>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-4 ml-auto">
        {isValidUrl ? (
          <Link
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Visit"
            className={clsx(
              "hover:scale-110 transition text-black",
              isDark && "text-pink-300 hover:text-pink-200",
              !isDark && "hover:text-purple-900"
            )}
          >
            <ExternalLink size={20} />
          </Link>
        ) : (
          <span
            title="No valid URL"
            className={clsx(
              "text-gray-400 cursor-not-allowed",
              isDark ? "text-pink-300/50" : "text-black/40"
            )}
          >
            <ExternalLink size={20} />
          </span>
        )}

        <button
          onClick={() => onDelete(card.id)}
          title="Delete"
          className={clsx(
            "transition hover:scale-110",
            isDark
              ? "text-red-300 hover:text-red-200"
              : "text-black hover:text-pink-900 font-bold"
          )}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default UrlCard;
