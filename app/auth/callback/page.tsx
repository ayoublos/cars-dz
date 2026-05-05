"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Completing sign-in…");

  useEffect(() => {
    let isActive = true;

    async function run() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!isActive) return;
        if (!data.session) {
          setMessage("No active session. Redirecting to login…");
          router.replace("/login");
          return;
        }

        router.replace("/cars");
        router.refresh();
      } catch (err: unknown) {
        if (!isActive) return;
        setMessage(err instanceof Error ? err.message : "Sign-in failed.");
        setTimeout(() => {
          router.replace("/login");
        }, 800);
      }
    }

    run();
    return () => {
      isActive = false;
    };
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 text-center dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Signing you in
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </p>
      </div>
    </div>
  );
}

