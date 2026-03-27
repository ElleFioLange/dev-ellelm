# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (http://localhost:3000)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # ESLint via Next.js
```

## Architecture

**ElleLM** is Elle's personal portfolio site built with Next.js 14. Its signature feature is an AI-powered "Ask me about" widget that streams Claude responses about selected topics.

### Routing

`middleware.ts` intercepts `/` and `/portfolio` routes, detects mobile vs desktop via user agent, and redirects to the appropriate `/desktop`, `/mobile`, `/portfolio/desktop`, or `/portfolio/mobile` paths. The root `page.tsx` and `/portfolio/page.tsx` are intentionally empty.

### AI Explanation System

1. User selects keywords from the home page options
2. `Loading.tsx` runs a GSAP animation; after the animation completes, it fires `onLoad`
3. `handleExplain.ts` POSTs selected keywords to `/api/explain`
4. The API route (`app/api/explain/route.ts`, edge runtime) builds a system prompt from per-keyword contexts (`utils/keywords/contexts/`) and relationship contexts (`utils/keywords/relations/`), then uses the modern Vercel AI SDK (`@ai-sdk/anthropic` v3.0.64, `ai` v6.0.140) with `streamText()` to stream Claude responses
5. The client reads the clean text stream chunks and appends `<span>` elements with `animate-fade-in` to a `<p ref>` for real-time display

**Streaming Implementation**: Uses `streamText()` with the `@ai-sdk/anthropic` provider and `toTextStreamResponse()` for clean, properly-formatted text streaming (no legacy `AnthropicStream` formatting)

### State Machine (`utils/types/state.ts`)

```
0 = Idle | 1 = Streaming | 2 = Finished | 3 = Canceled | 4 = Closing
```

This type drives UI visibility and button behavior throughout both `ElleLM` components.

### Handler Functions (`utils/functions/handlers/`)

All interaction logic is extracted into standalone handler functions:
- `handleExplain` — fetches & streams response, manages state transitions
- `handleCancel` — cancels the stream reader
- `handleClose` — fades out text, resets state
- `handleReturn` — restores previously streamed text
- `handleRemove` — removes a keyword from the selected list

Handlers receive state tuples (`[value, setter]`) as arguments rather than using Context.

### Keyword System (`utils/keywords/`)

- `contexts/` — one file per keyword, each exports a string used to build the Claude system prompt
- `relations/` — files for specific keyword pairs (e.g., `firebase_python`); keys are `a_b` (alphabetical)
- `contexts/index.ts` and `relations/index.ts` barrel-export everything
- Keywords are sorted alphabetically before building the prompt; `maxOutputTokens` = `256 + 128 * (keywords + pairs)`

### Styling

- Tailwind CSS with custom CSS variables for theming (`fg`, `bg`, `accent`, `green`, `red`)
- Custom grid layouts defined in `app/css.css`: `.home-grid`, `.ellelm-grid`, `.portfolio-grid`
- Custom font: `cormorant` (Cormorant Garamond via Google Fonts), used via `font-cormorant` class
- `animate-fade-in` and `animate-fade-out` are custom Tailwind animations (1s ease-in-out)
- Dark/light mode via `prefers-color-scheme` CSS media query

### Desktop vs Mobile

Desktop and mobile share the same logic but have separate layout files:
- `app/desktop/page.tsx` / `app/mobile/page.tsx` — home page variants
- `app/desktop/components/ElleLM.tsx` / `app/mobile/components/ElleLM.tsx` — AI widget variants
- `app/portfolio/desktop/page.tsx` / `app/portfolio/mobile/page.tsx` — portfolio variants
- Mobile uses vertical scrolling; desktop uses a fixed grid
