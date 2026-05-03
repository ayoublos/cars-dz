import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/add-a-car", label: "Add a Car" },
  { href: "/login", label: "Login" },
] as const;

const NAV_LINK_CLASSNAME =
  "rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-700";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/70 dark:bg-black/70">
      <nav
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="font-semibold tracking-tight text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
        >
          Cars DZ
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={NAV_LINK_CLASSNAME}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}