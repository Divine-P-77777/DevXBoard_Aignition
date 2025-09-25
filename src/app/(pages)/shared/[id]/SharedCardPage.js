/* app/cards/[id]/page.jsx */
"use client";
import { useEffect, useState, useCallback } from "react";

import supabase from "@/libs/supabase/client";
import { Eye, X, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import GlobalLoader from "@/components/ui/GlobalLoader";
import UrlCard from "@/components/ui/UrlCard";

const SharedCardPage = ({ id }) => {
  const [card, setCard] = useState(null);
  const [owner, setOwner] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const fetchCardData = useCallback(async () => {
    setLoading(true);
    const { data: cardData, error: cardError } = await supabase
      .from("card")
      .select("*")
      .eq("id", id)
      .eq("is_public", true)
      .single();

    if (cardError || !cardData) {
      setCard(null);
      setOwner(null);
      setUrls([]);
      setLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("username,pic")
      .eq("id", cardData.user_id)
      .single();

    const { data: urlRows } = await supabase
      .from("url_store")
      .select("*")
      .eq("card_id", id)
      .order("created_at", { ascending: true });

    setCard(cardData);
    setOwner(profileData || {});
    setUrls(Array.isArray(urlRows) ? urlRows : []);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (id) fetchCardData();
  }, [id, fetchCardData]);

  const handleClosePreview = () => setPreviewUrl(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id === "preview-backdrop") handleClosePreview();
    };
    if (previewUrl) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [previewUrl]);

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${card?.name} by @${owner?.username}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-white ${isDarkMode ? "bg-black/90" : "bg-gray-100"}`}>
        <GlobalLoader fullscreen />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white backdrop-blur-xl bg-black/70">
        <p>Card not found or not public.</p>
      </div>
    );
  }

  const ownerPic =
    owner?.pic ||
    "https://png.pngtree.com/element_our/20190528/ourmid/pngtree-purple-game-icon-design-image_1168962.jpg";
  const ownerUsername = owner?.username || "unknown";

  return (
    <>
      <Navbar className="hidden" />


      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-start p-4 sm:p-6 md:p-10 text-white"
        style={{ backgroundImage: `url(${card.bg_image || "/default-bg.jpg"})` }}
      >
        <div className="flex flex-col pt-16 items-center mt-10 mb-6">
          <img
            src={ownerPic}
            alt="Owner Profile"
            className="w-24 h-24 rounded-full border-4 border-pink-400 shadow-xl bg-white object-cover"
          />
          <h2 className="text-2xl font-bold mt-4 px-5 py-2 rounded-full shadow bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700">
            @{ownerUsername}
          </h2>
        </div>

        <div className={`w-full max-w-screen-md px-4 sm:px-6 py-8 ${isDarkMode ? "bg-black/60" : "bg-white/60"} rounded-2xl shadow-lg backdrop-blur-md`}>
          <div className="w-full bg-gradient-to-br from-purple-900 via-pink-600 to-purple-800/80 rounded-lg p-4 sm:p-6 shadow-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <img src={card.pic} className="w-14 h-14 rounded-2xl border-2 border-pink-300" alt="" />
            <h3 className="text-xl font-semibold text-white text-center flex-1 truncate"><span>~</span>{card.name}</h3>
            <button
              onClick={handleShareClick}
              className="flex items-center gap-2 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition duration-300 border-2"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {urls.length === 0 ? (
              <div className="text-center text-gray-200 bg-black/30 rounded-lg py-4 px-6">
                No links found for this card.
              </div>
            ) : (
              urls.map((url) => (
                <UrlCard
                  key={url.id}
                  card={url}
                  onDelete={null} // disable delete button
                />
              ))
            )}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div
          id="preview-backdrop"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center"
        >
          <div
            className="relative w-[95%] md:w-[70%] lg:w-[55%] h-[82%] rounded-lg overflow-hidden border border-pink-400 bg-white dark:bg-black shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 text-red-400 hover:text-red-300 z-50"
              aria-label="Close preview"
            >
              <X size={24} />
            </button>
            <iframe
              src={previewUrl}
              className="w-full h-full"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SharedCardPage;