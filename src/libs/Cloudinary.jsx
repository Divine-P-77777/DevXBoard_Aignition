"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { waveform } from 'ldrs'
waveform.register()

const CloudinaryUploader = ({ onUpload, previewClassName = "", enableDrag = false, overlayClassName = "" }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        onUpload(data.secure_url);
      }
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={overlayClassName}>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleImageUpload}
        className={enableDrag ? "absolute inset-0 opacity-0 cursor-pointer" : "file-input file-input-bordered file-input-primary w-full max-w-xs"}
      />

     {loading && (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-full">
    <l-waveform
      size="35"
      stroke="3.5"
      speed="1"
      color="purple"
    ></l-waveform>
  </div>
)}

    </div>
  );
};

export default CloudinaryUploader;




