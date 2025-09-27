"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun, Menu, X, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmPopup from "@/components/ui/Popup";
import supabase from "@/libs/supabase/client";

const Navbar = () => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, pic")
          .eq("id", user.id)
          .single();
        if (!error && data) setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  const glassStyle = isDark
    ? "bg-black/40 border border-pink-200 text-white"
    : "bg-white/80 border border-purple-300 text-black";

  const navBtnStyle = (path) => {
    const isActive = path === router.pathname;
    return `px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
      isActive
        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
        : isDark
        ? "hover:bg-purple-500/20 text-white"
        : "hover:bg-pink-100 text-black"
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
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-[92%] px-4 py-2 rounded-full shadow-md backdrop-blur-2xl transition-all duration-300 ${glassStyle} ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight flex items-center gap-2"
        >
          <img
            src="/favicon.png"
            className="w-12 h-12  border-purple-400 "
            alt="Logo"
          />
          <span className="bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent">
            DevXBoard
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => router.push("/")} className={navBtnStyle("/")}>
            Home
          </button>
          <button
            onClick={() => handleProtectedRoute("/upload")}
            className={navBtnStyle("/upload")}
          >
            Upload
          </button>
          <button
            onClick={() => handleProtectedRoute("/template")}
            className={navBtnStyle("/template")}
          >
            Templates
          </button>
          <button
            onClick={() => handleProtectedRoute("/url-store")}
            className={navBtnStyle("/url-store")}
          >
            URLs
          </button>
          <button
            onClick={() => router.push("/community")}
            className={navBtnStyle("/community")}
          >
            Community
          </button>

          {/* Dark/Light toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="rounded-full p-1 hover:scale-105 transition text-purple-500 dark:text-pink-400"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile / Auth */}
          {profile ? (
            <Link href="/myprofile" title="My Profile">
              <img
                src={profile.pic || "/default-avatar.png"}
                className="w-8 h-8 rounded-full object-cover border border-purple-400 hover:scale-105 transition"
                alt="Profile"
              />
            </Link>
          ) : user ? (
            <Link href="/myprofile" title="My Profile">
              <User
                size={20}
                className="text-purple-500 hover:text-pink-500 transition"
              />
            </Link>
          ) : (
            <Link
              href="/auth"
              className="text-purple-600 hover:underline text-sm"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile nav toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => dispatch(toggleDarkMode())}>
            {isDark ? (
              <Sun size={20} className="text-pink-400" />
            ) : (
              <Moon size={20} className="text-purple-500" />
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X size={22} className="text-pink-500" />
            ) : (
              <Menu size={22} className="text-purple-500" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 70, damping: 18 }}
            className={`fixed top-0 left-0 z-50 p-6 pt-20 w-64
              ${isDark ? "bg-black" : "bg-white"} backdrop-blur-2xl
              border-r ${isDark ? "border-pink-400" : "border-purple-300"}
              ${isDark ? "text-white" : "text-black"} shadow-xl rounded-r-2xl`}
          >
            <ul className="flex flex-col gap-4 text-base">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={navBtnStyle("/")}
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleProtectedRoute("/upload");
                    setMenuOpen(false);
                  }}
                  className={navBtnStyle("/upload")}
                >
                  Upload
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleProtectedRoute("/template");
                    setMenuOpen(false);
                  }}
                  className={navBtnStyle("/template")}
                >
                  Templates
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleProtectedRoute("/url-store");
                    setMenuOpen(false);
                  }}
                  className={navBtnStyle("/url-store")}
                >
                  URLs
                </button>
              </li>
              <li>
                <Link
                  href="/community"
                  onClick={() => setMenuOpen(false)}
                  className={navBtnStyle("/community")}
                >
                  Community
                </Link>
              </li>
              <li>
                {profile ? (
                  <Link
                    href="/myprofile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={profile.pic || "/default-avatar.png"}
                      className="w-8 h-8 rounded-full object-cover border border-purple-400"
                      alt="Profile"
                    />
                    <span>{profile.username || "My Profile"}</span>
                  </Link>
                ) : user ? (
                  <Link
                    href="/myprofile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-purple-500"
                  >
                    <User size={20} /> <span>My Profile</span>
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="text-pink-600 hover:underline"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <ConfirmPopup
            visible={true}
            onCancel={() => setShowLogoutPopup(false)}
            onConfirm={handleLogout}
            title="Confirm Logout"
            message="Are you sure you want to log out?"
            confirmText="Logout"
            cancelText="Cancel"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
