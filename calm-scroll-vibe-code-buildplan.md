# Calm Scroll — Vibe Code Build Plan

> This document is your end-to-end build plan for Calm Scroll, structured around the **Vibe Coding** methodology and designed to be executed with **Claude Code**. Every phase maps to a vibe coding checklist, and every step includes the exact prompt you paste into Claude Code.

---

## Pre-Build Setup

Before writing a single line of code, set up your environment and context so Claude Code works at maximum effectiveness.

### Vibe Code Checklist: Environment

- [ ] Install Claude Code CLI (`npm install -g @anthropic-ai/claude-code`)
- [ ] Create a new project directory: `mkdir calm-scroll && cd calm-scroll`
- [ ] Initialize git: `git init`
- [ ] Create your `CLAUDE.md` context document (see prompt below)
- [ ] Set permission mode: start with `claude --permissions plan` for planning, then switch to default for building
- [ ] Familiarize yourself with key shortcuts: `Esc` to cancel, `Ctrl+C` to interrupt, `Shift+Tab` for multi-line input

### Prompt: Create CLAUDE.md

> Paste this into Claude Code as your very first prompt. This is the most important step — it gives Claude persistent context about the entire project.

```
Create a CLAUDE.md file for this project. Here is the full context:

PROJECT: Calm Scroll
CONCEPT: A mobile-first web app with a TikTok-style vertical snap-scroll feed, but every video is calming and ambient. The goal is to be the app people open instead of Instagram when they're bored — same scroll mechanic, but the content is peaceful instead of overstimulating.

TECH STACK:
- React + Vite (do NOT use Next.js)
- Tailwind CSS for styling
- YouTube IFrame API for video playback (legal embedding, zero hosting cost)
- Local JSON file for video catalog (no database)
- localStorage for user preferences (likes/saves, no auth)
- Deploy target: Vercel free tier

ARCHITECTURE:
- Single-page app, mobile-first responsive
- Vertical scroll container with CSS scroll-snap-type: y mandatory
- Each "card" is a full-viewport section containing one YouTube embedded video
- Videos auto-play (muted) when scrolled into view, pause when scrolled away
- IntersectionObserver API for scroll detection

CONTENT CATEGORIES:
- ambient (rain, fireplace, ocean, nature)
- wisdom (narrated micro-reflections, 30-60s)
- guided (breathing exercises, gratitude prompts)
- satisfying (pottery, calligraphy, slow crafts)

CODE STYLE:
- Functional React components with hooks only
- Keep components small and modular (one component per file)
- Use named exports
- Tailwind utility classes only, no custom CSS unless absolutely necessary
- All video data lives in src/data/videos.json
- Keep the codebase flat: src/components/, src/data/, src/hooks/, src/utils/

FILE NAMING: kebab-case for files, PascalCase for components

IMPORTANT CONSTRAINTS:
- No TypeScript (keep it simple for MVP)
- No backend, no API routes, no database
- No authentication or user accounts
- No SSR — pure client-side SPA
- Must work on iOS Safari and Android Chrome
- YouTube autoplay requires muted start — unmute on first user tap

GIT WORKFLOW:
- Commit after every working feature
- Use conventional commit messages (feat:, fix:, refactor:, chore:)
- Never commit .env files or API keys
```

---

## Phase 1 — Foundation (Days 1-3)

**Goal:** A working vertical scroll feed with embedded YouTube videos that auto-play on visibility.

### Vibe Code Checklist: Phase 1

- [ ] **Plan before you code** — use `/plan` mode before each major feature
- [ ] **One task at a time** — don't ask Claude to build the whole app in one prompt
- [ ] **Establish standards early** — review Claude's first output carefully for coding patterns, file structure, and naming. Fix bad habits now before they compound
- [ ] **Git commit after every working feature** — `git add . && git commit -m "feat: ..."`
- [ ] **Keep code modular** — one component per file, small focused modules
- [ ] **Clear context between unrelated tasks** — use `/clear` if switching focus

---

### Step 1.1 — Scaffold the project

```
Scaffold this project:
- Run: npm create vite@latest . -- --template react
- Install Tailwind CSS v3 and configure it (postcss, tailwind.config)
- Clean out all Vite boilerplate (delete default App.css content, logo, counter)
- Set up the folder structure:
    src/components/
    src/data/
    src/hooks/
    src/utils/
- Create a minimal App.jsx that renders "Calm Scroll" centered on screen
- Make sure `npm run dev` works

Do NOT add any features yet. Just a clean scaffold.
```

**After this works:**
```bash
git add . && git commit -m "chore: scaffold vite + react + tailwind project"
```

---

### Step 1.2 — Build the scroll container

```
Build the core scroll container component.

Create src/components/scroll-feed.jsx:
- A full-viewport container using CSS scroll-snap
- scroll-snap-type: y mandatory on the container
- Each child card is 100vh with scroll-snap-align: start
- For now, render 5 placeholder cards with different background colors and a number (1-5) so I can test the snap behavior
- Smooth scrolling feel on mobile

The container should fill the entire viewport with no margins, padding, or scrollbars visible. Test that swiping up/down snaps cleanly to each card.

Import and render this in App.jsx.
```

**After this works:**
```bash
git add . && git commit -m "feat: vertical snap-scroll container"
```

---

### Step 1.3 — Create the video data catalog

```
Create src/data/videos.json with 10 calming YouTube videos.

Each entry should have:
- id: a unique string (e.g. "rain-window-01")
- youtubeId: the YouTube video ID (the part after ?v= in the URL)
- title: descriptive title
- creator: the YouTube channel name
- category: one of "ambient", "wisdom", "guided", "satisfying"
- duration: approximate duration in seconds

Use these real YouTube video IDs (I've verified they exist and are embeddable):
- "rPjez8z61rI" — Rain on Window (ambient)
- "L_LUpnjgPso" — Cozy Fireplace (ambient)
- "WHPEKLQID4U" — Ocean Waves (ambient)
- "xNN7iTA57jM" — Forest Sounds (ambient)
- "lFcSrYw-ARY" — Relaxing Piano (ambient)
- "2OEL4P1Rz04" — Japanese Garden (satisfying)
- "dQw4w9WgXcQ" — replace this one with another you find appropriate
- "5qap5aO4i9A" — Lofi Hip Hop (ambient)

Fill in any gaps with plausible IDs. We'll verify and swap later. The important thing is the data shape is right.
```

**After this works:**
```bash
git add . && git commit -m "feat: video catalog with 10 entries"
```

---

### Step 1.4 — Build the YouTube player component

```
Build the YouTube video player component.

Create src/components/video-card.jsx:
- Takes a video object (from videos.json) as a prop
- Renders a full-viewport card (100vh, 100vw)
- Embeds a YouTube player using an iframe with these parameters:
    - autoplay=0 (we'll control this with IntersectionObserver)
    - mute=1 (required for autoplay on mobile)
    - controls=0 (hide YouTube controls for cleaner UX)
    - loop=1
    - playsinline=1 (critical for iOS)
    - modestbranding=1
    - rel=0 (don't show related videos)
- Show the video title and category as a subtle overlay at the bottom of the card (white text with a slight dark gradient background behind it, like Instagram Reels)
- The iframe should fill the entire card. Use object-fit: cover approach — on mobile this means the video might be slightly cropped to fill the viewport, which is fine.

Do NOT implement auto-play-on-scroll yet. That's the next step. Just get the embed rendering correctly.
```

**After this works:**
```bash
git add . && git commit -m "feat: youtube video card component"
```

---

### Step 1.5 — Auto-play on scroll with IntersectionObserver

```
Create a custom hook for scroll-based video playback.

Create src/hooks/use-on-screen.js:
- A custom hook that uses IntersectionObserver
- Takes a ref and a threshold (default 0.6 — meaning 60% visible)
- Returns a boolean: isVisible

Now update video-card.jsx:
- Instead of a plain iframe, use the YouTube IFrame Player API (load the API script dynamically)
- When the card scrolls into view (isVisible = true), call player.playVideo()
- When the card scrolls out of view, call player.pauseVideo()
- Videos should start muted. Add a tap-to-unmute overlay icon (a speaker icon) that unmutes on first tap.

Update scroll-feed.jsx:
- Import the video catalog from videos.json
- Map over videos and render a video-card for each
- Remove the placeholder colored cards

This is the core mechanic — test it on mobile. Swiping to a new video should auto-play it and pause the previous one.
```

**After this works:**
```bash
git add . && git commit -m "feat: auto-play/pause on scroll with IntersectionObserver"
```

---

### Phase 1 Checkpoint

```
Review the current codebase for quality issues:
- Are components small and focused?
- Is there any duplicated logic?
- Are there any hardcoded values that should be constants?
- Is the folder structure clean?
- Any accessibility issues?

Suggest refactors but don't make changes yet — just list them.
```

> **Vibe coding principle:** Force refactoring sessions regularly. AI takes the path of least resistance. After Phase 1, step back and clean up before building more.

```bash
git add . && git commit -m "refactor: phase 1 cleanup"
```

---

## Phase 2 — Content & UX (Days 4-6)

**Goal:** A curated, categorized feed with interactions that feels intentional and polished.

### Vibe Code Checklist: Phase 2

- [ ] **Start a fresh chat** — use `/clear` to reset context for Phase 2
- [ ] **Update CLAUDE.md** — add any learnings or patterns from Phase 1
- [ ] **Be specific with prompts** — give Claude mockup descriptions, not vague instructions
- [ ] **Tell Claude what NOT to do** — prevent over-engineering
- [ ] **Git commit after every feature** — keep the safety net tight
- [ ] **Test on mobile after every UI change** — don't just check desktop

---

### Step 2.1 — Expand the video catalog to 30-50 entries

```
I need to expand src/data/videos.json to 30-50 entries. Help me find real, embeddable YouTube video IDs for calming content.

Search strategy by category:
- ambient (15 videos): rain sounds, fireplace, ocean waves, forest ambiance, snowfall, river streams, thunderstorms, wind sounds
- wisdom (10 videos): stoic philosophy narration, calm motivational, short poetry readings, mindfulness talks, Alan Watts clips
- guided (10 videos): breathing exercises, body scan meditation, gratitude meditation, sleep meditation, progressive muscle relaxation
- satisfying (10 videos): pottery making, calligraphy, woodworking, sand art, soap cutting, candle making, painting

For each entry provide: id, youtubeId, title, creator, category, duration.

Important: use real YouTube video IDs that are likely to be embeddable. Prefer videos from channels that are known for calming content (Noisli, Calm, Relaxing White Noise, etc.)

Output the complete updated videos.json file.
```

> **Note:** You'll need to manually verify some of these IDs work. Open a few in your browser with `https://www.youtube.com/watch?v=VIDEO_ID` to confirm they exist.

**After verified:**
```bash
git add . && git commit -m "feat: expand catalog to 30+ curated videos"
```

---

### Step 2.2 — Category filter bar

```
Build a category filter component.

Create src/components/category-bar.jsx:
- A fixed horizontal bar at the top of the screen (sticky, z-index above videos)
- Semi-transparent dark background with backdrop-blur
- Filter pills: All | Ambient | Wisdom | Guided | Satisfying
- "All" is selected by default
- Selected pill has a subtle highlight (white/light background, dark text)
- Unselected pills are white text on transparent
- Tapping a category filters the scroll feed to only show videos of that category
- Smooth transition when switching categories

Update App.jsx to manage the selected category state and pass it to both category-bar and scroll-feed.

The bar should feel like Instagram Stories bar — thin, unobtrusive, always accessible.
```

**After this works:**
```bash
git add . && git commit -m "feat: category filter bar"
```

---

### Step 2.3 — Like & save functionality

```
Build a like/save system using localStorage (no backend).

Create src/hooks/use-favorites.js:
- Custom hook that manages a Set of favorite video IDs
- Stores in localStorage under key "calm-scroll-favorites"
- Provides: favorites (Set), toggleFavorite(id), isFavorite(id)

Update video-card.jsx:
- Add a heart icon in the bottom-right corner (like TikTok's right sidebar)
- Tapping the heart toggles the favorite state
- Filled heart = favorited, outline heart = not favorited
- Brief scale animation on toggle (CSS transition)

Create src/components/favorites-tab.jsx:
- A slide-up panel or separate view that shows saved videos
- Triggered by a small bookmark icon in the category bar
- Shows a grid of saved video thumbnails (use YouTube thumbnail URL: https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg)
- Tapping a thumbnail scrolls to that video or opens it

Keep it simple — localStorage, no syncing, no auth.
```

**After this works:**
```bash
git add . && git commit -m "feat: like/save with localStorage"
```

---

### Step 2.4 — Loading states & polish

```
Add loading states and transitions to make the app feel premium.

1. Video loading state:
   - While YouTube iframe loads, show a blurred thumbnail (use YouTube thumbnail as background-image) with a subtle pulse animation
   - Smooth fade-in when the video is ready to play

2. Scroll transitions:
   - Ensure snap-scroll is buttery smooth
   - Test and fix any jank on iOS Safari specifically

3. Category switch:
   - When switching categories, fade out current videos, update list, fade in new videos
   - No jarring layout shifts

4. Unmute indicator:
   - On first visit, show a small pulsing "tap to unmute" indicator on the first video
   - Once the user taps, hide it permanently (store in localStorage)

Use Tailwind's transition utilities. No animation libraries.
```

**After this works:**
```bash
git add . && git commit -m "feat: loading states and transitions"
```

---

### Step 2.5 — Branding & first-open experience

```
Add minimal branding and a first-open screen.

1. First-open overlay (src/components/welcome-overlay.jsx):
   - Full-screen semi-transparent overlay
   - App name "Calm Scroll" in a clean sans-serif font
   - Tagline: "Scroll to decompress."
   - Subtitle: "No accounts. No algorithms. Just calm."
   - A single "Start" button that dismisses the overlay
   - Store in localStorage so it only shows once

2. Branding:
   - Set the page title to "Calm Scroll"
   - Add a favicon (use a simple wave emoji or generate a minimal SVG icon)
   - Set meta tags for social sharing (og:title, og:description, og:image)
   - Theme color for mobile browser chrome: dark/navy (#0f172a)

Keep the branding minimal and calming. No bright colors. Think: dark backgrounds, soft whites, muted blues.
```

**After this works:**
```bash
git add . && git commit -m "feat: welcome overlay and branding"
```

---

### Phase 2 Checkpoint

```
Do a full code review of the codebase:
1. Check for any dead code or unused imports
2. Are there any components doing too much? Should anything be split?
3. Review all localStorage usage — any edge cases or race conditions?
4. Check for console.log statements that should be removed
5. Review Tailwind usage — any overly long class strings that should be extracted?
6. Is videos.json well-formed? Any duplicate IDs?

Fix issues and refactor. Then tell me the overall file tree.
```

```
Think about what could go wrong with the YouTube IFrame API:
- What happens if a video is removed from YouTube?
- What happens if embedding is disabled for a video?
- What happens on slow connections?
- What happens if the user has an ad blocker?

Add graceful error handling for each scenario. Show a calm fallback state (not a scary error) if a video fails to load.
```

```bash
git add . && git commit -m "refactor: phase 2 cleanup and error handling"
```

---

## Phase 3 — Polish & Ship (Days 7-9)

**Goal:** Production-ready, deployed, shareable with real people.

### Vibe Code Checklist: Phase 3

- [ ] **Start a fresh chat** — clear context for the final push
- [ ] **Update CLAUDE.md** with Phase 2 learnings
- [ ] **Ask Claude to write tests** — especially E2E for critical flows
- [ ] **Security audit** — ask Claude to check for vulnerabilities
- [ ] **Never hardcode secrets** — use environment variables for any keys
- [ ] **Test on real devices** — iOS Safari, Android Chrome, desktop browsers

---

### Step 3.1 — Mobile optimization

```
Act as a mobile UX engineer. Audit and fix the app for mobile browsers.

Test and fix these known mobile issues:
1. iOS Safari viewport height bug (100vh includes the address bar). Use CSS dvh units or a JS workaround.
2. YouTube autoplay policies — ensure muted autoplay works on both iOS Safari and Android Chrome
3. Touch gesture conflicts — make sure vertical scroll snapping doesn't conflict with horizontal swipe gestures
4. Safe area insets — respect notch/home indicator on modern iPhones (env(safe-area-inset-*))
5. Overscroll behavior — prevent rubber-banding at top/bottom of feed (overscroll-behavior: none)
6. Text size — ensure all text is readable without zooming
7. Tap target sizes — all interactive elements are at least 44x44px

Also add a meta viewport tag if not present:
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

**After this works:**
```bash
git add . && git commit -m "fix: mobile optimization for iOS and Android"
```

---

### Step 3.2 — Add basic tests

```
Write tests for the critical paths:

1. Unit tests (using Vitest):
   - use-favorites hook: test add, remove, persist to localStorage, load from localStorage
   - use-on-screen hook: test visibility detection (mock IntersectionObserver)
   - Video data: test that videos.json is valid (all required fields, no duplicate IDs, valid categories)

2. Component tests:
   - video-card renders without crashing
   - category-bar renders all categories
   - welcome-overlay shows on first visit, hides on return visit

Set up Vitest with React Testing Library. Keep tests simple and focused.

Do NOT write E2E tests — that's overkill for this MVP.
```

**After this works:**
```bash
git add . && git commit -m "test: unit and component tests"
```

---

### Step 3.3 — Analytics integration

```
Add privacy-friendly analytics to track key metrics.

Use Plausible Analytics (script tag approach, no npm package needed):
- Add the Plausible script to index.html
- Use a placeholder domain for now (calm-scroll.vercel.app or similar)

Track these custom events:
- "video_view": when a video becomes visible for more than 2 seconds (not just scrolled past)
- "category_switch": when user taps a category filter, include which category
- "favorite_toggle": when user likes/unlikes a video
- "unmute": when user taps to unmute for the first time
- "session_depth": send the total number of videos viewed when the user leaves (beforeunload)

Create a src/utils/analytics.js helper with a trackEvent(name, props) function.
Wrap it so it's a no-op if Plausible isn't loaded (local dev).

Do NOT use Google Analytics. Plausible only.
```

**After this works:**
```bash
git add . && git commit -m "feat: plausible analytics integration"
```

---

### Step 3.4 — PWA setup (optional but recommended)

```
Set up the app as a Progressive Web App so users can "install" it to their home screen.

1. Create a manifest.json in /public:
   - name: "Calm Scroll"
   - short_name: "CalmScroll"
   - theme_color: "#0f172a"
   - background_color: "#0f172a"
   - display: "standalone"
   - Generate simple icons at 192x192 and 512x512 (use a simple SVG wave or circle)

2. Add a basic service worker (just for the install prompt, no offline caching needed for MVP since we depend on YouTube)

3. Link the manifest in index.html

This way users on mobile can add it to their home screen and it opens fullscreen, like a native app.
```

**After this works:**
```bash
git add . && git commit -m "feat: PWA manifest and service worker"
```

---

### Step 3.5 — Security audit & final review

```
Perform a security audit of this application:

1. Check for any hardcoded secrets or API keys
2. Verify no sensitive data is stored in localStorage beyond preferences
3. Check for XSS vulnerabilities (especially in YouTube embed URLs)
4. Verify Content Security Policy headers for the YouTube iframe
5. Check that no user data is being sent anywhere
6. Review all external script loads (YouTube API, Plausible)
7. Check for dependency vulnerabilities: run npm audit

This is a static client-side app with no auth and no backend, so the attack surface should be minimal. But confirm that's actually the case.
```

```bash
git add . && git commit -m "chore: security audit passed"
```

---

### Step 3.6 — Deploy to Vercel

```
Prepare the project for deployment to Vercel:

1. Make sure the build works: npm run build
2. Check that the dist/ folder contains everything needed
3. Create a vercel.json if needed (rewrites for SPA routing)
4. Add a .gitignore that excludes node_modules, dist, .env*
5. List the steps I need to follow to deploy:
   - Push to GitHub
   - Connect to Vercel
   - Set any environment variables
   - Deploy

Do NOT try to deploy — just make sure the build is clean and give me the deployment steps.
```

```bash
git add . && git commit -m "chore: prepare for vercel deployment"
git push origin main
```

---

## Phase 4 — Validate (Days 10-21)

This phase is not about coding — it's about learning. Share the app with 10-20 people and watch what happens.

### Metrics Dashboard

After a week of real usage, come back to Claude Code:

```
Help me analyze my Plausible analytics data. I'll paste the numbers.

Key questions:
1. What's the average session depth (videos viewed per session)?
2. Which content category gets the most engagement?
3. What's the drop-off rate (do people watch 1 video and leave, or scroll deep)?
4. What percentage of users come back within 7 days?
5. What's the mute/unmute ratio?

Based on the data, suggest 3 specific changes to the content mix or UX that could improve retention.
```

---

## Vibe Coding Quick Reference Card

Keep this open while you build. These are the principles that matter most.

### Prompting Rules

| Rule | Why |
|---|---|
| One task per prompt | Claude produces better code with focused scope |
| Be specific, not vague | "Build a scroll container with CSS snap" > "make it scrollable" |
| Say what NOT to do | "No TypeScript, no SSR, no external state libraries" |
| Give references | "Like TikTok's scroll UX" or "like Instagram's heart animation" |
| Use "act as" framing | "Act as a mobile UX engineer" focuses Claude's output |
| Tell Claude to "think" | "Think about edge cases before implementing" |

### Context Management

| Action | When |
|---|---|
| `/clear` | Starting a new phase or unrelated task |
| Update CLAUDE.md | After every phase — add patterns, constraints, learnings |
| Fresh session | If Claude's output quality degrades after 3+ prompts |
| `/compact` | If context is getting long but you want to keep the session |

### Git Discipline

| Action | When |
|---|---|
| `git commit` | After every working feature (every step above) |
| `git branch feature-name` | Before starting experimental features |
| `git stash` | Before trying a different approach |
| `git diff` | Before committing — review what Claude actually changed |
| Never use AI revert | Use `git checkout` or `git revert` instead |

### Debugging Flow

| Step | Prompt |
|---|---|
| 1. Paste the error | "Here's the error I'm getting: [paste]. Fix it." |
| 2. If it doesn't fix | "That didn't work. List 5 possible causes for this error." |
| 3. If still stuck | "Add console.log statements to help me trace where this breaks." |
| 4. Nuclear option | "Let's step back. Explain what this code is supposed to do, then rewrite it from scratch." |

### Key Claude Code Commands

| Command | Purpose |
|---|---|
| `/plan` | Enter plan mode — Claude outlines before coding |
| `/clear` | Clear context, fresh start |
| `/compact` | Compress context to save tokens |
| `/status` | See what Claude is tracking |
| `/rewind` | Roll back to a previous point |
| `/cost` | Check token spend |
| `Esc` | Cancel current generation |
| `Ctrl+C` | Interrupt Claude |

---

## File Tree (Expected at End of Phase 3)

```
calm-scroll/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sw.js
├── src/
│   ├── components/
│   │   ├── scroll-feed.jsx
│   │   ├── video-card.jsx
│   │   ├── category-bar.jsx
│   │   ├── favorites-tab.jsx
│   │   └── welcome-overlay.jsx
│   ├── data/
│   │   └── videos.json
│   ├── hooks/
│   │   ├── use-favorites.js
│   │   └── use-on-screen.js
│   ├── utils/
│   │   └── analytics.js
│   ├── App.jsx
│   └── main.jsx
├── tests/
│   ├── use-favorites.test.js
│   ├── use-on-screen.test.js
│   └── video-data.test.js
├── index.html
├── CLAUDE.md
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json
├── package.json
└── .gitignore
```

---

## The Golden Rule

**Every prompt is one task. Every task ends with a commit. Every phase starts with a fresh context.**

That's vibe coding. Ship calm.
