# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Calm Scroll. PostHog (`posthog-js` + `@posthog/react`) is installed and initialized in `main.jsx` with a `PostHogProvider` wrapping the entire app. Event captures cover video engagement, content discovery, favorites, and auth flows. User identification (`posthog.identify`) fires on every auth state change in `auth-context.jsx`, and `posthog.reset()` fires on sign-out. Exception capture covers auth error paths. Two new events were added in this session: `favorite_selected` (navigation from favorites panel) and `video_error` (YouTube player failures for content health monitoring). Environment variables `VITE_POSTHOG_TOKEN` and `VITE_POSTHOG_HOST` are set in `.env.local`.

| Event | Description | File |
|-------|-------------|------|
| `video_view` | Video visible for 2+ seconds; includes `video_id`, `category`, `title` | `src/components/video-card.jsx` |
| `video_error` | YouTube player failed to load; includes `video_id`, `category`, `error_message` ✨ | `src/components/video-card.jsx` |
| `favorite_toggle` | Heart button tapped to add or remove a video; includes `video_id`, `action`, `category` | `src/components/video-card.jsx` |
| `unmute` | User unmutes audio; includes `video_id`, `category` | `src/components/video-card.jsx` |
| `favorite_selected` | User taps a video in the favorites panel to navigate to it ✨ | `src/components/favorites-tab.jsx` |
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

- [Analytics basics dashboard](/project/442809/dashboard/1635844)
- [Video views by category](/project/442809/insights/lxfdPFna) — daily `video_view` events broken down by content category
- [Sign-up conversion funnel](/project/442809/insights/DejlPFGb) — conversion from `auth_modal_opened` → `sign_up`
- [Daily active users](/project/442809/insights/aQ6fXm74) — unique users per day who watched at least one video
- [Favorites added over time](/project/442809/insights/4u9sPchY) — daily count of videos added to favorites
- [Video errors](/project/442809/insights/iN22Uy7Q) — YouTube player errors broken down by video ID for content health

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-vite/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
