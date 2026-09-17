import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CreativeHero } from "@/components/creative-hero";
import { AchievementBento } from "@/components/achievement-bento";
import { InsightChallengeLazy } from "@/components/insight-challenge-lazy";
import { InteractiveStats } from "@/components/interactive-stats";
import { SkillMarquee } from "@/components/skill-marquee";
import { getProfile } from "@/lib/profile";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-static";

export default function HomePage() {
  const profile = getProfile();
  const posts = getAllPosts().slice(0, 2);

  return (
    <div className="space-y-20 md:space-y-28">
      <CreativeHero profile={profile} />

      <InteractiveStats />

      <SkillMarquee skills={profile.skills} />

      <section>
        <p className="section-eyebrow text-center">Recognition</p>
        <h2 className="section-title mt-2 text-center">Highlights</h2>
        <p className="section-subtitle mx-auto max-w-lg text-center">
          Tap a card for more detail.
        </p>
        <div className="mt-10">
          <AchievementBento achievements={profile.achievements} />
        </div>
      </section>

      <section className="rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] px-6 py-12 md:px-10">
        <InsightChallengeLazy />
      </section>

      <section>
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="section-eyebrow">Writing</p>
            <h2 className="section-title mt-2">Latest posts</h2>
          </div>
          <Link
            href="/writing"
            className="mt-4 inline-flex items-center gap-1 text-[17px] text-[var(--link)] hover:no-underline sm:mt-0"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {posts.length === 0 && (
          <p className="mt-10 text-center text-[15px] text-[var(--text-muted)] md:text-left">
            New posts will appear here soon.
          </p>
        )}
        {posts.length > 0 && (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="group block h-full apple-card apple-card-hover p-6"
                >
                  <time className="text-xs text-[var(--text-subtle)]">
                    {formatDate(post.date)}
                  </time>
                  <h3 className="mt-2 text-[21px] font-semibold leading-snug tracking-tight text-[var(--text)] group-hover:text-[var(--link)]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)] line-clamp-2">
                    {post.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
