"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function NavAddCarLink({
  lang,
  className,
}: {
  lang: Lang;
  className: string;
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

  const loginWithNext = `/login?next=${encodeURIComponent("/add-a-car")}`;
  const href = session?.user ? "/add-a-car" : loginWithNext;

  return (
    <Link href={href} className={className}>
      {t.nav.addCar[lang]}
    </Link>
  );
}
