import type { Metadata } from "next";
import { SkillRadarLazy } from "@/components/skill-radar-lazy";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const profile = getProfile();

  return (
    <div className="space-y-16">
      <header className="text-center md:text-left">
        <p className="section-eyebrow">About</p>
        <h1 className="section-title mt-2">Building security into how teams ship.</h1>
      </header>

      <section className="apple-card p-8 md:p-10">
        <p className="text-[19px] leading-relaxed text-[var(--text-muted)]">{profile.summary}</p>
        <p className="mt-6 text-[17px] text-[var(--text-muted)]">
          {profile.location} ·{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </section>

      <SkillRadarLazy skills={profile.skills} />

      <section>
        <p className="section-eyebrow">Credentials</p>
        <h2 className="section-title mt-2">Certifications</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {profile.certifications.map((cert) => (
            <li key={cert.name} className="apple-card apple-card-hover p-5">
              <span className="text-[17px] font-semibold text-[var(--text)]">{cert.name}</span>
              <span className="mt-1 block text-[15px] text-[var(--text-muted)]">
                {cert.issuer}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="section-eyebrow">Education</p>
        <h2 className="section-title mt-2">Academic background</h2>
        <ul className="mt-8 space-y-4">
          {profile.education.map((edu) => (
            <li key={edu.degree} className="apple-card p-5">
              <span className="text-[17px] font-semibold text-[var(--text)]">{edu.degree}</span>
              <span className="mt-1 block text-[15px] text-[var(--text-muted)]">
                {edu.institution} · {edu.period}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
