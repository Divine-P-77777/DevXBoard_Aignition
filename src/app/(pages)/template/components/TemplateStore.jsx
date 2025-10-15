"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/hooks/useAuth";
import TemplateSidebar from "./TemplateSidebar";
import TemplateGrid from "./TemplateGrid";
import { toast, Bounce } from "react-toastify";

export default function TemplateStore() {
  const [templates, setTemplates] = useState({
    myTemplates: [],
    sharedByMe: [],
    sharedWithMe: [],
  });
  const [activeSection, setActiveSection] = useState("myTemplates");
  const [loading, setLoading] = useState(true);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // --- My Templates ---
        const myRes = await fetch("/api/template/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        const myData = await myRes.json();

        // --- Shared by Me ---
        const sharedByMeRes = await fetch("/api/template/shared-by-me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        const sharedByMeData = await sharedByMeRes.json();

        
// --- Shared with Me ---
const sharedWithMeRes = await fetch("/api/template/shared", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user_id: user.id }), // ✅ use id now
});
const sharedWithMeData = await sharedWithMeRes.json();


        const myTemplates = (myData.templates || []).filter(
          (tpl) =>
            tpl.visibility === "private" &&
            (!tpl.sharedUsernames || tpl.sharedUsernames.length === 0) // 🔑 username-based
        );

        const sharedByMe = (sharedByMeData.templates || []).filter(
          (tpl) =>
            tpl.visibility === "private" &&
            tpl.sharedUsernames?.length > 0 // 🔑 username-based
        );

        setTemplates({
          myTemplates,
          sharedByMe,
          sharedWithMe: sharedWithMeData.templates || [],
        });
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, user?.username]);

  const handleEdit = (tpl) => {
    toast.info(`Editing template: ${tpl.title}`, {
      transition: Bounce,
      theme: isDarkMode ? "dark" : "light",
    });
    window.location.href = `/upload?id=${tpl.id}`;
  };

  if (loading)
    return (
      <div
        className={clsx(
          "flex justify-center items-center min-h-screen",
          isDarkMode ? "bg-black text-purple-100" : "bg-purple-50 text-purple-800"
        )}
      >
        <Loader2 className="animate-spin mr-2" /> Loading templates...
      </div>
    );

  const activeTemplates = templates[activeSection] || [];

  return (
    <div
      className={clsx(
        "flex min-h-screen flex-col md:flex-row transition-all",
        isDarkMode ? "bg-black text-purple-100" : "bg-purple-50 text-purple-800"
      )}
    >
      <TemplateSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
      />

      <main className="flex-1 pt-26 p-6">
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
          {activeSection === "myTemplates" && "My Templates (Private)"}
          {activeSection === "sharedByMe" && "Shared by Me"}
          {activeSection === "sharedWithMe" && "Shared with Me"}
        </h1>

        {activeTemplates.length > 0 ? (
          <TemplateGrid
            templates={activeTemplates}
            isDarkMode={isDarkMode}
            activeSection={activeSection}
            onEdit={handleEdit}
          />
        ) : (
          <p className="text-center text-gray-500">No templates found.</p>
        )}
      </main>
    </div>
  );
}
