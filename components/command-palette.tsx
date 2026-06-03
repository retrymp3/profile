"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  FileText,
  User,
  Briefcase,
  PenLine,
  Mail,
  Code2,
  ExternalLink,
  Download,
  Search,
} from "lucide-react";
import { getProfile } from "@/lib/profile";
import { useClearanceContext } from "@/components/providers";

const profile = getProfile();

type CommandPaletteContextValue = {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null
);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return ctx;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  const { addXP } = useClearanceContext();

  openRef.current = open;

  const openPalette = useCallback(() => {
    if (!openRef.current) addXP(10);
    setOpen(true);
  }, [addXP]);

  const closePalette = useCallback(() => setOpen(false), []);

  const togglePalette = useCallback(() => {
    if (!openRef.current) addXP(10);
    setOpen((prev) => !prev);
  }, [addXP]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const willOpen = !openRef.current;
        if (willOpen) addXP(10);
        setOpen(willOpen);
      }
      if (e.key === "Escape" && openRef.current) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [addXP]);

  return (
    <CommandPaletteContext.Provider
      value={{ open, openPalette, closePalette, togglePalette }}
    >
      {children}
      <CommandPaletteDialog open={open} onClose={closePalette} />
    </CommandPaletteContext.Provider>
  );
}

function CommandPaletteDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const run = useCallback(
    (fn: () => void) => {
      onClose();
      fn();
    },
    [onClose]
  );

  const copyEmail = () => {
    void navigator.clipboard.writeText(profile.email);
  };

  if (!open) return null;

  return (
    <div className="cmdk-overlay fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close command palette"
        onClick={onClose}
      />
      <Command
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl apple-card shadow-2xl"
        label="Command menu"
      >
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-3">
          <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          <Command.Input
            placeholder="Search commands…"
            className="flex-1 bg-transparent py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--text-muted)]">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Navigate"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--accent)]"
          >
            <CommandItem
              icon={<FileText className="h-4 w-4" />}
              onSelect={() => run(() => router.push("/"))}
            >
              Home
            </CommandItem>
            <CommandItem
              icon={<User className="h-4 w-4" />}
              onSelect={() => run(() => router.push("/about"))}
            >
              About
            </CommandItem>
            <CommandItem
              icon={<Briefcase className="h-4 w-4" />}
              onSelect={() => run(() => router.push("/experience"))}
            >
              Experience
            </CommandItem>
            <CommandItem
              icon={<PenLine className="h-4 w-4" />}
              onSelect={() => run(() => router.push("/writing"))}
            >
              Writing
            </CommandItem>
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[var(--accent)]"
          >
            <CommandItem icon={<Mail className="h-4 w-4" />} onSelect={() => run(copyEmail)}>
              Copy email
            </CommandItem>
            <CommandItem
              icon={<Code2 className="h-4 w-4" />}
              onSelect={() => run(() => window.open(profile.links.github, "_blank"))}
            >
              Open GitHub
            </CommandItem>
            <CommandItem
              icon={<ExternalLink className="h-4 w-4" />}
              onSelect={() => run(() => window.open(profile.links.linkedin, "_blank"))}
            >
              Open LinkedIn
            </CommandItem>
            <CommandItem
              icon={<Download className="h-4 w-4" />}
              onSelect={() => run(() => window.open(profile.links.resume, "_blank"))}
            >
              Download resume
            </CommandItem>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}

function CommandItem({
  children,
  onSelect,
  icon,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-[var(--text)] aria-selected:bg-[var(--bg-secondary)] aria-selected:text-[var(--accent)]"
    >
      <span className="text-[var(--text-muted)]">{icon}</span>
      {children}
    </Command.Item>
  );
}

export function CommandPaletteTrigger() {
  const { openPalette } = useCommandPalette();
  const [modKey, setModKey] = useState("⌘");

  useEffect(() => {
    const isMac =
      typeof navigator !== "undefined" &&
      /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    setModKey(isMac ? "⌘" : "Ctrl");
  }, []);

  return (
    <button
      type="button"
      onClick={openPalette}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[13px] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
      aria-label="Open search and commands"
    >
      <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="hidden sm:inline">Search</span>
      <kbd className="rounded-md bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-subtle)]">
        {modKey}K
      </kbd>
    </button>
  );
}
