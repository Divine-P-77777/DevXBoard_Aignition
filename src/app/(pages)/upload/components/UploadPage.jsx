"use client";
import React, { useState, useEffect } from "react";
import UploadTemplatePage from "./UploadTemplatePage";
import { toast, Bounce } from "react-toastify";
import { Loader2, Eye, Share2, Edit2, Trash2, Plus, Check, X, Lock, Globe } from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import Link from "next/link";
import { useSelector } from "react-redux";


export default function UploadPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
const  { user } = useAuth();

    const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // Fetch templates on load/refresh
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
     const res = await fetch(`/api/template?user_id=${user.id}`); // GET returns all user templates
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      await fetch(`/api/template/${id}`, { method: "DELETE" });
      setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
      toast.success("Template deleted!", { transition: Bounce });
    } catch {
      toast.error("Delete failed");
    }
  };

  // Handle visibility toggle
  const handleToggleVisibility = async (tpl) => {
    const newVisibility = tpl.visibility === "public" ? "private" : "public";
    try {
      await fetch(`/api/template/${tpl.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: newVisibility }),
      });
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === tpl.id ? { ...t, visibility: newVisibility } : t
        )
      );
      toast.success(`Visibility set to ${newVisibility}`);
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  // Handle edit
  const handleEdit = (tpl) => {
    setEditTemplate(tpl);
    setShowUploader(true);
  };

  // Handle create
  const handleCreate = () => {
    setEditTemplate(null);
    setShowUploader(true);
  };

  // After create/edit, refresh table and hide uploader
  const handleUploaderSuccess = () => {
    setShowUploader(false);
    setEditTemplate(null);
    fetchTemplates();
  };

  // Table Row
  const renderRow = (tpl) => (
    <tr key={tpl.id} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2 px-3">{tpl.title}</td>
      <td className="py-2 px-3">
        <div className="w-16 h-9 bg-gray-200 rounded overflow-hidden border">
          {tpl.cover_image && (
            <img src={tpl.cover_image} alt="banner" className="object-cover w-full h-full" />
          )}
        </div>
      </td>
      <td className="py-2 px-3 text-center">
        <button
          onClick={() => handleToggleVisibility(tpl)}
          className={`px-3 py-1 rounded transition ${
            tpl.visibility === "public"
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-600"
          }`}
          title={tpl.visibility === "public" ? "Set Private" : "Set Public"}
        >
          {tpl.visibility === "public" ? <Globe size={18} /> : <Lock size={18} />}
        </button>
      </td>
      <td className="py-2 px-3 text-center">
        <Link
          href={`/template/view/${tpl.id}`}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          title="View"
        >
          <Eye size={18} />
        </Link>
      </td>
      <td className="py-2 px-3 text-center">
        <button
          onClick={() => {
            if (tpl.visibility !== "public") {
              toast.warn("Make it public to share with community!", { transition: Bounce });
              return;
            }
            window.open(`/community/${tpl.id}`, "_blank");
          }}
          className="text-indigo-600 hover:underline"
          title="Share"
        >
          <Share2 size={18} />
        </button>
      </td>
      <td className="py-2 px-3 text-center flex gap-2 justify-center">
        <button onClick={() => handleEdit(tpl)} className="text-yellow-600" title="Edit">
          <Edit2 size={18} />
        </button>
        <button onClick={() => handleDelete(tpl.id)} className="text-red-600" title="Delete">
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="max-w-5xl min-h-screen pt-30 mx-auto p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">Your Templates</h2>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleCreate}
        >
          <Plus size={18} /> Post Template Now
        </button>
      </div>

      {/* Modal/Uploader */}
      {showUploader && (
        <div className="mb-6 border rounded-lg p-4 bg-white shadow-md">
          <UploadTemplatePage
            initialData={editTemplate}
            onSuccess={handleUploaderSuccess}
            onCancel={() => {
              setShowUploader(false);
              setEditTemplate(null);
            }}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left">Title</th>
              <th className="py-2 px-3 text-left">Banner</th>
              <th className="py-2 px-3 text-center">Visibility</th>
              <th className="py-2 px-3 text-center">View</th>
              <th className="py-2 px-3 text-center">Share</th>
              <th className="py-2 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto" size={28} />
                </td>
              </tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No templates found. Start by posting your first template!
                </td>
              </tr>
            ) : (
              templates.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}