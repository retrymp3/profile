import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { ClearanceChip } from "@/components/clearance-chip";
import { LiveBackground } from "@/components/live-background";
import { ScrollProgress } from "@/components/scroll-progress";
import { getProfile } from "@/lib/profile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const profile = getProfile();

export const metadata: Metadata = {
  title: {
    default: `${profile.name}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.summary.slice(0, 160),
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: `${profile.name} — Application Security`,
    description: profile.title,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="relative min-h-screen antialiased">
        <LiveBackground />
        <ScrollProgress />
        <Providers>
          <Nav />
          <main className="relative z-10 mx-auto max-w-[980px] px-6 py-10 md:py-14">
            {children}
          </main>
          <footer className="relative z-10 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
            <div className="mx-auto max-w-[980px] px-6 py-10 text-center text-xs text-[var(--text-muted)]">
              <p className="font-medium text-[var(--text)]">{profile.name}</p>
              <p className="mt-1">{profile.location}</p>
              <p className="mt-3">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
            </div>
          </footer>
          <ClearanceChip />
        </Providers>
      </body>
    </html>
  );
}
