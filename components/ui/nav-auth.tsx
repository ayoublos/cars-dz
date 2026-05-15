"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function NavAuth({
  lang,
  linkClassName,
}: {
  lang: Lang;
  linkClassName: string;
}) {
  const router = useRouter();
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

  if (session === undefined) {
    return (
      <span
        className={`${linkClassName} pointer-events-none opacity-40`}
        aria-hidden
      >
        …
      </span>
    );
  }

  if (session) {
    return (
      <button
        type="button"
        className={linkClassName}
        onClick={async () => {
          await getSupabaseBrowserClient().auth.signOut();
          router.refresh();
        }}
      >
        {t.nav.logOut[lang]}
      </button>
    );
  }

  return (
    <Link href="/login" className={linkClassName}>
      {t.nav.signIn[lang]}
    </Link>
  );
}
