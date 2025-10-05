"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function InstallPage() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const appInstalledHandler = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div
      className={clsx(
        "min-h-screen py-20 px-4 flex flex-col items-center",
        isDarkMode ? "bg-gray-900 text-purple-100" : "bg-purple-50 text-purple-800"
      )}
    >
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-12 text-center">
        Install Our PWA App
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl w-full justify-center items-start">
        {/* iOS Section */}
        <div className="flex-1 flex flex-col items-center w-full lg:w-auto">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-4">
            <Image
              src="/images/ios-phone.png"
              alt="iOS Phone"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-center">
            iPhone / iPad
          </h2>
          <p className="text-center mb-3 text-sm sm:text-base">
            To install on iOS devices:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm px-4 text-center">
            <li>Open this page in Safari.</li>
            <li>Tap the "Share" button (bottom center).</li>
            <li>Select "Add to Home Screen".</li>
            <li>Confirm to add the app.</li>
          </ol>
          <p className="text-xs sm:text-sm mt-3 text-center text-gray-400">
            To uninstall, tap and hold the app icon, then select "Remove App".
          </p>
        </div>

        {/* Android Section */}
        <div className="flex-1 flex flex-col items-center w-full lg:w-auto">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-4">
            <Image
              src="/images/android-phone.png"
              alt="Android Phone"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-center">
            Android
          </h2>
          <p className="text-center mb-3 text-sm sm:text-base">
            To install on Android devices:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm px-4 text-center">
            <li>Open this page in Chrome.</li>
            <li>Tap "Install" below.</li>
            <li>Confirm the installation.</li>
            <li>The app will appear on your home screen.</li>
          </ol>
          {installed ? (
            <button
              disabled
              className="mt-4 bg-gray-400 text-white py-2 px-6 rounded cursor-not-allowed"
            >
              Installed ✅
            </button>
          ) : (
            <button
              onClick={handleInstall}
              className={clsx(
                "mt-4 py-2 px-6 rounded font-semibold transition-transform hover:scale-105",
                isDarkMode
                  ? "bg-purple-700 text-purple-100 hover:bg-purple-600"
                  : "bg-purple-600 text-white hover:bg-purple-500"
              )}
            >
              Install App
            </button>
          )}
          <p className="text-xs sm:text-sm mt-3 text-center text-gray-400">
            To uninstall, tap and hold the app icon, then select "Uninstall".
          </p>
        </div>
      </div>
    </div>
  );
}
