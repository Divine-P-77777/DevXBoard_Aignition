"use client";
import { useState } from "react";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImages([]);
    setError(null);

    try {
      // POST request to your API route
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, numberOfImages: 4 }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate images");

      if (data.success && data.images?.length) {
        // convert base64 to blob URLs for display
        const urls = data.images.map((b64) => `data:image/png;base64,${b64}`);
        setImages(urls);
      } else {
        throw new Error("No images returned from API");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Generate AI Images</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image"
          rows={5}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Generate
        </button>
      </form>

      {loading && <p className="mt-4">⏳ Generating images...</p>}
      {error && <p className="mt-4 text-red-400">❌ {error}</p>}

      <div className="mt-6 flex flex-wrap gap-4">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`AI generated ${idx}`}
            className="max-w-xs rounded shadow"
          />
        ))}
      </div>
    </div>
  );
}
