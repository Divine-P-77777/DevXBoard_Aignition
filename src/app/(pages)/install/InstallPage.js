"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function InstallPage() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isWebAppInstalled, setIsWebAppInstalled] = useState(false);

  // Detect if app is installed and setup PWA prompt
  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator).standalone;

    setIsWebAppInstalled(isStandalone);

    const beforeInstallPromptHandler = (e) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e);
      console.log("✅ beforeinstallprompt event captured");
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert("Install prompt not available. Open in Chrome on Android.");
      return;
    }

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("✅ PWA installed by user");
      setIsWebAppInstalled(true);
    } else {
      console.log("❌ PWA install dismissed");
    }
    setDeferredPrompt(null);
  };

  const handleUninstallPWA = () => {
    alert("To uninstall this app, follow your device's standard procedure.");
  };

  return (
    <div
      className={clsx(
        "min-h-screen py-30 px-4 flex flex-col items-center justify-center transition-colors duration-500",
        isDarkMode ? "bg-gray-900 text-purple-100" : "bg-purple-50 text-purple-800"
      )}
    >
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center">
        Install Our PWA App
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 max-w-4xl w-full justify-center items-center">
        {/* iOS Section */}
        <div className="flex-1 flex flex-col items-center text-center">
          <Image
            src="/images/ios-phone.png"
            alt="iOS Phone"
            width={200}
            height={200}
            className="object-contain mb-4"
          />
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">iPhone / iPad</h2>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Open this page in Safari.</li>
            <li>Tap the “Share” icon at the bottom.</li>
            <li>Select “Add to Home Screen”.</li>
          </ol>
        </div>

        {/* Android Section */}
        <div className="flex-1 flex flex-col items-center text-center">
          <Image
            src="/images/android-phone.png"
            alt="Android Phone"
            width={200}
            height={200}
            className="object-contain mb-4"
          />
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Android</h2>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Open this page in Chrome.</li>
            <li>Tap the button below to install.</li>
            <li>Confirm the installation popup.</li>
          </ol>

          {!isWebAppInstalled ? (
            <div className="px-4 mt-5 w-full flex justify-center">
              <button
                onClick={handleInstallPWA}
                disabled={!deferredPrompt}
                className={clsx(
                  "flex items-center gap-2 py-2 px-6 rounded-lg font-medium transition-colors",
                  deferredPrompt
                    ? "bg-purple-600 text-white hover:bg-purple-500 cursor-pointer"
                    : "bg-gray-400 text-white cursor-not-allowed opacity-50"
                )}
              >
                <span>Install App</span>
                <img
                  src={isDarkMode ? "/install.png" : "/install2.png"}
                  alt="Download Icon"
                  className="w-6 h-6"
                />
              </button>
            </div>
          ) : (
            <div className="px-4 mt-5 w-full flex justify-center">
              <button
                onClick={handleUninstallPWA}
                className="flex items-center gap-2 py-2 px-6 rounded-lg font-medium bg-gray-600 text-white hover:bg-gray-500 transition-colors"
              >
                <span>Uninstall App</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {!isWebAppInstalled && (
        <p className="mt-8 text-sm opacity-70 text-center max-w-md">
          Tip: If the install button doesn’t show a popup, ensure you’re using Chrome on
          Android and your site is served over HTTPS.
        </p>
      )}
    </div>
  );
}
