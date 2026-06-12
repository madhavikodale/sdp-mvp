"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // TEMP: Auto-redirect to dashboard for easy testing
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-sdp-bg flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
}
