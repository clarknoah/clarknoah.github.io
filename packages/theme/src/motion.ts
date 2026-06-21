/**
 * Centralized Motion presets. Import these instead of hand-rolling transitions,
 * so timing is consistent and `prefers-reduced-motion` can be honored in one place.
 *
 * Typed loosely (Variants-compatible) to avoid a hard dependency on motion's types here.
 */
import { tokens } from './tokens'

const sec = (ms: string) => Number.parseInt(ms, 10) / 1000

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
}

export const duration = {
  fast: sec(tokens.motion.fast),
  base: sec(tokens.motion.base),
  slow: sec(tokens.motion.slow),
  settle: sec(tokens.motion.settle),
}

/** Fade + rise. The default reveal for sections and cards. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
}

/** Container that staggers its children's reveals. */
export const stagger = (gap = 0.06) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap } },
})

/** Standard scroll-reveal props for a section (reveal once on enter). */
export const reveal = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-10% 0px' },
} as const
