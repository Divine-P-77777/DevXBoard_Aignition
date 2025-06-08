"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
// import Popup from "@/components/ui/Popup";

const Navbar = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const glassStyle = isDark
    ? "bg-black/30 border border-cyan-500 text-white"
    : "bg-white/70 border border-cyan-400 text-black";

  const navBtnStyle = (path) => {
    const isActive = path === router.pathname;
    return `px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
      isActive
        ? "bg-gradient-to-r from-cyan-500 to-red-500 text-white shadow-lg"
        : isDark
        ? "hover:bg-cyan-500/20 text-white"
        : "hover:bg-cyan-100 text-black"
    } hover:scale-105`;
  };

  const handleProtectedRoute = (path) => {
    if (!user) {
      alert("Please login first");
      router.push("/auth");
    } else {
      router.push(path);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowLogoutPopup(false);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] px-4 py-3 rounded-full shadow-md backdrop-blur-2xl transition-all duration-300 ${
        glassStyle
      } ${scrolled ? "shadow-lg" : ""}`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight flex items-center gap-2"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/5220/5220478.png" className="w-8 h-8 rounded-full" alt="Logo" />
          <span>DevXBoard</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => router.push("/")} className={navBtnStyle("/")}>Home</button>
          <button onClick={() => handleProtectedRoute("/upload")} className={navBtnStyle("/upload")}>Upload</button>
          <button onClick={() => handleProtectedRoute("/template")} className={navBtnStyle("/template")}>Templates</button>
          <button onClick={() => handleProtectedRoute("/url-store")} className={navBtnStyle("/url-store")}>URLs</button>
          <button onClick={() => router.push("/community")} className={navBtnStyle("/community")}>Community</button>

          <button onClick={() => dispatch(toggleDarkMode())} className="rounded-full p-1 hover:scale-105 transition">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <button
              onClick={() => setShowLogoutPopup(true)}
              className="text-red-500 hover:underline text-sm"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth" className="text-cyan-600 hover:underline text-sm">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => dispatch(toggleDarkMode())}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
      
      <motion.div
  initial={{ x: "-100%" }}
  animate={{ x: 0 }}
  exit={{ x: "-100%" }}
  transition={{ type: "spring", stiffness: 70, damping: 18 }}
  className={`fixed top-0 left-0  z-50 p-6 pt-16
    ${isDark ? "bg-black" : "bg-white"} backdrop-blur-2xl
    border-r ${isDark ? "border-cyan-500" : "border-cyan-400"}
    ${isDark ? "text-white" : "text-black"} shadow-xl rounded-r-2xl`}
>
              <ul className="flex flex-col gap-6 text-base">
                <li><Link href="/" onClick={() => setMenuOpen(false)} className={navBtnStyle("/")}>Home</Link></li>
                <li><button onClick={() => { handleProtectedRoute("/upload"); setMenuOpen(false); }} className={navBtnStyle("/upload")}>Upload</button></li>
                <li><button onClick={() => { handleProtectedRoute("/template"); setMenuOpen(false); }} className={navBtnStyle("/template")}>Templates</button></li>
                <li><button onClick={() => { handleProtectedRoute("/url-store"); setMenuOpen(false); }} className={navBtnStyle("/url-store")}>URLs</button></li>
                <li><Link href="/community" onClick={() => setMenuOpen(false)} className={navBtnStyle("/community")}>Community</Link></li>
                <li>
                  {user ? (
                    <button onClick={() => { setShowLogoutPopup(true); setMenuOpen(false); }} className="text-cyan-500 hover:underline">Logout</button>
                  ) : (
                    <Link href="/auth" onClick={() => setMenuOpen(false)} className="text-cyan-600 hover:underline">Login</Link>
                  )}
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <Popup isOpen={showLogoutPopup} onClose={() => setShowLogoutPopup(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 w-full max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Confirm Logout</h2>
            <p className="mb-6 dark:text-gray-300">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
              <button onClick={() => setShowLogoutPopup(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        </Popup>
      )}
    </nav>
  );
};

export default Navbar;
