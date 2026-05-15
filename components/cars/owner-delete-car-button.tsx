"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OwnerDeleteCarButton({
  carId,
  ownerUserId,
  lang,
  compact = false,
}: {
  carId: number;
  ownerUserId: string | null;
  lang: Lang;
  compact?: boolean;
}) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(
    undefined,
  );
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setSession(data.session ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const canDelete =
    !!session?.user?.id &&
    !!ownerUserId &&
    session.user.id === ownerUserId;

  if (session === undefined || !canDelete) return null;

  const onDelete = async () => {
    if (!window.confirm(t.carDetails.deleteConfirm[lang])) return;
    setErrorMessage(null);
    setBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("cars").delete().eq("id", carId);
      if (error) throw error;
      router.push("/cars");
      router.refresh();
    } catch (e: unknown) {
      setErrorMessage(
        e instanceof Error ? e.message : t.carDetails.deleteFailed[lang],
      );
    } finally {
      setBusy(false);
    }
  };

  const buttonClass = compact
    ? "absolute right-2 top-2 z-10 rounded-full border border-red-200 bg-white/95 px-2.5 py-1 text-xs font-semibold text-red-700 shadow-sm backdrop-blur hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:bg-zinc-950/95 dark:text-red-300 dark:hover:bg-red-950/40"
    : "w-full rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800 transition-colors hover:bg-red-100 disabled:opacity-60 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200 dark:hover:bg-red-950/50";

  const label = busy ? t.carDetails.deleting[lang] : t.carDetails.deleteListing[lang];

  const button = (
    <button
      type="button"
      disabled={busy}
      onClick={(e) => {
        e.preventDefault();
        void onDelete();
      }}
      className={buttonClass}
    >
      {label}
    </button>
  );

  if (compact) {
    return (
      <>
        {errorMessage ? (
          <p
            className="absolute bottom-14 left-2 right-2 z-20 rounded border border-red-200 bg-white/95 px-2 py-1 text-center text-[11px] font-medium text-red-700 shadow dark:border-red-900/60 dark:bg-zinc-950/95 dark:text-red-300"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
        {button}
      </>
    );
  }

  return (
    <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
      {errorMessage ? (
        <p className="mb-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {button}
    </div>
  );
}
