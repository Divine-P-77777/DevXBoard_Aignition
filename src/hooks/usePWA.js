import { useEffect, useState } from "react";

export const usePWA = () => {
  const [isWebAppInstalled, setIsWebAppInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;

    setIsWebAppInstalled(isStandalone);

    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      console.log("✅ beforeinstallprompt fired");
      setDeferredPrompt(e);
    };

    const appInstalledHandler = () => {
      console.log("✅ App installed");
      setIsWebAppInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert("No install prompt available. Try reloading the page.");
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log("Install choice:", choice.outcome);
    if (choice.outcome === "accepted") {
      setIsWebAppInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleUninstallPWA = () => {
    alert("To uninstall, follow your device's normal uninstall method.");
  };

  return { isWebAppInstalled, handleInstallPWA, handleUninstallPWA };
};
