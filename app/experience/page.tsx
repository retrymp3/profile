import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Experience",
};

export default function ExperiencePage() {
  const profile = getProfile();

  return (
    <div className="space-y-12">
      <header className="text-center md:text-left">
        <p className="section-eyebrow">Career</p>
        <h1 className="section-title mt-2">Experience</h1>
        <p className="section-subtitle max-w-2xl">
          Product security, automation, and research across product and consulting
          environments.
        </p>
      </header>

      <ExperienceTimeline experience={profile.experience} />
    </div>
  );
}
