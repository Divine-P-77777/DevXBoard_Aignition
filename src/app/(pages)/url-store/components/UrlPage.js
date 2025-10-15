"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import supabase from "@/libs/supabase/client";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Pencil, X, Folders, Paperclip } from "lucide-react";
import CloudinaryUploader from "@/libs/Cloudinary";
import ConfirmPopup from "@/components/ui/Popup";
import UrlFormField from "./UrlFormField";
import UrlCardGroup from "./UrlCardGroup";
import clsx from "clsx";
import { toast, Bounce } from 'react-toastify';
import {Loader2} from "lucide-react"
import useCheckProfileComplete from "@/hooks/useCheckProfileComplete"
import {useRouter} from "next/navigation"

const DEFAULT_URL = { url: "", title: "", tag: "" };

const UrlPage = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [loadingIndexes, setLoadingIndexes] = useState({});
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [bgFileName, setBgFileName] = useState("");
  const [error, setError] = useState('');
const {router} = useRouter();
  useCheckProfileComplete();

  // Auth check
  useEffect(() => {
    if (!user) {
      toast.error("⚠️ Please login to continue", { transition: Bounce });
      router.push("/auth");
    }
  }, [user, router]);




  const {
    register, handleSubmit, reset, setValue, getValues, control, watch
  } = useForm({
    defaultValues: {
      cardname: "",
      urls: [DEFAULT_URL],
      bgImage: "",
      pic: "",
      isPublic: false
    }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "urls" });

  // Toast error state for custom messages
  const showToast = (msg) => { setError(msg); setTimeout(() => setError(''), 3000); };

  // Image uploads
  const imageUrl = watch("pic");
  const setImageUrl = (url) => setValue("pic", url);

  const handleAvatarUpload = (url, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB');
      setImageUrl(""); return;
    }
    setImageUrl(url);
  };

  const handleBgImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('Background image size must be less than 5MB'); return; }
    setBgFileName(file.name.length > 12 ? file.name.substring(0, 8) + '...' + file.name.split('.').pop() : file.name);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    if (data.secure_url) setValue("bgImage", data.secure_url);
  };

  // Fetch cards
  const fetchCards = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("card")
      .select("*, urls:url_store(*)")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (search.trim()) query = query.ilike("name", `%${search}%`);
    const { data } = await query;
    setCards(data || []);
    setLoading(false);
  }, [user?.id, search]);

  useEffect(() => { if (user) fetchCards(); }, [user, search, fetchCards]);

  // Click outside logic for uploader
  useEffect(() => {
    if (!showUploader) return;
    const handler = (e) => {
      if (
        formRef.current &&
        !formRef.current.contains(e.target) &&
        editCard // only close on click outside if editing
      ) setShowUploader(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showUploader, editCard]);

  // Open Card Form (ensures only one open at a time)
  const openCardForm = useCallback((card = null) => {
    if (card) {
      setEditCard(card);
      reset({
        cardname: card.name,
        urls: (card.urls || []).map(({ url, title, tags, id, tag }) => ({
          url, title, tag: tag || tags || "", id
        })),
        bgImage: card.bg_image || "",
        pic: card.pic || "",
        isPublic: card.is_public || false
      });
    } else {
      setEditCard(null);
      reset({ cardname: "", urls: [DEFAULT_URL], bgImage: "", pic: "", isPublic: false });
    }
    setShowUploader(true);
  }, [reset]);

  const isUrlValid = url => /^https?:\/\/./.test(url);

  const autoGenerateTitleTag = useCallback(async (index, url) => {
    if (!isUrlValid(url)) return;
    setLoadingIndexes(prev => ({ ...prev, [index]: true }));
    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: url,
          content: "You are a smart bookmarker. Extract a short title (under 30 characters) and a hashtag (under 20 characters) from the following URL. Return JSON: { \"title\": \"...\", \"tag\": \"#tag\" }",
          model: "openai/gpt-4.1"
        })
      });
      const data = await res.json();
      const parsed = JSON.parse(data.text);
      setValue(`urls.${index}.title`, parsed.title?.slice(0, 30));
      setValue(`urls.${index}.tag`, parsed.tag?.slice(0, 20));
    } catch { }
    finally { setLoadingIndexes(prev => ({ ...prev, [index]: false })); }
  }, [setValue]);

  // Add/Edit card
  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    let cardId = editCard?.id;
    // Upsert card
    if (editCard) {
      await supabase.from("card").update({
        name: data.cardname, pic: data.pic, bg_image: data.bgImage, is_public: data.isPublic || false,
      }).eq("id", editCard.id);
      toast.success('🦄 Card Updated Successfully !');
    } else {
      const { data: newCard, error } = await supabase.from("card").insert({
        name: data.cardname, user_id: user?.id, pic: data.pic, bg_image: data.bgImage, is_public: data.isPublic || false,
      }).select().single();
      if (error) { toast("Failed to create card"); setLoading(false); return; }
      toast.success('🦄 Card Added Successfully !', { position: "top-right", autoClose: 5000, theme: "dark", transition: Bounce });
      cardId = newCard.id;
    }
    // URLs: update, insert, delete
    const existingUrls = editCard ? (editCard.urls || []) : [];
    const urlEntries = data.urls.map(row => ({
      title: row.title, url: row.url, tags: row.tag, card_id: cardId, id: row.id,
    }));
    for (let url of urlEntries) {
      if (url.id) await supabase.from("url_store").update(url).eq("id", url.id);
      else await supabase.from("url_store").insert(url);
    }
    if (editCard) {
      const keptIds = urlEntries.filter(u => u.id).map(u => u.id);
      for (const del of existingUrls.filter(u => !keptIds.includes(u.id)))
        await supabase.from("url_store").delete().eq("id", del.id);
    }
    setShowUploader(false);
    fetchCards();
    reset({ cardname: "", urls: [DEFAULT_URL], bgImage: "", pic: "", isPublic: false });
    setEditCard(null);
    setLoading(false);
  }, [user?.id, reset, fetchCards, editCard]);

  // Delete card
  const handleDeleteCard = useCallback(async (cardId) => {
    setLoading(true);
    await supabase.from("card").delete().eq("id", cardId);
    fetchCards();
    setLoading(false);
    toast('Card deleted successfully!');
  }, [fetchCards]);

  const isImageUploaded = Boolean(imageUrl);

  return (
    <>
      {error && (<div className="toast fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50">{error}</div>)}
      <div className={clsx("min-h-screen", isDarkMode ? "bg-gradient-to-br from-black via-gray-900 to-black text-gray-300" : "bg-gradient-to-br from-purple-300 via-white to-pink-300 text-gray-900")}>
        <ConfirmPopup visible={!!confirmId} onCancel={() => setConfirmId(null)} onConfirm={() => handleDeleteCard(confirmId)} />
        <div className="flex flex-col justify-center items-center pt-30 px-4 gap-3">
          {/* Add New */}
          <button onClick={() => openCardForm()} className={clsx("relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium rounded-lg group",
            isDarkMode ? 'text-white bg-gradient-to-br from-purple-500 to-pink-500 focus:ring-pink-200 dark:focus:ring-pink-800' : 'text-gray-900 bg-gradient-to-br from-purple-300 to-pink-300 focus:ring-pink-200')}>
            <span className={clsx("relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md",
              isDarkMode ? 'bg-gray-900 group-hover:bg-transparent' : 'bg-white group-hover:bg-transparent')}>
              New Card
            </span>
          </button>

          {/* Card Form Modal */}
          {showUploader && (
            <div ref={formRef} className={clsx("mt-6 p-6 w-full max-w-2xl rounded-xl shadow relative", isDarkMode ? "bg-black border border-slate-700" : "bg-white border border-gray-300")}>
              <button onClick={() => setShowUploader(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"><X size={20} /></button>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                {/* Image + Card Name Row */}
                <div className="flex justify-center items-center flex-wrap gap-6 py-10">
                  {/* Avatar Upload */}
                  <div className="relative w-24 h-24">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-cyan-500 transition-all duration-200" style={{ position: 'relative' }}>
                      {imageUrl ? (
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <Pencil size={24} className="mx-auto mb-1" />
                          <span className="text-xs">Upload</span>
                        </div>
                      )}
                    </div>
                    <CloudinaryUploader
                      onUpload={handleAvatarUpload}
                      enableDrag
                      overlayClassName="absolute inset-0 cursor-pointer rounded-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Card Name"
                    maxLength={60}
                    {...register("cardname", { required: true })}
                    className={clsx("px-4 py-2 border rounded-lg shadow-lg w-full max-w-sm backdrop-blur-sm outline-none focus:ring-2 border-purple-600 focus:ring-cyan-400 transition-all duration-200 ease-in-out", isDarkMode ? "text-white placeholder-white bg-black" : "text-black placeholder-gray-600 bg-white")}
                  />
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
                    <div className="w-full">
                      <label className={`block font-medium text-sm ${isDarkMode ? 'text-purple-200' : 'text-purple-700'} mb-1`}>Upload Background (optional)</label>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-purple-400 text-purple-700 text-sm cursor-pointer hover:bg-purple-50 transition w-full sm:w-auto">
                        <span><Folders /></span> Choose File
                        <input type="file" accept="image/*" className="hidden" onChange={handleBgImageChange} />
                      </label>
                      {bgFileName && (
                        <p className="text-xs mt-1 text-purple-500 break-all flex gap-1 items-center"><span><Paperclip color={isDarkMode ? 'white' : 'black'} size={12} /></span><span>{bgFileName}</span></p>
                      )}
                    </div>
                    {/* Toggle Switch */}
                    <label className="inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" {...register("isPublic")} className="sr-only peer" defaultChecked={false} />
                      <div className={`relative w-11 h-6 rounded-full peer 
                        ${isDarkMode
                          ? 'bg-gray-900 peer-focus:ring-purple-800 peer-checked:bg-purple-600'
                          : 'bg-purple-200 peer-focus:ring-purple-300 peer-checked:bg-purple-600'}
                        peer-focus:ring-4
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                        peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-0.5 after:start-[2px] 
                        after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                        after:transition-all 
                        ${isDarkMode ? 'after:border-gray-600' : 'after:border-gray-900'}
                      `}></div>
                      <span className={`ms-3 text-sm sm:text-base font-medium ${isDarkMode ? 'text-purple-100' : 'text-purple-100'}`}>
                        {watch("isPublic") ? "Public" : "Private"}
                      </span>
                    </label>
                  </div>
                </div>
                {/* Dynamic URL Fields */}
                {fields.map((field, index) => (
                  <UrlFormField
                    key={field.id}
                    field={field}
                    index={index}
                    register={register}
                    remove={remove}
                    loadingIndexes={loadingIndexes}
                    autoGenerateTitleTag={autoGenerateTitleTag}
                    totalFields={fields.length}
                    getValues={getValues}
                  />
                ))}
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-start">
                  <button type="button" onClick={() => append(DEFAULT_URL)} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                      <div className="flex items-center gap-2"><Plus size={16} /> Add URL</div>
                    </span>
                  </button>
                  <button type="button" onClick={() => openCardForm()} className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Reset</button>
                </div>
                {/* Submit/Update Button */}
                <div className="flex justify-center items-center gap-2">
                  <button
                    type="submit"
                    className={clsx(
                      "text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 flex items-center gap-2",
                      !isImageUploaded && "opacity-60 cursor-not-allowed"
                    )}
                    disabled={!isImageUploaded}
                    onClick={e => {
                      if (!isImageUploaded) {
                        e.preventDefault();
                        showToast('Please upload an image before submitting.');
                      }
                    }}
                  >
                    <Plus size={16} /> {editCard ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search */}
          <form className="flex items-center max-w-md mx-auto my-4" onSubmit={e => e.preventDefault()}>
            <div className="relative w-full p-[1px] rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <div className={clsx("rounded-lg", isDarkMode ? 'bg-black' : 'bg-white')}>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className={clsx("w-5 h-5", isDarkMode ? 'text-gray-300' : 'text-gray-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  </div>
                  <input
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search by card name..."
                    className={clsx(
                      "block w-full pl-10 pr-4 py-2 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 border-0",
                      isDarkMode ? 'bg-black placeholder-gray-400 text-white' : 'bg-white text-gray-900'
                    )}
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Card Grid or Loader */}
          <div className="mt-12 min-h-[200px] flex justify-center">
            {loading ? (
              <div className="mx-auto"><Loader2 color="purple" className="animate-spin w-12 h-12" /></div>
            ) : cards.length === 0 ? (
              <div className={clsx("text-center mx-auto", isDarkMode ? 'text-purple-200' : 'text-purple-900')}>
                <p className="text-lg">No cards found.</p>
                <p className="text-sm">Create a new card to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {cards.map(card => (
                  <UrlCardGroup
                    key={card.id}
                    card={card}
                    items={card.urls}
                    isDark={isDarkMode}
                    onDelete={id => setConfirmId(id)}
                    onEdit={() => openCardForm(card)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UrlPage;