/**
 * Canonical design tokens. Single source of truth for the whole site.
 *
 * Two palettes (light default, dark) keyed off `[data-theme]`. JS reads `tokens`;
 * CSS/Tailwind read `tokens.generated.css`, derived by `tools/gen-theme`. Edit values HERE.
 *
 * Direction: refined-technical, cool. A blueprint palette: cool near-white paper, ink text,
 * and a deep architect's blue accent (deliberately not the warm-cream/amber look).
 * Two voices: Newsreader (an editorial serif, the human voice) for prose and headings,
 * IBM Plex Mono (the system voice) for labels, code, data, and UI chrome. Serif-for-voice
 * is a deliberate move away from the neutral-grotesk look that now reads as a machine default.
 */

export interface ColorPalette {
  ink: string // page background
  surface: string
  surfaceRaised: string
  border: string
  borderStrong: string
  text: string
  textMuted: string
  textFaint: string
  accent: string
  accentDim: string
  danger: string
}

export const palettes: { light: ColorPalette; dark: ColorPalette } = {
  light: {
    ink: '#f6f7f9', // cool near-white paper
    surface: '#fcfcfe',
    surfaceRaised: '#eef0f4',
    border: '#e1e4ea',
    borderStrong: '#c9cfd9',
    text: '#14181f', // near-black ink, slightly cool
    textMuted: '#59626f',
    textFaint: '#98a0ad',
    accent: '#27457d', // deep architect's blue, ~8:1 on the cool paper
    accentDim: '#7790b8',
    danger: '#b23b3b',
  },
  dark: {
    ink: '#11151c',
    surface: '#161b24',
    surfaceRaised: '#1e2531',
    border: '#2a3342',
    borderStrong: '#3b4658',
    text: '#e6e9ef',
    textMuted: '#9aa3b2',
    textFaint: '#626c7d',
    accent: '#6f9ae0',
    accentDim: '#3f5b86',
    danger: '#e08a7c',
  },
}

/** Thread hues — a cohesive cool set for the blueprint palette. Keys match ThreadId. */
export const thread = {
  graph: '#3a6ea0',
  consciousness: '#7a5cae',
  intelligence: '#5a6b85',
  scale: '#3f8060',
  'ai-native': '#2a8f8f',
} as const

export const font = {
  // Newsreader: warm editorial serif with an optical-size axis (set font-optical-sizing: auto).
  display: "'Newsreader', Georgia, 'Times New Roman', serif",
  body: "'Newsreader', Georgia, 'Times New Roman', serif",
  mono: "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
}

export const space = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px', '2xl': '64px', '3xl': '96px' }
export const radius = { sm: '4px', md: '8px', lg: '14px', full: '999px' }
export const motion = {
  fast: '160ms',
  base: '280ms',
  slow: '520ms',
  settle: '900ms',
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}

/** Default (light) tokens for any static JS use. Theme-reactive code should read CSS vars. */
export const tokens = {
  color: palettes.light,
  thread,
  font,
  space,
  radius,
  motion,
} as const

export type Tokens = typeof tokens
export type ThreadColorKey = keyof typeof thread

/** Build the colour half of the Tailwind `@theme` var map for a given palette. */
export function colorVars(p: ColorPalette): Record<string, string> {
  return {
    '--color-ink': p.ink,
    '--color-surface': p.surface,
    '--color-surface-raised': p.surfaceRaised,
    '--color-border': p.border,
    '--color-border-strong': p.borderStrong,
    '--color-text': p.text,
    '--color-text-muted': p.textMuted,
    '--color-text-faint': p.textFaint,
    '--color-accent': p.accent,
    '--color-accent-dim': p.accentDim,
    '--color-danger': p.danger,
  }
}

/** Theme-independent vars (threads, fonts, radii) — emitted once into `@theme`. */
export const staticVars: Record<string, string> = {
  '--color-thread-graph': thread.graph,
  '--color-thread-consciousness': thread.consciousness,
  '--color-thread-intelligence': thread.intelligence,
  '--color-thread-scale': thread.scale,
  '--color-thread-ai-native': thread['ai-native'],
  '--font-display': font.display,
  '--font-body': font.body,
  '--font-mono': font.mono,
  '--radius-sm': radius.sm,
  '--radius-md': radius.md,
  '--radius-lg': radius.lg,
}
