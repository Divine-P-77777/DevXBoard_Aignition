"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Heart, MessageCircle, Bookmark, User, Eye, Share2 } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentView from "./CommentView";



export default function TemplateCard({
  t,
  isDarkMode,
  handleLike,
  handleSave,
  setSelectedTemplate,
}) {
  const [isSaved, setIsSaved] = useState(t.saved);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => setIsSaved(t.saved), [t.saved]);

  // --- Optimistic save
  const onSaveClick = async () => {
    setIsSaved((prev) => !prev);
    await handleSave(t.id);
    toast.success(isSaved ? "Removed from saved" : "Template saved", {
      transition: Bounce,
      autoClose: 1200,
    });
  };

  // --- Like handler
  const onLikeClick = async () => {
    await handleLike(t.id);
    toast.info(t.liked ? "Unliked" : "Liked ❤️", {
      transition: Bounce,
      autoClose: 1200,
    });
  };

  // --- Subtitle toggle
  const toggleSubtitle = () => {
    setIsExpanded((prev) => !prev);
  };

  // --- Share trigger
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/template/view/${t.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: t.subtitle?.slice(0, 80) || "Check out this template!",
          url: shareUrl,
        });
        toast.success("Shared successfully 🎉", { transition: Bounce, autoClose: 1200 });
      } catch (err) {
        toast.error("Share cancelled", { transition: Bounce, autoClose: 1200 });
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.info("Link copied to clipboard 📋", { transition: Bounce, autoClose: 1200 });
    }
  };

  return (
    <div
      key={t.id}
      className={clsx(
        "rounded-xl border shadow-md p-5 hover:shadow-2xl transition-all duration-300",
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={t.profile?.pic || "/placeholder.png"}
          alt={t.profile?.username || "User"}
          className="w-10 h-10 rounded-full border-2 border-purple-500"
        />
        <span className="font-medium">{t.profile?.username || "Unknown"}</span>
      </div>

      {/* Cover */}
      <img
        src={t.cover_image || "/placeholder.png"}
        alt={t.title}
        className="w-full h-64 object-cover rounded-md mb-4 border-2 border-pink-400"
      />

      {/* Title + subtitle */}
      <h2 className="text-xl font-semibold mb-2">{t.title}</h2>
      <div
        className={clsx(
          "text-gray-500 mb-3 overflow-hidden transition-all duration-500 ease-in-out",
          isExpanded ? "max-h-96" : "max-h-16"
        )}
      >
        {t.subtitle}
      </div>
      {t.subtitle?.length > 100 && (
        <button
          onClick={toggleSubtitle}
          className="text-pink-500 hover:underline text-sm"
        >
          {isExpanded ? "Show less" : "View more"}
        </button>
      )}



      {/* Actions */}
      <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600">
        {/* Like */}
        <button
          onClick={onLikeClick}
          className={clsx(
            "flex items-center gap-1",
            t.liked ? "text-red-500" : "hover:text-red-500"
          )}
        >
          <Heart size={18} /> {t.like_count || 0}
        </button>

        {/* Comment */}
        <button
          onClick={() => {
            setSelectedTemplate(t);
            toast.info("Opening comments…", { transition: Bounce, autoClose: 1000 });
          }}
          className="flex items-center gap-1 hover:text-blue-500"
        >
          <MessageCircle size={18} /> {t.comment_count || 0}
        </button>

        {/* Save */}
        <button
          onClick={onSaveClick}
          className={clsx(
            "flex items-center gap-1",
            isSaved ? "text-yellow-500" : "hover:text-yellow-500"
          )}
        >
          <Bookmark size={18} /> {isSaved ? "Saved" : "Save"}
        </button>

        {/* Explore */}
        <Link href={`/template/view/${t.id}`} onClick={() =>
          toast.info("Exploring template...", { transition: Bounce, autoClose: 1000 })
        }>
          <button className="flex items-center gap-1 text-purple-500 hover:text-pink-400">
            <Eye size={18} /> Explore
          </button>
        </Link>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-green-500 hover:text-green-400"
        >
          <Share2 size={18} /> Share
        </button>

      </div>
      {/* Comments */}
      <CommentView
        templateId={t.id}
        templateOwnerId={t.user_id}
        isDarkMode={isDarkMode}
      />


    </div>
  );
}
