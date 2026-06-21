/**
 * Canonical design tokens. Single source of truth for the whole site.
 *
 * - JS consumers (Cytoscape, Motion) import `tokens` directly.
 * - CSS consumers (Tailwind utilities, instant first paint) read `tokens.generated.css`,
 *   which `tools/gen-theme` derives from `cssVars` below. Edit values HERE only.
 *
 * Aesthetic: dark technical data-console. Deliberately not Inter + indigo.
 */

export const tokens = {
  color: {
    ink: '#0a0c10', // page background
    surface: '#12151b',
    surfaceRaised: '#181c24',
    border: '#252b35',
    borderStrong: '#323a47',
    text: '#e7eaf0',
    textMuted: '#9aa4b2',
    textFaint: '#5f6977',
    accent: '#4dd0c4', // teal signal — links, focus, terminal caret
    accentDim: '#2f8079',
    danger: '#f78c6c',
  },
  /** Per-thread hues. Keys match ThreadId in @noahclark/schema. */
  thread: {
    graph: '#5eb1ef',
    consciousness: '#c792ea',
    intelligence: '#f78c6c',
    scale: '#7ee787',
    'ai-native': '#f5b942',
  },
  font: {
    display: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
    body: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  },
  space: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px', '2xl': '64px', '3xl': '96px' },
  radius: { sm: '4px', md: '8px', lg: '14px', full: '999px' },
  motion: {
    fast: '160ms',
    base: '280ms',
    slow: '520ms',
    settle: '900ms',
    // easings
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const

export type Tokens = typeof tokens
export type ThreadColorKey = keyof typeof tokens.thread

/**
 * Tailwind v4 `@theme` variables, derived from `tokens`. Tailwind turns each
 * `--color-*` into utilities (`bg-ink`, `text-accent`, `text-thread-graph`, …) and
 * exposes them as real CSS custom properties for `var()` use.
 *
 * Consumed by `tools/gen-theme` to emit `tokens.generated.css`. Edit values in `tokens`.
 */
export const themeVars: Record<string, string> = {
  '--color-ink': tokens.color.ink,
  '--color-surface': tokens.color.surface,
  '--color-surface-raised': tokens.color.surfaceRaised,
  '--color-border': tokens.color.border,
  '--color-border-strong': tokens.color.borderStrong,
  '--color-text': tokens.color.text,
  '--color-text-muted': tokens.color.textMuted,
  '--color-text-faint': tokens.color.textFaint,
  '--color-accent': tokens.color.accent,
  '--color-accent-dim': tokens.color.accentDim,
  '--color-danger': tokens.color.danger,
  '--color-thread-graph': tokens.thread.graph,
  '--color-thread-consciousness': tokens.thread.consciousness,
  '--color-thread-intelligence': tokens.thread.intelligence,
  '--color-thread-scale': tokens.thread.scale,
  '--color-thread-ai-native': tokens.thread['ai-native'],
  '--font-display': tokens.font.display,
  '--font-body': tokens.font.body,
  '--font-mono': tokens.font.mono,
  '--radius-sm': tokens.radius.sm,
  '--radius-md': tokens.radius.md,
  '--radius-lg': tokens.radius.lg,
}
