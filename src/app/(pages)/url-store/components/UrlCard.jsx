"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getFaviconFromUrl } from "@/utils/getFaviconFromUrl";
import { ExternalLink, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import supabase from "@/libs/supabase/client";
import { toast } from "react-toastify";
import ConfirmPopup from "@/components/ui/Popup";
import { useAuth } from "@/hooks/useAuth";

const UrlCard = ({ card }) => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const [faviconError, setFaviconError] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useAuth();

  const isValidUrl = typeof card?.url === "string" && card.url.trim() !== "";

  // ✅ Check ownership dynamically (card might come with card.card_id or user_id)
  useEffect(() => {
    const checkOwner = async () => {
      if (!user) return;

      try {
        // If card already has user_id (e.g., from joined data)
        if (card.user_id && user.id === card.user_id) {
          setIsOwner(true);
          return;
        }

        // Otherwise fetch the parent card's owner
        if (card.card_id) {
          const { data, error } = await supabase
            .from("card")
            .select("user_id")
            .eq("id", card.card_id)
            .single();

          if (!error && data?.user_id === user.id) {
            setIsOwner(true);
          }
        }
      } catch (err) {
        console.error("Error checking ownership:", err);
      }
    };

    checkOwner();
  }, [user, card]);

  // 🗑️ Handle delete with confirmation (only if owner)
  const handleDeleteUrl = async () => {
    if (!isOwner) {
      toast.error("You are not allowed to delete this URL.");
      return;
    }

    try {
      setDeleting(true);
      setShowConfirm(false);

      const { error } = await supabase.from("url_store").delete().eq("id", card.id);
      if (error) throw error;

      toast.success("URL deleted successfully!");
      setVisible(false); // Instantly remove from UI
    } catch (err) {
      console.error("Failed to delete URL:", err);
      toast.error("Failed to delete URL!");
    } finally {
      setDeleting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <ConfirmPopup
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDeleteUrl}
        title="Delete URL?"
        message="Are you sure you want to delete this URL? This action cannot be undone."
      />

      <div
        className={clsx(
          "flex flex-wrap sm:flex-nowrap items-center justify-between rounded-2xl p-4 shadow-xl backdrop-blur-md transition-all duration-300 border w-full gap-4 sm:gap-6",
          isDark
            ? "bg-black border-purple-800 text-pink-100"
            : "bg-[rgba(255,240,255,0.4)] border-pink-300 text-black"
        )}
      >
        {/* Left Side: Icon + Info */}
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

        {/* Right Side: Actions */}
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

          {/* 🗑️ Show Delete Only if Owner */}
          {isOwner && (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              title="Delete URL"
              className={clsx(
                "transition hover:scale-110 disabled:opacity-50",
                isDark
                  ? "text-red-300 hover:text-red-200"
                  : "text-black hover:text-pink-900 font-bold"
              )}
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UrlCard;
