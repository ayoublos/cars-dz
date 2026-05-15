"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OwnerEditCarLink({
  carId,
  ownerUserId,
  lang,
}: {
  carId: number;
  ownerUserId: string | null;
  lang: Lang;
}) {
  const [session, setSession] = useState<Session | null | undefined>(
    undefined,
  );

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

  const canEdit =
    !!session?.user?.id &&
    !!ownerUserId &&
    session.user.id === ownerUserId;

  if (session === undefined || !canEdit) return null;

  return (
    <Link
      href={`/cars/${carId}/edit`}
      className="inline-flex min-w-0 flex-1 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
    >
      {t.carDetails.editListing[lang]}
    </Link>
  );
}
