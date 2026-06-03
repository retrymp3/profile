"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { formatDate, cn } from "@/lib/utils";

export function WritingGrid({
  posts,
  allTags,
}: {
  posts: PostMeta[];
  allTags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered =
    activeTag === null ? posts : posts.filter((p) => p.tags.includes(activeTag));

  if (posts.length === 0) {
    return (
      <p className="text-center text-[17px] text-[var(--text-muted)] md:text-left">
        No posts yet. Check back soon.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2 md:justify-start">
        <TagButton active={activeTag === null} onClick={() => setActiveTag(null)}>
          All
        </TagButton>
        {allTags.map((tag) => (
          <TagButton key={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)}>
            {tag}
          </TagButton>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={`/writing/${post.slug}`}
              className="group block h-full apple-card apple-card-hover p-6"
            >
              <time className="text-xs text-[var(--text-subtle)]">
                {formatDate(post.date)}
              </time>
              <h2 className="mt-2 text-[21px] font-semibold leading-snug tracking-tight text-[var(--text)]">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-[var(--text-muted)]">
                {post.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-[13px] text-[var(--text-subtle)]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime}
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--link)] opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-0.5 text-[11px] text-[var(--text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--text-muted)]">No posts match this filter.</p>
      )}
    </div>
  );
}

function TagButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-[13px] transition-colors",
        active
          ? "bg-[var(--text)] text-[var(--bg-elevated)]"
          : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text)]"
      )}
    >
      {children}
    </button>
  );
}
