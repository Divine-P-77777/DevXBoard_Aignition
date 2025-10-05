"use client";

import { useState, useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import { Loader2, Send, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";
import ConfirmPopup from "@/components/ui/Popup";

export default function CommentView({ templateId, isDarkMode, templateOwnerId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [imageUrl, setImageUrl] = useState("/default-avatar.png");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch comments
  const fetchComments = async () => {
    if (!templateId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/template/comment?template_id=${templateId}`);
      const json = await res.json();
      if (res.ok) setComments(json.comments || []);
      else toast.error(json.error || "Failed to fetch comments", { transition: Bounce });
    } catch {
      toast.error("Network error fetching comments", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/profile/${user.id}`);
      const json = await res.json();
      if (res.ok) setImageUrl(json.profile?.pic || "/default-avatar.png");
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    fetchComments();
  }, [templateId]);

  // Submit new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.warn("Write something before commenting!", { transition: Bounce });
    if (!user?.id) return toast.error("Login required to comment", { transition: Bounce });

    setSubmitting(true);
    try {
      const res = await fetch("/api/template/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: templateId,
          user_id: user.id,
          comment: newComment.trim(),
        }),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success("Comment added 💬", { transition: Bounce, autoClose: 1200 });
        setComments((prev) => [
          {
            id: Date.now(),
            comment: newComment.trim(),
            created_at: new Date().toISOString(),
            profiles: { username: user.username || "You", pic: user.pic || "/placeholder.png" },
            user_id: user.id,
          },
          ...prev,
        ]);
        setNewComment("");
      } else toast.error(json.error || "Failed to post comment", { transition: Bounce });
    } catch {
      toast.error("Network error while commenting", { transition: Bounce });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      const res = await fetch(`/api/template/comment/${commentToDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, template_owner_id: templateOwnerId }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Comment deleted");
        setComments((prev) => prev.filter((c) => c.id !== commentToDelete.id));
      } else toast.error(json.error || "Failed to delete comment");
    } catch {
      toast.error("Network error");
    } finally {
      setCommentToDelete(null);
      setShowConfirm(false);
    }
  };

  const handleViewMore = () => setVisibleCount((prev) => prev + 2);

  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = visibleCount < comments.length;

  return (
    <div className={clsx("rounded-lg p-4 mt-4 border transition-all duration-300", isDarkMode ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200")}>
      <h3 className="font-semibold mb-3 text-lg">Comments</h3>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
        <img src={imageUrl} alt="User" className="w-8 h-8 rounded-full border border-gray-400" />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className={clsx("flex-1 p-2 rounded-lg outline-none border text-sm", isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500" : "bg-white border-gray-300")}
        />
        <button type="submit" disabled={submitting} className="text-pink-500 hover:text-pink-600">
          {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={20} />}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-pink-500 w-6 h-6" />
        </div>
      ) : visibleComments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {visibleComments.map((c) => {
            const canDelete = user?.id === c.user_id || user?.id === templateOwnerId;
            return (
              <div key={c.id} className={clsx("flex items-start gap-3 p-2 rounded-md", isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100")}>
                <img src={c.profiles?.pic || "/placeholder.png"} alt={c.profiles?.username || "User"} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.profiles?.username || "Anonymous"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{c.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(c.created_at).toLocaleString()}</p>
                </div>

                {canDelete && (
                  <button onClick={() => { setCommentToDelete(c); setShowConfirm(true); }} className="text-red-500 hover:text-red-600 ml-2">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* View More */}
      {hasMore && (
        <button onClick={handleViewMore} className="text-sm text-pink-500 mt-3 hover:underline">
          View more comments
        </button>
      )}

      {/* Confirm Delete Popup */}
      <ConfirmPopup
        visible={showConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
