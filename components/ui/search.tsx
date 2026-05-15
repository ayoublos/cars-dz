"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function SearchForm({
  placeholder,
  buttonLabel,
  listingBasePath,
}: {
  placeholder: string;
  buttonLabel: string;
  listingBasePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      const q = query.trim();
      if (q) params.set("q", q);
      else params.delete("q");
      const qs = params.toString();
      router.push(qs ? `${listingBasePath}?${qs}` : listingBasePath);
    },
    [query, router, listingBasePath, searchParams],
  );

  return (
    <div className="flex w-full justify-center px-4 py-4">
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-xl items-center gap-2 sm:max-w-2xl"
        role="search"
      >
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600/40"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}

export default function Search({
  placeholder = "Search cars…",
  buttonLabel = "Search",
  listingBasePath = "/cars",
}: {
  placeholder?: string;
  buttonLabel?: string;
  /** Where search results live (`/` on home, `/cars` on cars page). */
  listingBasePath?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex w-full justify-center px-4 py-4">
          <div className="h-10 w-full max-w-xl animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 sm:max-w-2xl" />
        </div>
      }
    >
      <SearchForm
        placeholder={placeholder}
        buttonLabel={buttonLabel}
        listingBasePath={listingBasePath}
      />
    </Suspense>
  );
}
