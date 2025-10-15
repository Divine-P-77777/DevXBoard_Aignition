import Image from "next/image";
import clsx from "clsx";
import UrlCard from "./UrlCard";
import { useSelector } from "react-redux";
import { Pencil, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from 'react-toastify';
import ToastContainer from "@/components/ui/ToastContainer";
import ConfirmPopup from "@/components/ui/Popup";
import { useRouter } from "next/navigation";

const UrlCardGroup = ({ card, items, isDark, onDelete, onEdit, onStatusChange }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [showCopied, setShowCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(card.is_public || false);
  const [updating, setUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // 🔹 New state for popup
  const router = useRouter();

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/shared/${card.id}`
      : `/shared/${card.id}`;

  const handleToggle = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/card", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: card.id, is_public: !isPublic }),
      });
      if (!res.ok) throw new Error();
      setIsPublic(!isPublic);
      if (onStatusChange) onStatusChange(card.id, !isPublic);
      toast.success(`Card is now ${!isPublic ? "Public" : "Private"}`);
    } catch {
      toast.error("Failed to update public status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleShare = async () => {
    if (!isPublic) {
      toast.warn("Make it public before sharing.");
      return;
    }

    // Profile validation via API call
    const res = await fetch(`/api/profile?user_id=${card.user_id}`);
    const data = await res.json();
    if (!data?.username || !data?.pic) {
      toast("Please complete your profile before sharing.");
      router.push("/myprofile");
      return;
    }

    // Share logic
    if (navigator.share) {
      try {
        await navigator.share({ title: card.name, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
      toast.info("Link copied to clipboard!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(card.id); // 🔹 callback from parent (handles API + refresh)
      toast.success("Card deleted successfully!");
    } catch {
      toast.error("Failed to delete card.");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <ToastContainer />

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

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4 mb-6 relative z-10">
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

          {/* Name */}
          <h2 className="text-lg sm:text-xl font-bold tracking-wide break-words sm:col-span-1 flex items-center justify-center sm:justify-start text-purple-200">
            {card.name}
          </h2>

          {/* Public/Private Toggle */}
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
                  ? 'bg-gray-900 peer-focus:ring-purple-800 peer-checked:bg-purple-600'
                  : 'bg-purple-200 peer-focus:ring-purple-300 peer-checked:bg-purple-600'}
                peer-focus:ring-4
                peer-checked:after:translate-x-full 
                peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-0.5 after:start-[2px] 
                after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                after:transition-all 
                ${isDarkMode ? 'after:border-gray-600' : 'after:border-gray-900'}`}
              ></div>
              <span className={`ms-3 text-sm sm:text-base font-medium text-purple-100`}>
                {isPublic ? "Public" : "Private"}
              </span>
            </label>
          </div>

          {/* Edit, Share & Delete Buttons */}
          <div className="flex justify-center sm:justify-end items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-black rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition"
              title="Edit"
            >
              <Pencil size={20} className="text-purple-600 dark:text-purple-300" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-black rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition"
              title="Share"
            >
              <Share2 size={20} className="text-purple-600 dark:text-purple-300" />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 bg-black rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition"
              title="Delete"
            >
              <Trash2 size={20} className="text-red-500 dark:text-red-400" />
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
            <UrlCard key={url.id} card={url} isDark={isDark} onDelete={onDelete} />
          ))}
        </div>
      </div>

      {/* 🔹 Confirm Popup */}
      {showConfirm && (
        <ConfirmPopup
          message="Are you sure you want to delete this card?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default UrlCardGroup;
