import profileData from "@/content/profile.json";

export type SkillItem = { name: string; level: number };
export type SkillGroup = { group: string; items: SkillItem[] };

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string | null;
  current: boolean;
  tags: string[];
  highlights: string[];
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
};

export type Profile = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  links: { linkedin: string; github: string; resume: string };
  summary: string;
  experience: Experience[];
  achievements: Achievement[];
  certifications: { name: string; issuer: string }[];
  education: { degree: string; institution: string; period: string }[];
  skills: SkillGroup[];
};

export function getProfile(): Profile {
  return profileData as Profile;
}
