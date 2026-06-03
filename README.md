# Advisory Brief — Achuth V P

Static-first Next.js portfolio for an application security professional. Apple-inspired UI, MDX writing, and static deployment on Vercel Hobby.

## Stack

- **Next.js 15+** (App Router, `force-static` on all pages)
- **Tailwind CSS v4**
- **Framer Motion**, **cmdk**, **Recharts**, **next-mdx-remote**, **gray-matter**

## Development

```bash
cd profile
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

All pages are statically generated at build time. Content lives in `content/profile.json` and `content/writing/*.mdx`.

## Deploy to Vercel (Hobby)

1. Push this repo to GitHub: [retrymp3/profile](https://github.com/retrymp3/profile)
2. Import the project in [Vercel](https://vercel.com/new)
3. Framework preset: **Next.js**
4. Root directory: `profile` (if monorepo) or repo root
5. Build command: `npm run build` · Output: default (`.next`)

No environment variables required for the static site.

## Features

- **⌘K** command palette — navigation, copy email, GitHub, LinkedIn
- **Clearance XP** — explore pages and flip achievement cards
- **Konami code** — 60s red-team visual mode
- **Spot the Bug** — SQL injection triage mini-game
- **First-visit security scan** — session-only loader

## Content

| Path | Purpose |
|------|---------|
| `content/profile.json` | Resume structured data |
| `content/writing/*.mdx` | Blog posts |

## License

Private portfolio — all rights reserved.
