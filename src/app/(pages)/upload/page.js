"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Plus, Upload, Sparkles, Loader2, Undo2 } from "lucide-react";
import RectangleCloudinary from "@/libs/RectangleCloudinary";
import ConfirmPopup from "@/components/ui/Popup";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";
import { toast, Bounce } from "react-toastify";
import CodeBlockCell from "./CodeBlockItem";
import Toggle from "./Toggle";
import CodePromptPopup from "./CodePromptPopup";

export default function UploadTemplatePage() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [codeBlocks, setCodeBlocks] = useState([
    {
      id: uuidv4(),
      description: "",
      code: "",
      loading: false,
      language: "",
      prevCode: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [descLoading, setDescLoading] = useState({});
  const [descPrev, setDescPrev] = useState({});
  const [titleCorrection, setTitleCorrection] = useState({ orig: "", ai: "", loading: false, showUndo: false });
  const [subtitleCorrection, setSubtitleCorrection] = useState({ orig: "", ai: "", loading: false, showUndo: false });
  const [promptPopup, setPromptPopup] = useState({ open: false, blockId: null });
  const router = useRouter();

  // Auth check
  useEffect(() => {
    if (!user) {
      toast.error("⚠️ Please login to continue", { transition: Bounce });
      router.push("/auth");
    }
  }, [user, router]);

  // --- AI Correction for Title/Sub ---
  const handleAICorrectTitle = async () => {
    setTitleCorrection((c) => ({ ...c, orig: title, loading: true }));
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, mode: "title" }),
      });
      const data = await res.json();
      setTitle(data.title || title);
      setTitleCorrection((c) => ({
        ...c,
        ai: data.title || "",
        loading: false,
        showUndo: true,
      }));
      toast.success("✅ Title improved by AI!", { transition: Bounce });
    } catch {
      setTitleCorrection((c) => ({ ...c, loading: false }));
      toast.error("❌ AI failed to improve title", { transition: Bounce });
    }
  };
  const undoTitle = () => {
    setTitle(titleCorrection.orig);
    setTitleCorrection({ orig: "", ai: "", loading: false, showUndo: false });
  };

  const handleAICorrectSubtitle = async () => {
    setSubtitleCorrection((c) => ({ ...c, orig: subtitle, loading: true }));
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, mode: "subtitle" }),
      });
      const data = await res.json();
      setSubtitle(data.subtitle || subtitle);
      setSubtitleCorrection((c) => ({
        ...c,
        ai: data.subtitle || "",
        loading: false,
        showUndo: true,
      }));
      toast.success("✅ Subtitle improved by AI!", { transition: Bounce });
    } catch {
      setSubtitleCorrection((c) => ({ ...c, loading: false }));
      toast.error("❌ AI failed to improve subtitle", { transition: Bounce });
    }
  };
  const undoSubtitle = () => {
    setSubtitle(subtitleCorrection.orig);
    setSubtitleCorrection({ orig: "", ai: "", loading: false, showUndo: false });
  };

  // --- Code Block State Handlers ---
  const addCodeBlock = () => {
    if (codeBlocks.length < 15) {
      setCodeBlocks([
        ...codeBlocks,
        {
          id: uuidv4(),
          description: "",
          code: "",
          loading: false,
          language: "",
          prevCode: "",
        },
      ]);
    } else {
      toast.warn("🚧 Max 15 code blocks allowed", { transition: Bounce });
    }
  };

  const removeCodeBlock = (id) => {
    setCodeBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateCodeBlock = (id, key, value) => {
    setCodeBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b))
    );
  };

  // --- AI Autocorrect for code ---
  const handleAI = async (blockId) => {
    const block = codeBlocks.find((b) => b.id === blockId);
    if (!block.code.trim()) {
      toast.warn("⚠️ Write some code first");
      return;
    }
    updateCodeBlock(blockId, "loading", true);
    updateCodeBlock(blockId, "prevCode", block.code);

    try {
      const res = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: block.code, mode: "autocorrect" }),
      });
      const data = await res.json();
      if (data.success) {
        updateCodeBlock(blockId, "code", data.generated_code || "");
        updateCodeBlock(blockId, "language", data.language || "");
      } else {
        toast.error("❌ AI failed to generate");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ AI failed to generate");
    } finally {
      updateCodeBlock(blockId, "loading", false);
    }
  };

  // --- Undo AI Correction/Generation for Code ---
  const undoCode = (blockId) => {
    const block = codeBlocks.find((b) => b.id === blockId);
    if (block && block.prevCode) {
      updateCodeBlock(blockId, "code", block.prevCode);
      updateCodeBlock(blockId, "prevCode", "");
    }
  };

  // --- Description AI generation ---
  const handleGenDescription = async (blockId) => {
    const block = codeBlocks.find((b) => b.id === blockId);
    if (!block) return;
    setDescLoading(dl => ({ ...dl, [blockId]: true }));
    setDescPrev(dp => ({ ...dp, [blockId]: block.description }));
    try {
      if (!block.code.trim()) {
        toast.warn("Write code first or a hint for description!");
        setDescLoading(dl => ({ ...dl, [blockId]: false }));
        return;
      }
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: block.code, mode: "description" }),
      });
      const data = await res.json();
      updateCodeBlock(blockId, "description", data.text || block.description);
    } catch (err) {
      toast.error("❌ AI failed to generate description");
    } finally {
      setDescLoading(dl => ({ ...dl, [blockId]: false }));
    }
  };

  const undoDesc = (blockId) => {
    if (descPrev[blockId]) {
      updateCodeBlock(blockId, "description", descPrev[blockId]);
      setDescPrev(dp => ({ ...dp, [blockId]: "" }));
    }
  };

  // --- Code generation popup logic ---
  const handlePromptClick = (blockId) => {
    setPromptPopup({ open: true, blockId });
  };

  const handleGenerateFromPrompt = async (prompt) => {
    const blockId = promptPopup.blockId;
    if (!blockId) return;
    updateCodeBlock(blockId, "loading", true);
    const block = codeBlocks.find((b) => b.id === blockId);
    updateCodeBlock(blockId, "prevCode", block.code);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode: "generate" }),
      });
      const data = await res.json();
      updateCodeBlock(blockId, "code", data.text || "");
      updateCodeBlock(blockId, "language", data.language || "");
      toast.success("✅ Code generated from prompt!", { transition: Bounce });
    } catch (err) {
      toast.error("❌ AI failed to generate code from prompt");
    } finally {
      updateCodeBlock(blockId, "loading", false);
      setPromptPopup({ open: false, blockId: null });
    }
  };

  // --- Submit logic ---
  const handleSubmit = () => {
    // Validate required fields
    if (!image || !title.trim()) {
      toast.error("❌ Image and title are required!", { transition: Bounce });
      return;
    }
    if (
      codeBlocks.length === 0 ||
      codeBlocks.every((b) => !b.code.trim() && !b.description.trim())
    ) {
      toast.error("❌ Please add at least one code block with code or description.", { transition: Bounce });
      return;
    }
    if (loading) return; // prevent double submit
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const payload = {
        title,
        subtitle,
        visibility,
        cover_image: image,
        blocks: codeBlocks
          .filter((b) => b.code.trim() || b.description.trim())
          .map((b) => ({
            description: b.description,
            code: b.code,
          })),
      };

      const res = await fetch("/api/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit template");
      toast.success("✅ Template submitted successfully!", { transition: Bounce });

      setTitle("");
      setSubtitle("");
      setVisibility("private");
      setCodeBlocks([
        {
          id: uuidv4(),
          description: "",
          code: "",
          loading: false,
          language: "",
          prevCode: "",
        },
      ]);
      setImage("");
      setDescLoading({});
      setDescPrev({});
      setShowConfirm(false);

      router.push("/upload");
    } catch (err) {
      console.error("Submit template error:", err);
      toast.error("❌ Failed to submit template", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CodePromptPopup
        visible={promptPopup.open}
        onClose={() => setPromptPopup({ open: false, blockId: null })}
        onGenerate={handleGenerateFromPrompt}
        description={
          promptPopup.open
            ? codeBlocks.find((b) => b.id === promptPopup.blockId)?.description || ""
            : ""
        }
      />

      <div className={`min-h-screen w-full ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
        <div
          className={`max-w-5xl mx-auto pt-30 p-6 space-y-6 
          ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}
        >
          <ConfirmPopup
            visible={showConfirm}
            onConfirm={confirmSubmit}
            onCancel={() => setShowConfirm(false)}
            title="Submit Template"
            message="Are you sure you want to submit this template?"
            confirmText="Submit"
            cancelText="Cancel"
          />

          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            🚀 Submit a Template <Sparkles className="text-yellow-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Share your code snippets & templates with the community.  
            Make it public or keep it private.
          </p>

          {/* Cover Image */}
          <div className="space-y-2">
            <RectangleCloudinary onUpload={(url) => setImage(url)} />
            {image && <div className="text-green-500 text-sm mt-2 flex items-center gap-1">✅ Cover uploaded successfully</div>}
          </div>

          {/* Title & Subtitle, with AI correction */}
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <input
                className="w-full px-4 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none 
                  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button 
                onClick={handleAICorrectTitle} 
                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={titleCorrection.loading}
              >
                <Sparkles size={16} />
                {titleCorrection.loading ? <Loader2 className="animate-spin" size={14} /> : "AI"}
              </button>
              {titleCorrection.showUndo && (
                <button 
                  onClick={undoTitle}
                  className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  <Undo2 size={14} /> Undo
                </button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="w-full px-4 py-2 rounded-md border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none 
                  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                placeholder="Subtitle (optional)"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
              <button 
                onClick={handleAICorrectSubtitle}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={subtitleCorrection.loading}
              >
                <Sparkles size={16} />
                {subtitleCorrection.loading ? <Loader2 className="animate-spin" size={14} /> : "AI"}
              </button>
              {subtitleCorrection.showUndo && (
                <button 
                  onClick={undoSubtitle}
                  className="flex items-center gap-1 px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  <Undo2 size={14} /> Undo
                </button>
              )}
            </div>
          </div>

          {/* Visibility */}
          <div className="flex gap-4 items-center">
            <span className="font-medium">Visibility:</span>
            <Toggle
              pressed={visibility === "public"}
              onPressedChange={() =>
                setVisibility((v) => (v === "public" ? "private" : "public"))
              }
            >
              {visibility === "public" ? "🌍 Public" : "🔒 Private"}
            </Toggle>
          </div>

          {/* Code Blocks */}
          {codeBlocks.map((block, idx) => (
            <CodeBlockCell
              key={block.id}
              block={block}
              idx={idx}
              onChange={updateCodeBlock}
              onRemove={removeCodeBlock}
              onAI={handleAI}
              onPromptClick={handlePromptClick}
              isDarkMode={isDarkMode}
              undoCode={undoCode}
              canUndo={!!block.prevCode}
              onGenDescription={handleGenDescription}
              genDescLoading={!!descLoading[block.id]}
              descCanUndo={!!descPrev[block.id]}
              undoDesc={undoDesc}
            />
          ))}

          {/* Add Code Block */}
          <button
            onClick={addCodeBlock}
            disabled={codeBlocks.length >= 15}
            className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            <Plus size={16} /> Add Code Block
          </button>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Upload size={16} />
              {loading ? (
                <>
                  Submitting...
                  <Loader2 className="animate-spin" size={16} />
                </>
              ) : (
                "Submit Template"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}