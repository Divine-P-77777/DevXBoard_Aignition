"use client";
import { useSelector } from "react-redux";
import { useTemplateForm } from "@/hooks/useTemplateForm";
import TemplatePreview from "./TemplatePreview";
import CodePromptPopup from "./CodePromptPopup";
import RectangleCloudinary from "@/libs/RectangleCloudinary";
import { Plus, Upload, Sparkles, Loader2 } from "lucide-react";
import { CodeBlocksSection, TitleSection, VisibilitySection } from "./subcomponent/SubSection";

export default function UploadTemplatePage({ initialData, onSuccess, onCancel }) {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const {
        // state
        showPreview,
        promptPopup,
        showConfirm,
        image,
        title,
        subtitle,
        visibility,
        codeBlocks,
        titleCorrection,
        subtitleCorrection,
        descLoading,
        descPrev,
        loading,

        // setters/handlers
        setImage,
        setShowPreview,
        setShowConfirm,
        setPromptPopup,
        setTitle,
        setSubtitle,
        setVisibility,

        handleAICorrectTitle,
        undoTitle,
        handleAICorrectSubtitle,
        undoSubtitle,
        updateCodeBlock,
        removeCodeBlock,
        handleAI,
        handlePromptClick,
        handleGenerateFromPrompt,
        undoCode,
        handleGenDescription,
        undoDesc,
        addCodeBlock,
        handleSubmit,
        confirmSubmit,
    } = useTemplateForm(initialData, onSuccess, onCancel);

    if (showPreview) {
        return <TemplatePreview {...{ title, subtitle, visibility, image, codeBlocks }} />;
    }

    return (
        <>
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className={`p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
                        <h2 className="text-xl font-bold mb-2">Confirm Submission</h2>
                        <p>
                            Are you sure you want to {initialData && initialData.id ? "update" : "submit"} this template?
                        </p>
                        <div className="mt-4 flex gap-2 justify-end">
                            <button
                                onClick={confirmSubmit}
                                disabled={loading}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {loading ? <Loader2 className="animate-spin inline-block" size={16} /> : "Confirm"}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Code Prompt Popup */}
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
                <div className={`max-w-5xl mx-auto pt-30 p-6 space-y-6 
                    ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
                    <div>
                        {typeof onCancel === "function" && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="ml-4 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                    {/* Header */}
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        Submit a Template <Sparkles className="text-yellow-500" />
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Share your code snippets & templates with the community. Make it public or keep it private.
                    </p>

                    {/* Cover Image */}
                    <div className="space-y-2">
                        <RectangleCloudinary
                            onUpload={(url) => setImage(url)}
                            initialUrl={image}
                        />
                        {image && (
                            <div className="text-green-500 text-sm mt-2 flex items-center gap-1">
                                 Cover uploaded successfully
                            </div>
                        )}
                    </div>

                    {/* Preview Button */}
                    <button
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
                        onClick={() => setShowPreview(true)}
                    >
                        Preview
                    </button>

                    {/* Title & Subtitle */}
                    <TitleSection
                        title={title}
                        setTitle={setTitle}
                        handleAICorrectTitle={handleAICorrectTitle}
                        titleCorrection={titleCorrection}
                        undoTitle={undoTitle}
                        subtitle={subtitle}
                        setSubtitle={setSubtitle}
                        handleAICorrectSubtitle={handleAICorrectSubtitle}
                        subtitleCorrection={subtitleCorrection}
                        undoSubtitle={undoSubtitle}
                    />

                    {/* Visibility */}
                    <VisibilitySection
                        visibility={visibility}
                        setVisibility={setVisibility}
                    />

                    {/* Code Blocks */}
                    <CodeBlocksSection
                        codeBlocks={codeBlocks}
                        updateCodeBlock={updateCodeBlock}
                        removeCodeBlock={removeCodeBlock}
                        handleAI={handleAI}
                        handlePromptClick={handlePromptClick}
                        isDarkMode={isDarkMode}
                        undoCode={undoCode}
                        descLoading={descLoading}
                        descPrev={descPrev}
                        handleGenDescription={handleGenDescription}
                        undoDesc={undoDesc}
                    />

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