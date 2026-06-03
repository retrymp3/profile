"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CommandPaletteTrigger } from "@/components/command-palette";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--bg)_72%,transparent)]">
      <nav className="mx-auto flex max-w-[980px] items-center justify-between gap-3 px-6 py-3">
        <Link
          href="/"
          className="shrink-0 text-[21px] font-semibold tracking-tight text-[var(--text)]"
        >
          Achuth V P
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "text-xs font-normal transition-opacity",
                  pathname === href
                    ? "text-[var(--text)] opacity-100"
                    : "text-[var(--text-muted)] opacity-80 hover:opacity-100"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <CommandPaletteTrigger />

          <button
            type="button"
            className="p-2 text-[var(--text)] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-4 md:hidden">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block py-2.5 text-[17px]",
                  pathname === href ? "text-[var(--accent)]" : "text-[var(--text)]"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
