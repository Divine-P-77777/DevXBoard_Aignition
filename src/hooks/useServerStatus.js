import { useEffect, useState, useRef } from "react";

export function useServerStatus() {
  const [serverDown, setServerDown] = useState(false);
  const notified = useRef(false); 

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
        });

        if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);

        setServerDown(false);
      } catch (err) {
        console.error("Supabase connection failed:", err.message);
        setServerDown(true);

        if (!notified.current) {
          notified.current = true;

          fetch("/api/notify-server-down", { method: "POST" })
            .then(() => console.log("Admin notified ✔"))
            .catch(() => console.log("Notification failed ❌"));
        }
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000);

    return () => clearInterval(interval);
  }, []);

  return serverDown;
}
