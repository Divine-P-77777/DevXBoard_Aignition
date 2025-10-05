"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast, Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Helper to strip code fences
function stripCodeFences(str) {
  if (!str) return "";
  // Removes triple backtick blocks, with or without language
  return str.replace(/^```[\w\s]*\n?([\s\S]*?)\n?```$/gm, '$1').trim();
}

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
          ? initialData.blocks.map((b) => ({
            ...b,
            id: b.id || uuidv4(),
            loading: false,
            prevCode: "",
          }))
          : [{ id: uuidv4(), description: "", code: "", loading: false, language: "", prevCode: "" }]
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

  // --- Title/Sub AI ---
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
      setTitleCorrection((c) => ({ ...c, ai: data.title || "", loading: false, showUndo: true }));
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

  // --- Subtitle AI ---
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

  // --- Code Block CRUD ---
  const addCodeBlock = () => {
    if (codeBlocks.length >= 15) {
      toast.warn("🚧 Max 15 code blocks allowed", { transition: Bounce });
      return;
    }
    setCodeBlocks([
      ...codeBlocks,
      { id: uuidv4(), description: "", code: "", loading: false, language: "", prevCode: "" },
    ]);
  };

  const removeCodeBlock = (id) => setCodeBlocks((prev) => prev.filter((b) => b.id !== id));
  const updateCodeBlock = (id, key, value) =>
    setCodeBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, [key]: value } : b)));

  // --- Prompt click handler ---
  const handlePromptClick = (blockId) => {
    setPromptPopup({ open: true, blockId });
  };

  // --- Generate code from prompt ---
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
      // Remove code fences if present
      const strippedCode = stripCodeFences(data.text || "");
      updateCodeBlock(blockId, "code", strippedCode);
      updateCodeBlock(blockId, "language", data.language || "");
      toast.success("✅ Code generated from prompt!", { transition: Bounce });
    } catch (err) {
      toast.error("❌ AI failed to generate code from prompt");
    } finally {
      updateCodeBlock(blockId, "loading", false);
      setPromptPopup({ open: false, blockId: null });
    }
  };

  // --- Description handler ---
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

  // --- Undo Description ---
  const undoDesc = (blockId) => {
    if (descPrev[blockId] !== undefined) {
      updateCodeBlock(blockId, "description", descPrev[blockId]);
      setDescPrev(dp => ({ ...dp, [blockId]: undefined }));
    }
  };

  // --- AI Autocorrect for code ---
  const handleAI = async (blockId) => {
    const block = codeBlocks.find((b) => b.id === blockId);
    if (!block || !block.code.trim()) {
      toast.warn("Write some code first!");
      return;
    }
    updateCodeBlock(blockId, "loading", true);
    updateCodeBlock(blockId, "prevCode", block.code);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: block.code, mode: "autocorrect" }),
      });
      const data = await res.json();
      // Remove code fences if present
      const strippedCode = stripCodeFences(data.generated_code || "");
      updateCodeBlock(blockId, "code", strippedCode);
      updateCodeBlock(blockId, "language", data.language || block.language || "");
      toast.success("✅ Code autocorrected!", { transition: Bounce });
    } catch (err) {
      toast.error("❌ AI failed to autocorrect code");
    } finally {
      updateCodeBlock(blockId, "loading", false);
    }
  };

  // --- Undo code change ---
  const undoCode = (blockId) => {
    const block = codeBlocks.find((b) => b.id === blockId);
    if (block && block.prevCode !== undefined) {
      updateCodeBlock(blockId, "code", block.prevCode);
      updateCodeBlock(blockId, "prevCode", "");
    }
  };

  // --- Submit handler ---
  const handleSubmit = () => {
    if (!image || !title.trim()) {
      toast.error("❌ Image and title are required!", { transition: Bounce });
      return;
    }
    if (codeBlocks.every((b) => !b.code.trim() && !b.description.trim())) {
      toast.error("❌ Please add at least one code block with code or description.", { transition: Bounce });
      return;
    }
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
        blocks: codeBlocks.map(({ id, description, code, language }) => ({
          id, description, code, language,
        })),
        template_id: initialData && initialData.id ? initialData.id : undefined, // include for update
      };
      const res = await fetch(`/api/template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          initialData && initialData.id ? " Template updated!" : " Template submitted!",
          { transition: Bounce }
        );
        if (onSuccess) onSuccess(data.data);
        setShowConfirm(false);
      } else {
        throw new Error(data.error || "Submit failed");
      }
    } catch (err) {
      toast.error(` ${err.message || "Failed to submit template"}`, { transition: Bounce });
    } finally {
      setLoading(false);
    }
  };


  const handleAICorrectCode = async (blockId) => {
  const block = codeBlocks.find((b) => b.id === blockId);
  if (!block || !block.code.trim()) {
    toast.warn("Write some code first!");
    return;
  }
  updateCodeBlock(blockId, "loading", true);
  updateCodeBlock(blockId, "prevCode", block.code);
  try {
    const res = await fetch("/api/code-correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: block.code }),
    });
    const data = await res.json();
    updateCodeBlock(blockId, "code", data.corrected_code || "");
    updateCodeBlock(blockId, "language", data.language || block.language || "");
    toast.success("✅ Code autocorrected!", { transition: Bounce });
  } catch (err) {
    toast.error("❌ AI failed to autocorrect code");
  } finally {
    updateCodeBlock(blockId, "loading", false);
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

    // handlers
    handleAICorrectTitle, undoTitle,
    handleAICorrectSubtitle, undoSubtitle,
    addCodeBlock, removeCodeBlock, updateCodeBlock,
    handleSubmit,
    confirmSubmit,
    handlePromptClick,
    handleGenerateFromPrompt,
    handleGenDescription,
    handleAI,
    undoCode,
    undoDesc,
    handleAICorrectCode
  };
}