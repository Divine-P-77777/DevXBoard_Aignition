
"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast, Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Helper to strip code fences
const stripCodeFences = (str) => str?.replace(/^```[\w\s]*\n?([\s\S]*?)\n?```$/gm, "$1").trim() || "";

export function useTemplateForm(initialData, onSuccess) {
  const router = useRouter();
  const { user } = useAuth();

  // --- States ---
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [image, setImage] = useState("");
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // For private email sharing
 const [sharedUsernames, setSharedUsernames] = useState(initialData?.sharedUsernames || []);


  // AI corrections & description tracking
  const [titleCorrection, setTitleCorrection] = useState({ orig: "", ai: "", loading: false, showUndo: false });
  const [subtitleCorrection, setSubtitleCorrection] = useState({ orig: "", ai: "", loading: false, showUndo: false });
  const [descLoading, setDescLoading] = useState({});
  const [descPrev, setDescPrev] = useState({});
  const [promptPopup, setPromptPopup] = useState({ open: false, blockId: null });

  // --- Hydrate from initialData ---
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setVisibility(initialData.visibility || "private");
      setImage(initialData.cover_image || "");
      setCodeBlocks(
        initialData.blocks?.length
          ? initialData.blocks.map((b) => ({ ...b, id: b.id || uuidv4(), prevCode: "", loading: false }))
          : [{ id: uuidv4(), description: "", code: "", language: "", prevCode: "", loading: false }]
      );
    }
  }, [initialData]);

  // --- Auth check ---
  useEffect(() => {
    if (!user) {
      toast.error("⚠️ Please login to continue", { transition: Bounce });
      router.push("/auth");
    }
  }, [user, router]);

  // --- Generic AI correction handler ---
  const handleAICorrection = async ({ mode, value, setValue, setCorrection }) => {
    setCorrection((c) => ({ ...c, orig: value, loading: true }));
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, mode }),
      });
      const data = await res.json();
      setValue(data[mode] || value);
      setCorrection((c) => ({ ...c, ai: data[mode] || "", loading: false, showUndo: true }));
      toast.success(`✅ ${mode.charAt(0).toUpperCase() + mode.slice(1)} improved by AI!`, { transition: Bounce });
    } catch {
      setCorrection((c) => ({ ...c, loading: false }));
      toast.error(`❌ AI failed to improve ${mode}`, { transition: Bounce });
    }
  };

  const undoCorrection = (correction, setValue, setCorrection) => {
    setValue(correction.orig);
    setCorrection({ orig: "", ai: "", loading: false, showUndo: false });
  };

  const handleAICorrectTitle = () => handleAICorrection({ mode: "title", value: title, setValue: setTitle, setCorrection: setTitleCorrection });
  const undoTitle = () => undoCorrection(titleCorrection, setTitle, setTitleCorrection);

  const handleAICorrectSubtitle = () => handleAICorrection({ mode: "subtitle", value: subtitle, setValue: setSubtitle, setCorrection: setSubtitleCorrection });
  const undoSubtitle = () => undoCorrection(subtitleCorrection, setSubtitle, setSubtitleCorrection);

  // --- Code block handlers ---
  const addCodeBlock = () => {
    if (codeBlocks.length >= 15) {
      toast.warn("🚧 Max 15 code blocks allowed", { transition: Bounce });
      return;
    }
    setCodeBlocks((prev) => [...prev, { id: uuidv4(), description: "", code: "", language: "", prevCode: "", loading: false }]);
  };
  const removeCodeBlock = (id) => setCodeBlocks((prev) => prev.filter((b) => b.id !== id));
  const updateCodeBlock = (id, key, value) => setCodeBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, [key]: value } : b)));

  const handlePromptClick = (blockId) => setPromptPopup({ open: true, blockId });
  const handleGenerateFromPrompt = async (prompt) => {
    const blockId = promptPopup.blockId;
    if (!blockId) return;
    const block = codeBlocks.find((b) => b.id === blockId);
    updateCodeBlock(blockId, "loading", true);
    updateCodeBlock(blockId, "prevCode", block.code);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode: "generate" }),
      });
      const data = await res.json();
      updateCodeBlock(blockId, "code", stripCodeFences(data.text || ""));
      updateCodeBlock(blockId, "language", data.language || "");
      toast.success("✅ Code generated from prompt!", { transition: Bounce });
    } catch {
      toast.error("❌ AI failed to generate code from prompt", { transition: Bounce });
    } finally {
      updateCodeBlock(blockId, "loading", false);
      setPromptPopup({ open: false, blockId: null });
    }
  };

  const handleGenDescription = async (blockId) => {
    const block = codeBlocks.find((b) => b.id === blockId);
    if (!block?.code.trim()) {
      toast.warn("Write code first or a hint for description!");
      return;
    }
    setDescLoading((dl) => ({ ...dl, [blockId]: true }));
    setDescPrev((dp) => ({ ...dp, [blockId]: block.description }));
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: block.code, mode: "description" }),
      });
      const data = await res.json();
      updateCodeBlock(blockId, "description", data.text || block.description);
    } catch {
      toast.error("❌ AI failed to generate description");
    } finally {
      setDescLoading((dl) => ({ ...dl, [blockId]: false }));
    }
  };
  const undoDesc = (blockId) => {
    if (descPrev[blockId] !== undefined) {
      updateCodeBlock(blockId, "description", descPrev[blockId]);
      setDescPrev((dp) => ({ ...dp, [blockId]: undefined }));
    }
  };

  const handleAI = async (blockId) => {
    const block = codeBlocks.find((b) => b.id === blockId);
    if (!block?.code.trim()) return toast.warn("Write some code first!");
    updateCodeBlock(blockId, "loading", true);
    updateCodeBlock(blockId, "prevCode", block.code);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: block.code, mode: "autocorrect" }),
      });
      const data = await res.json();
      updateCodeBlock(blockId, "code", stripCodeFences(data.generated_code || ""));
      updateCodeBlock(blockId, "language", data.language || block.language || "");
      toast.success("✅ Code autocorrected!", { transition: Bounce });
    } catch {
      toast.error("❌ AI failed to autocorrect code");
    } finally {
      updateCodeBlock(blockId, "loading", false);
    }
  };
  const undoCode = (blockId) => {
    const block = codeBlocks.find((b) => b.id === blockId);
    if (block?.prevCode !== undefined) updateCodeBlock(blockId, "code", block.prevCode);
    updateCodeBlock(blockId, "prevCode", "");
  };

  // --- Submit ---
  const handleSubmit = () => {
    if (!image || !title.trim()) return toast.error("❌ Image and title are required!", { transition: Bounce });
    if (codeBlocks.every((b) => !b.code.trim() && !b.description.trim()))
      return toast.error("❌ Please add at least one code block", { transition: Bounce });
    if (loading) return;
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        title,
        subtitle,
        visibility,
        cover_image: image,
        blocks: codeBlocks.map(({ id, description, code, language }) => ({ id, description, code, language })),
        sharedUsernames: visibility === "private" ? sharedUsernames : [],
        template_id: initialData?.id,
      };
      const res = await fetch(`/api/template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Submit failed");
      toast.success(initialData?.id ? "Template updated!" : "Template submitted!", { transition: Bounce });
      if (onSuccess) onSuccess(data.data);
      setShowConfirm(false);
    } catch (err) {
      toast.error(err.message || "Failed to submit template", { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  return {
    // state
    title, setTitle,
    subtitle, setSubtitle,
    visibility, setVisibility,
    image, setImage,
    codeBlocks, setCodeBlocks,
    loading, setLoading,
    showConfirm, setShowConfirm,
    showPreview, setShowPreview,
    titleCorrection, subtitleCorrection,
    descLoading, descPrev, promptPopup, setPromptPopup,
    sharedUsernames, setSharedUsernames,

    // handlers
    handleAICorrectTitle, undoTitle,
    handleAICorrectSubtitle, undoSubtitle,
    addCodeBlock, removeCodeBlock, updateCodeBlock,
    handleSubmit, confirmSubmit,
    handlePromptClick, handleGenerateFromPrompt,
    handleGenDescription, undoDesc,
    handleAI, undoCode
  };
}
