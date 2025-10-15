"use client";

import Image from "next/image";
import clsx from "clsx";
import UrlCard from "./UrlCard";
import { useSelector } from "react-redux";
import { Pencil, Share2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "@/libs/supabase/client";
import { toast } from "react-toastify";
import ConfirmPopup from "@/components/ui/Popup";
import { useRouter } from "next/navigation";

const UrlCardGroup = ({ card, items, isDark, onEdit, onStatusChange, fetchCards }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [showCopied, setShowCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(card.is_public || false);
  const [updating, setUpdating] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/shared/${card.id}`
      : `/shared/${card.id}`;

  // 🔁 Toggle Public/Private
  const handleToggle = async () => {
    setUpdating(true);
    const { error } = await supabase
      .from("card")
      .update({ is_public: !isPublic })
      .eq("id", card.id);
    if (!error) {
      setIsPublic(!isPublic);
      if (onStatusChange) onStatusChange(card.id, !isPublic);
    } else {
      toast.error("Failed to update public status.");
    }
    setUpdating(false);
  };

  // 🔗 Handle Share
  const handleShare = async () => {
    if (!isPublic) {
      toast("Make it public before sharing.");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("username, pic")
      .eq("id", card.user_id)
      .single();

    if (error || !data || !data.username || !data.pic) {
      toast("Before sharing complete the profile setup");
      router.push("/myprofile");
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: card.name,
          url: shareUrl,
        });
      } catch {
        /* user canceled share */
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  //  Self-contained Delete Handler
const handleDeleteCard = async () => {
  try {
    setConfirmVisible(false);
    setDeleting(true);

    // Small animation delay (optional)
    await new Promise((r) => setTimeout(r, 300));

    const { error } = await supabase.from("card").delete().eq("id", card.id);
    if (error) throw error;

    toast.success("Card deleted successfully!");

    // 🔁 Re-fetch updated cards list (no reload)
    if (typeof fetchCards === "function") {
      await fetchCards();
    }

  } catch (err) {
    console.error("Failed to delete card:", err);
    toast.error("Failed to delete card.");
  } finally {
    setDeleting(false);
  }
};

  return (
    <>
      <ConfirmPopup
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDeleteCard}
        title="Delete Card?"
        message="Are you sure you want to delete this card and all its URLs? This action cannot be undone."
      />

      <div
        className={clsx(
          "rounded-xl p-6 mb-10 shadow-lg backdrop-blur-md transition duration-300 relative",
          isDark
            ? "bg-black border border-purple-900 text-pink-200"
            : "bg-[rgba(255,255,255,0.6)] border border-pink-300 text-purple-900"
        )}
        style={
          card.bg_image
            ? {
              backgroundImage: `url(${card.bg_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
            : { backgroundColor: "black" }
        }
      >
        {card.bg_image && (
          <div className="absolute inset-0 rounded-xl bg-black/50 pointer-events-none z-0" />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-5 items-start gap-4 mb-6 relative z-10">
          {/* Profile Picture */}
          {card.pic && (
            <div className="flex justify-center sm:justify-start">
              <Image
                src={card.pic}
                alt="Card Group Preview"
                width={60}
                height={60}
                className="rounded-full border-2 border-pink-400 shadow-md"
              />
            </div>
          )}

          {/* Card Name */}
          <h2 className="text-lg sm:text-xl font-bold tracking-wide break-words sm:col-span-1 flex items-center justify-center sm:justify-start text-purple-200">
            {card.name}
          </h2>

          {/* Public Toggle */}
          <div className="flex justify-center sm:justify-start items-center">
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handleToggle}
                disabled={updating}
                className="sr-only peer"
              />
              <div
                className={`relative w-11 h-6 rounded-full peer 
                  ${isDarkMode
                    ? "bg-gray-900 peer-focus:ring-purple-800 peer-checked:bg-purple-600"
                    : "bg-purple-200 peer-focus:ring-purple-300 peer-checked:bg-purple-600"
                  }
                  peer-focus:ring-4
                  peer-checked:after:translate-x-full 
                  peer-checked:after:border-white 
                  after:content-[''] after:absolute after:top-0.5 after:start-[2px] 
                  after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                  after:transition-all 
                  ${isDarkMode ? "after:border-gray-600" : "after:border-gray-900"}
                `}
              ></div>
              <span
                className={`ms-3 text-sm sm:text-base font-medium ${isDarkMode ? "text-purple-100" : "text-purple-100"
                  }`}
              >
                {isPublic ? "Public" : "Private"}
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-center sm:justify-end items-center gap-2 sm:col-span-2">
            <button
              onClick={onEdit}
              className="px-2 py-2 bg-black rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition flex items-center"
              title="Edit"
            >
              <Pencil size={20} className="text-purple-600 dark:text-purple-300" />
            </button>

            <button
              onClick={handleShare}
              className="px-2 py-2 bg-black rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition flex items-center"
              title="Share"
            >
              <Share2 size={20} className="text-purple-600 dark:text-purple-300" />
            </button>
            <button
              onClick={() => !confirmVisible && setConfirmVisible(true)}
              disabled={updating}
              title="Delete Card"
              className="px-2 py-2 bg-black rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition flex items-center"
            >
              <Trash2 size={20} className="text-red-500 dark:text-red-300" />
            </button>

            {showCopied && (
              <span className="ml-2 px-2 py-1 bg-purple-600 text-white rounded text-xs">
                Link copied!
              </span>
            )}
          </div>
        </div>

        {/* URL List */}
        <div className="grid grid-cols-1 gap-6 relative z-10">
          {(items ?? card.urls ?? []).map((url) => (
            <UrlCard key={url.id} card={url} isDark={isDark} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UrlCardGroup;
