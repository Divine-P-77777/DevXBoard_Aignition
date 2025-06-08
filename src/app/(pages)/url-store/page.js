"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useForm, useFieldArray } from "react-hook-form";
import supabase from "@/libs/supabase/client";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Pencil, X } from "lucide-react";
import CloudinaryUploader from "@/libs/Cloudinary";
import ConfirmPopup from "@/components/ui/popup";
import UrlFormField from "@/components/ui/UrlFormField";
import UrlCardGroup from "@/components/ui/UrlCardGroup";
import clsx from "clsx";

const Page = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [previewImages, setPreviewImages] = useState({});
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingIndexes, setLoadingIndexes] = useState({});
  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control
  } = useForm({
    defaultValues: {
      cardname: "",
      urls: []
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "urls" });

  const fetchCards = useCallback(async () => {
    const { data, error } = await supabase
      .from("url_store")
      .select("*")
      .eq("user_id", user?.id)
      .ilike("title", `%${search}%`)
      .order("created_at", { ascending: false });
    if (!error) setCards(data);
  }, [user?.id, search]);

  useEffect(() => {
    if (user) fetchCards();
  }, [user, search, fetchCards]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowUploader(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = useCallback(() => {
    reset({ cardname: "", urls: [{ url: "", title: "", tag: "" }] });
    setImageUrl("");
  }, [reset]);

  const onSubmit = useCallback(async (data) => {
    const entries = data.urls.map((row) => ({
      user_id: user?.id,
      pic: imageUrl,
      card_name: data.cardname,
      title: row.title,
      url: row.url,
      tags: row.tag
    }));
    const { error } = await supabase.from("url_store").insert(entries);
    if (!error) {
      alert("Card entries added successfully!");
      reset();
      setShowUploader(false);
      setImageUrl("");
      fetchCards();
    } else {
      alert("Failed to submit data");
    }
  }, [user?.id, imageUrl, reset, setShowUploader, setImageUrl, fetchCards]);

  const onDelete = useCallback(async () => {
    if (confirmId) {
      await supabase.from("url_store").delete().eq("id", confirmId);
      setConfirmId(null);
      fetchCards();
    }
  }, [confirmId, fetchCards]);

  const groupedCards = useMemo(() => {
    return cards.reduce((acc, card) => {
      if (!acc[card.card_name]) acc[card.card_name] = { items: [] };
      acc[card.card_name].items.push(card);
      return acc;
    }, {});
  }, [cards]);



  const isUrlValid = useCallback((url) => /^https?:\/\/./.test(url), []);

  const autoGenerateTitleTag = useCallback(async (index, url) => {
    if (!isUrlValid(url)) return;
    setLoadingIndexes((prev) => ({ ...prev, [index]: true }));
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
    } catch (err) {
      console.error("Auto generation failed", err);
    } finally {
      setLoadingIndexes((prev) => ({ ...prev, [index]: false }));
    }
  }, [isUrlValid, setValue]);


  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${isDark ? "bg-[#0F172A] text-gray-300" : "bg-[#F9FAFB] text-gray-900"}`}>
        <ConfirmPopup visible={!!confirmId} onCancel={() => setConfirmId(null)} onConfirm={onDelete} />

        <div className="flex flex-col justify-center items-center pt-30 px-4">
          <input
            type="text"
            placeholder="Search Title"
            className={`px-4 py-2 border rounded-md shadow w-full max-w-sm ${isDark ? "" : "placeholder-gray-600 text-gray-800"}`}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => {
              setShowUploader(true);
              reset({ cardname: "", urls: [{ url: "", title: "", tag: "" }] });
            }}
            className="mt-6 px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600"
          >
            New Card
          </button>

          {showUploader && (
            <div
              ref={formRef}
              className={`mt-6 p-6 w-full max-w-2xl rounded-xl shadow relative ${isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-300"}`}
            >
              <button
                onClick={() => setShowUploader(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">

                {/* Image + Card Name Row */}
                <div className="flex justify-center items-center flex-wrap gap-6 py-10">
                  {/* Avatar Upload */}
                  <div className="relative w-24 h-24">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-cyan-500 transition-all duration-200" style={{ position: 'relative' }}>
                      {imageUrl ? (
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <Pencil size={24} className="mx-auto mb-1" />
                          <span className="text-xs">Upload</span>
                        </div>
                      )}
                    </div>

                    {/* Cloudinary Upload Overlay */}
                    <CloudinaryUploader
                      onUpload={setImageUrl}
                      enableDrag
                      overlayClassName="absolute inset-0 cursor-pointer rounded-full"
                    />
                  </div>

                  {/* Card Name Input */}
                  <input
                    type="text"
                    placeholder="Enter Card Name"
                    {...register("cardname", { required: true })}
                    className={`px-4 py-2 border-0 rounded-lg shadow-lg w-full max-w-sm backdrop-blur-sm outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 ease-in-out ${isDark
                        ? "text-white placeholder-white bg-black"
                        : "text-black placeholder-gray-600 bg-white"
                      }`}
                  />
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
                    isDark={isDark}
                  />
                ))}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-start">
                  <button
                    type="button"
                    onClick={() => append({ url: "", title: "", tag: "" })}
                    className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-2 transition"
                  >
                    <Plus size={16} /> Add URL
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
                  >
                    Reset
                  </button>
                </div>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </form>

            </div>
          )}

          <div className="mt-12 w-full max-w-4xl">
            {Object.entries(groupedCards).map(([cardName, { items }]) => (
              <UrlCardGroup
                key={cardName}
                cardName={cardName}
                items={items}
                isDark={isDark}
                previewImages={previewImages}
                onDelete={(id) => setConfirmId(id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};


export default Page;