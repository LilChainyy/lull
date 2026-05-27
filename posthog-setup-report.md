# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Calm Scroll. PostHog (`posthog-js` + `@posthog/react`) was installed and initialized in `main.jsx` with a `PostHogProvider` wrapping the entire app. Event captures were added to 6 files covering video engagement, content discovery, favorites, and auth flows. User identification (via `posthog.identify`) fires on every auth state change in `auth-context.jsx`, and `posthog.reset()` fires on sign-out. Exception capture was added to auth error paths. The existing Plausible integration in `analytics.js` was left intact — PostHog events run alongside it.

| Event | Description | File |
|-------|-------------|------|
| `video_view` | Video visible for 2+ seconds; includes `video_id`, `category`, `title` | `src/components/video-card.jsx` |
| `favorite_toggle` | Heart button tapped to add or remove a video; includes `video_id`, `action`, `category` | `src/components/video-card.jsx` |
| `unmute` | User unmutes audio; includes `video_id`, `category` | `src/components/video-card.jsx` |
| `category_switch` | Category pill tapped to filter the feed; includes `category` | `src/App.jsx` |
| `favorites_opened` | Saved-videos overlay opened; includes `favorite_count` | `src/App.jsx` |
| `profile_opened` | Logged-in user opens their profile | `src/App.jsx` |
| `auth_modal_opened` | Guest taps profile, triggering the auth modal | `src/App.jsx` |
| `sign_in` | Successful email/password sign-in; includes `method` | `src/components/auth-modal.jsx` |
| `sign_up` | Successful account creation; includes `method` | `src/components/auth-modal.jsx` |
| `sign_in_with_google` | Google OAuth flow initiated | `src/components/auth-modal.jsx` |
| `sign_out` | User signs out; includes `favorite_count` | `src/components/profile-page.jsx` |
| `session_depth` | Unique videos viewed before page unload; includes `depth`, `videos_viewed` | `src/utils/analytics.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1635748)
- [Video views over time](/insights/vJ8zTtsL) — daily trend of `video_view` events
- [Category popularity](/insights/IrC4OE3c) — `video_view` broken down by content category
- [Guest to sign-up funnel](/insights/sX855RKS) — conversion from `auth_modal_opened` → `sign_up`
- [Favorites added over time](/insights/btyUm0Uh) — daily trend of favorite add actions
- [Audio unmute rate](/insights/T6GHi8Ve) — `unmute / video_view * 100` as an engagement depth signal

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-vite/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
