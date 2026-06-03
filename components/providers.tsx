"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  useClearance,
  type ClearanceContextValue,
} from "@/hooks/use-clearance";
import { CommandPaletteProvider } from "@/components/command-palette";

const ClearanceContext = createContext<ClearanceContextValue | null>(null);

export function ClearanceProvider({ children }: { children: ReactNode }) {
  const clearance = useClearance();
  return (
    <ClearanceContext.Provider value={clearance}>
      {children}
    </ClearanceContext.Provider>
  );
}

export function useClearanceContext(): ClearanceContextValue {
  const ctx = useContext(ClearanceContext);
  if (!ctx) {
    throw new Error("useClearanceContext must be used within ClearanceProvider");
  }
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClearanceProvider>
      <CommandPaletteProvider>{children}</CommandPaletteProvider>
    </ClearanceProvider>
  );
}
