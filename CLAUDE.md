# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Calm Scroll — a mobile-first web app with a TikTok-style vertical snap-scroll feed where every video is calming and ambient. The goal is to be the app people open instead of Instagram when they're bored — same scroll mechanic, but the content is peaceful instead of overstimulating.

## Tech Stack

- React + Vite (no Next.js, no SSR)
- Tailwind CSS (utility classes only, no custom CSS unless absolutely necessary)
- YouTube IFrame API for video playback (legal embedding, zero hosting cost)
- Supabase (auth + Postgres for user profiles and cloud-synced favorites)
- Local JSON file for video catalog (no database for video content)
- localStorage for guest user preferences (likes/saves); Supabase for logged-in users
- Deploy target: Vercel free tier

## Environment Variables

Supabase is optional — the app runs in guest-only mode when env vars are missing.

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build locally
```

## Architecture

**Single-page app.** Pure client-side SPA. No routing library needed for MVP — the entire experience is one vertical scroll feed.

**Scroll mechanic:** A full-height vertical scroll container using `scroll-snap-type: y mandatory`. Each "card" is a 100vh section containing one YouTube embed. CSS scroll-snap handles the snap-to-card behavior natively.

**Video lifecycle:** IntersectionObserver watches each card. When a card enters the viewport, its YouTube player auto-plays (muted). When it leaves, it pauses. YouTube autoplay requires muted start on mobile — unmute on first user tap.

**Video data:** All video metadata lives in `src/data/videos.json`. Each entry has an id, YouTube video ID, title, creator, category, and optional tags. No database, no API.

**User state:** Guest users get localStorage-based favorites. Logged-in users (via Supabase auth) get cloud-synced favorites and a profile. localStorage favorites migrate to Supabase on first login.

## Content Categories

- `ambient` — rain, fireplace, ocean, nature
- `classes` — educational lectures, philosophy, stoicism, complex concepts with ambient narration
- `guided` — breathing exercises, gratitude prompts
- `satisfying` — pottery, calligraphy, slow crafts
- `filmcamera` — super 8, film photography, analog
- `surfing` — POV surfing, wave footage, surf films
- `solotrip` — quiet solo travel vlogs, walking tours, train journeys

## Project Structure

```
src/
  components/    # React components (one per file)
  data/          # videos.json
  hooks/         # Custom React hooks
  utils/         # Helper functions
```

Keep the codebase flat. No nested folders inside these directories.

## Code Style

- Functional React components with hooks only (no class components)
- Named exports (not default exports)
- File naming: kebab-case (`video-card.jsx`, `use-intersection.js`)
- Component naming: PascalCase (`VideoCard`, `ScrollFeed`)
- Keep components small and modular — one component per file, under 150 lines
- Tailwind utility classes only in JSX — no separate CSS files
- No TypeScript (plain JS/JSX for MVP)

## Do NOT

- Do not add TypeScript. Keep it plain JS/JSX for MVP simplicity.
- Do not use Next.js, SSR, or any server-side rendering.
- Do not add a custom backend or API routes (Supabase is the only backend service).
- Do not add a CSS-in-JS library or custom CSS files. Tailwind only.
- Do not use default exports. Use named exports everywhere.
- Do not use class components. Hooks only.
- Do not commit `.env` files or API keys.
- Do not host videos — embed via YouTube IFrame API only.

## Browser Targets

Must work on iOS Safari and Android Chrome. Test touch interactions, scroll-snap behavior, and YouTube autoplay (muted) on both.

## Git Workflow

- Commit after every working feature
- Conventional commit messages: `feat:`, `fix:`, `refactor:`, `chore:`
- Never commit `.env` files or API keys
