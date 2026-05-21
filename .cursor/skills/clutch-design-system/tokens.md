# Clutch — design tokens reference

Source of truth: `src/app/globals.css`

## Light mode (`:root`)

| Token | Hex | Notes |
|-------|-----|-------|
| `--background` | `#e8e2d6` | Sable canvas |
| `--foreground` | `#1a1a1a` | Primary text |
| `--card` | `#f7f3ec` | Elevated surfaces |
| `--muted-foreground` | `#5c564e` | Secondary text |
| `--primary` | `#ccff00` | Lime — buttons, accents |
| `--primary-foreground` | `#000000` | Text on lime |
| `--text-accent` | `#4a5a00` | Links on light surfaces |
| `--border` | `#cfc6b8` | Borders |
| `--ring` | `#9eb800` | Focus ring |
| `--highlight` | `#5b21b6` | Deep saturated violet — fills |
| `--text-highlight` | `#4c1d95` | Violet text on light surfaces |
| `--destructive` | `#dc2626` | Errors |

## Dark mode (`.dark`)

| Token | Hex |
|-------|-----|
| `--background` | `#0a0a0a` |
| `--foreground` | `#e8e2d6` |
| `--card` | `#141414` |
| `--primary` | `#ccff00` |
| `--highlight` | `#6d28d9` |
| `--text-highlight` | `#a78bfa` |
| `--text-accent` | `#ccff00` |
| `--border` | `#2a2a2a` |

## Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `0.5rem` |
| `--radius` | `1rem` |
| `--radius-md` | `1.5rem` |
| `--radius-lg` | `2rem` |
| `--radius-xl` | `3rem` |

## Utility classes

| Class | Purpose |
|-------|---------|
| `.font-display` | Plus Jakarta Sans |
| `.text-eyebrow` | Uppercase label (add `text-text-accent`) |
| `.text-display-lg` | Responsive hero size |
| `.glass-panel` | Frosted panel |
| `.glow-lime` | Lime glow on icon badges |
| `.text-accent` | Link/emphasis color |
| `.app-surface` | Body gradient |
| `.onboarding-surface` | Flow page gradient |
