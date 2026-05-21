---
name: clutch-design-system
description: >-
  Clutch (profeo-mvp) UI design system — sable/lime light mode, Neon Noir dark mode,
  typography, color roles, surfaces, and component patterns. Use when creating or editing
  pages, components, layouts, forms, cards, onboarding flows, dashboards, or any UI in
  this repository. Always read this skill before writing new UI code.
---

# Clutch Design System

Read this skill **before** creating or editing any page or component in `profeo-mvp`.

## Brand

- **Light (default):** warm sable canvas + lime `#ccff00` accents — onboarding-style gradient
- **Dark (`.dark` on `<html>`):** Neon Noir — `#0a0a0a` + lime accents
- **Personality:** precise, student-friendly, high contrast where it matters

## Mandatory color rules

| Role | Token | Usage |
|------|-------|-------|
| Body text | `text-foreground` | All primary copy |
| Secondary text | `text-muted-foreground` | Subtitles, hints — never below 75% opacity for key copy |
| Headings | `text-foreground` + `font-display` | h1–h6 inherit foreground in base CSS |
| Filled buttons / badges | `bg-primary text-primary-foreground` | **Never** `text-white` on lime primary |
| Links & emphasis | `text-text-accent` | Links on current surface (olive light, lime dark) |
| Borders | `border-border` | Cards, inputs, dividers |
| Focus | `ring-ring` | Focus rings |
| Cards | `bg-card text-card-foreground` | Elevated surfaces |
| Destructive | `bg-destructive text-destructive-foreground` | Errors only |

### Never do

- `text-white` on `bg-primary` (lime needs black text → `text-primary-foreground`)
- Hardcoded `#000`, `#fff`, `bg-black`, `text-black` outside landing hero overlays
- `text-primary` for body copy on light surfaces (lime text fails WCAG)
- Mixing raw Tailwind grays instead of semantic tokens

## Typography

| Element | Classes |
|---------|---------|
| Display / page title | `font-display text-4xl font-bold tracking-tight md:text-6xl` |
| Section title | `font-display text-3xl font-bold tracking-tight` |
| Eyebrow / label | `text-eyebrow text-text-accent` |
| Body | `text-base leading-7 text-foreground/75` or `text-muted-foreground` |
| Small UI | `text-sm font-medium` |

Font: **Plus Jakarta Sans** only (`--font-plus-jakarta`). Body and display share it via `layout.tsx`.

## Surfaces

| Class | When |
|-------|------|
| `app-surface` | On `<body>` — global sable gradient (layout) |
| `onboarding-surface` | Full-page flows: onboarding, role selection |
| `glass-panel` | Floating panels, auth cards, overlays |
| `glow-lime` | Icon containers on primary lime background |

Page shell for flows:

```tsx
<div className={cn("flex min-h-screen flex-col", onboardingThemeClass)}>
```

Import: `import { onboardingThemeClass } from "@/lib/onboarding-theme"`

## Shapes & spacing

- **Buttons:** always pill — use `@/components/ui/button` (default `rounded-full`)
- **Cards:** `rounded-[2rem]` or `rounded-3xl`, `border-2 border-border`, visible shadow
- **Inputs:** underline style via `@/components/ui/input` — do not add boxed borders
- **Grid rhythm:** 8px scale — `gap-4`, `gap-6`, `p-6`, `md:p-8`, `md:px-12`
- **Container padding:** `px-6 md:px-12`

## Reuse before inventing

| Need | Use |
|------|-----|
| Primary button | `<Button>` |
| Role / large choice | `<RoleChoiceCard>` |
| Small multi-choice | `<ChoiceChip>` / `<ChoiceChipGroup>` |
| Onboarding layout | `<OnboardingShell>` + `<OnboardingStepTitle>` |
| Auth split layout | Pattern from `HomeSignIn.tsx` / sign-up page |
| Auth header bar | `<AuthPageHeader>` |
| Theme switch | `<ThemeToggle>` |
| Progress | `<OnboardingProgress>` |

## Page templates

### Marketing / auth split (landing keeps dark hero left)

```tsx
<div className="grid min-h-screen bg-background text-foreground lg:grid-cols-[1.05fr_0.95fr]">
  {/* Hero: image + dark overlay OR sable panel */}
  {/* Form panel: bg-card, glass-panel for Clerk */}
</div>
```

### Full-page flow (onboarding, role selection)

```tsx
<div className={cn("flex min-h-screen flex-col", onboardingThemeClass)}>
  <header>{/* brand + ThemeToggle */}</header>
  <main className="flex flex-1 flex-col px-6 md:px-12">{/* content */}</main>
</div>
```

### Dashboard (with Navbar)

- `bg-background` sections, `bg-card` cards
- `border-border`, `text-foreground`, primary CTAs via `<Button>`

## Card visibility checklist

Cards must stand out from sable background:

1. `bg-card` (not `bg-background`)
2. `border-2 border-border` or stronger on hover `hover:border-primary`
3. Shadow: `shadow-[0_20px_60px_-36px_rgba(26,26,26,0.22)]`
4. Titles: `font-display font-bold text-foreground`
5. Eyebrows: `text-eyebrow text-text-accent` (not washed-out muted)

## Theme toggle

- Light = default `:root` tokens in `src/app/globals.css`
- Dark = `.dark` class on `<html>` via `ThemeProvider`
- Landing `/` forces dark on hero; rest of app respects user preference

## File references

- Tokens & utilities: `src/app/globals.css`
- UI primitives: `src/components/ui/*`
- Theme helpers: `src/components/theme/*`
- Onboarding: `src/components/onboarding/*`

## Pre-ship UI checklist

- [ ] Semantic tokens only (no raw black/white for app chrome)
- [ ] Headings use `font-display` + `text-foreground`
- [ ] Primary actions: `bg-primary text-primary-foreground`
- [ ] Cards readable on sable (`bg-card`, border, shadow)
- [ ] Reused existing components where possible
- [ ] `ThemeToggle` on full-page flows that support dark mode

For token hex values, see [tokens.md](tokens.md).
