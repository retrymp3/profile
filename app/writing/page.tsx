import type { Metadata } from "next";
import { WritingGrid } from "@/components/writing-grid";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Writing",
};

export default function WritingPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="space-y-12">
      <header className="text-center md:text-left">
        <p className="section-eyebrow">Blog</p>
        <h1 className="section-title mt-2">Writing</h1>
        <p className="section-subtitle max-w-2xl">
          Notes on application security, automation, and secure engineering.
        </p>
      </header>

      <WritingGrid posts={posts} allTags={tags} />
    </div>
  );
}
