"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const TaskoriaSasthoRedirect = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRedirect = async () => {
    if (!session?.user) {
      toast.error("Sign in required. Please log in or create an account.");
            setTimeout(() => router.push("/signin"));
      return;
    }

    const loadingToast = toast.loading("Redirecting to Sasto Ticket...");

    try {
      setLoading(true);

      const res = await axios.post("/api/SasthoTicket/redirect");

      const { url } = res.data;

      if (!url) {
        throw new Error("No redirect URL returned");
      }

      toast.dismiss(loadingToast);
      toast.success("Opening Sasto Ticket...");
      window.open(url, "_blank");

    } catch (error: any) {
      toast.dismiss(loadingToast); // ✅ dismiss loading on error too
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRedirect}
      disabled={loading}
      className="block text-gray-600 dark:text-gray-300 
      hover:text-[#3C7DED] dark:hover:text-[#41A6EE] 
      transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Redirecting..." : "Sasto Ticket"}
    </button>
  );
};

export default TaskoriaSasthoRedirect;