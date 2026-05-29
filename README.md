# AI Workplace Productivity Assistant

A modern, responsive SaaS web application that helps professionals automate and streamline daily office tasks using simulated AI capabilities. Built as a fully interactive frontend prototype with a polished startup-product feel.

## Overview

The Workplace AI Productivity Suite provides six core tools to boost daily productivity:

- **Dashboard** — Overview of productivity stats, recent activity, and quick navigation.
- **Email Generator** — Draft professional emails with tone and length controls, then copy to clipboard.
- **Meeting Summarizer** — Upload transcripts and receive structured summaries with action items, key points, and risk flags.
- **Task Planner** — Kanban-style board with AI-prioritized task scheduling suggestions.
- **Research Assistant** — Generate executive summaries, market insights, and trend analysis on any topic.
- **AI Chat** — Threaded conversational assistant with persistent history and smart topic categorization.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7) |
| Routing | File-based via `@tanstack/react-router` |
| Styling | Tailwind CSS v4 with custom oklch design tokens |
| UI Components | shadcn/ui (New York style) + Radix UI primitives |
| State & Data | TanStack Query + localStorage persistence |
| Icons | Lucide React |
| Notifications | Sonner (toast) |
| Type Safety | TypeScript 5.8 (strict mode) |

## Getting Started

```bash
# Install dependencies
bun install

# Start the dev server
bun run dev

# Production build
bun run build
```

The dev server runs with SSR enabled. Visit the local URL shown in your terminal (usually `http://localhost:3000`).

## Project Structure

```
src/
├── components/
│   ├── app/              # App-level shell components
│   │   ├── AppShell.tsx  # Layout wrapper with sidebar + topbar
│   │   ├── Sidebar.tsx   # Collapsible navigation sidebar
│   │   ├── Topbar.tsx    # Header with search, theme toggle, user menu
│   │   └── shared.tsx    # Reusable UI helpers (AiBadge, AiDisclaimer, etc.)
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── ai-sim.ts         # Simulated AI engine (local mock responses)
│   └── utils.ts          # cn() and helpers
├── pages/                # Page-level components consumed by routes
│   ├── Dashboard.tsx
│   ├── EmailGenerator.tsx
│   ├── MeetingSummarizer.tsx
│   ├── TaskPlanner.tsx
│   ├── ResearchAssistant.tsx
│   ├── ChatPage.tsx
│   └── SettingsPage.tsx
├── routes/               # TanStack Start file-based routes
│   ├── __root.tsx        # Root layout (head, providers, error boundaries)
│   ├── _layout.tsx       # App shell layout (pathless)
│   ├── _layout.index.tsx # Dashboard (/)
│   ├── _layout.email.tsx # Email Generator (/email)
│   ├── _layout.meetings.tsx
│   ├── _layout.tasks.tsx
│   ├── _layout.research.tsx
│   ├── _layout.chat.tsx
│   └── _layout.settings.tsx
├── styles.css            # Tailwind entry + custom oklch design tokens
└── router.tsx            # Router configuration
```

## AI Simulation

All AI responses are simulated locally via `src/lib/ai-sim.ts`. This lets the app demonstrate realistic workflows without requiring a backend API key. When you're ready to integrate a real AI provider (e.g., OpenAI, Anthropic), replace the simulated functions with actual API calls inside `createServerFn` handlers.

## Design System

The app uses a custom SaaS design system built on Tailwind CSS v4:

- **Color tokens** defined in `src/styles.css` using `oklch()` for perceptually uniform theming.
- **Semantic variables**: `--background`, `--foreground`, `--primary`, `--accent`, `--muted`, etc.
- **Dark mode** toggled via a class on `document.documentElement` and persisted to `localStorage`.
- **No raw color classes** in components — everything references semantic tokens.

## Notes

- The app is a **frontend prototype**. Data persistence uses `localStorage`.
- For production deployment, connect a backend (e.g., Lovable Cloud / Supabase) and replace simulated AI functions with real model calls.
- Every AI-generated section displays an `AiDisclaimer` reminder: *"AI-generated content may require human review."*
