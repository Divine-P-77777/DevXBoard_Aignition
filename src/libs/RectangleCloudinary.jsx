"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { waveform } from "ldrs";

waveform.register();

const RectangleCloudinary = ({ onUpload, initialUrl }) => {
  const [preview, setPreview] = useState(initialUrl || null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // To handle prop updates (when switching between edit/create)
  useEffect(() => {
    setPreview(initialUrl || null);
  }, [initialUrl]);

  const handleUpload = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
      }
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg h-52 flex flex-col items-center justify-center text-center cursor-pointer transition
        ${dragActive ? "border-purple-500 bg-purple-50" : "border-purple-400"}
        ${preview ? "p-0" : "p-6"}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg">
            <l-waveform size="40" stroke="3.5" speed="1" color="purple"></l-waveform>
          </div>
        )}

        {/* Preview */}
        {preview ? (
          <Image
            src={preview}
            alt="Uploaded preview"
            width={600}
            height={400}
            className="object-cover w-full h-52 rounded-lg"
          />
        ) : (
          <div>
            <div className="text-4xl text-purple-500">＋</div>
            <p className="mt-2 font-semibold text-white">Upload Cover</p>
            <p className="text-sm text-gray-400">
              Click or drag & drop your image here
            </p>
          </div>
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default RectangleCloudinary;