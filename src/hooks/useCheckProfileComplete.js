import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

const useCheckProfileComplete = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.info("Please log in first.", { transition: Bounce });
      const timer = setTimeout(() => router.push("/auth"), 1500);
      return () => clearTimeout(timer);
    }

    const checkProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const { profile } = await res.json();
        if (!profile?.username || !profile?.pic) {
          toast.info("Please set your username and profile picture first.", { transition: Bounce });
          const timer = setTimeout(() => router.push("/myprofile"), 1500);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    checkProfile();
  }, [user, router]);
};

export default useCheckProfileComplete;
