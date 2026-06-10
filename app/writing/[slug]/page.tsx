import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock } from "lucide-react";
import { SanitizerFlowExplorer } from "@/components/sanitizer-flow-explorer";
import { WritingFigure } from "@/components/writing-figure";
import { WritingVideo } from "@/components/writing-video";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { rehypePrettyCodeOptions } from "@/lib/shiki";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
      },
    },
    components: {
      SanitizerFlowExplorer,
      WritingVideo,
      WritingFigure,
    },
  });

  return (
    <article className="space-y-8">
      <Link
        href="/writing"
        className="inline-flex items-center gap-1 text-[17px] text-[var(--link)] hover:no-underline"
      >
        <ArrowLeft className="h-4 w-4" /> Writing
      </Link>

      <header className="max-w-3xl">
        <time className="text-sm text-[var(--text-subtle)]">{formatDate(post.date)}</time>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-[-0.03em] text-[var(--text)]">
          {post.title}
        </h1>
        <p className="mt-4 text-[19px] leading-relaxed text-[var(--text-muted)]">
          {post.description}
        </p>
        <p className="mt-3 flex items-center gap-1 text-sm text-[var(--text-subtle)]">
          <Clock className="h-4 w-4" />
          {post.readingTime}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-[12px] text-[var(--text-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="prose-advisory max-w-none">{content}</div>
    </article>
  );
}
