import { motion } from 'motion/react'

// fMRI activation: a stylized brain with regions pulsing hot. (CMU / NDERF.)
const regions = [
  [38, 36],
  [60, 38],
  [50, 52],
  [34, 56],
  [64, 58],
  [48, 68],
]

export function BrainViz({ active }: { role: unknown; active: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[440px]" aria-hidden>
      <title>fMRI activation</title>
      {/* brain silhouette */}
      <path
        d="M50 14 C32 14 20 28 20 44 C20 66 34 86 50 86 C66 86 80 66 80 44 C80 28 68 14 50 14 Z"
        fill="color-mix(in oklab, var(--color-accent) 6%, transparent)"
        stroke="var(--color-border-strong)"
        strokeWidth={0.8}
      />
      <path d="M50 16 L50 84" stroke="var(--color-border)" strokeWidth={0.6} fill="none" />
      <path d="M30 40 q10 -6 0 12 q-8 6 4 10" stroke="var(--color-border)" strokeWidth={0.5} fill="none" />
      <path d="M70 40 q-10 -6 0 12 q8 6 -4 10" stroke="var(--color-border)" strokeWidth={0.5} fill="none" />
      {/* activation hotspots */}
      {regions.map(([cx, cy], i) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--color-accent)"
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: [0, 0.85, 0.35, 0.8], scale: [0, 1.3, 1, 1.2] } : { opacity: 0 }}
          transition={{ duration: 2.4, repeat: active ? Number.POSITIVE_INFINITY : 0, repeatType: 'reverse', delay: 0.2 + i * 0.25 }}
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
        />
      ))}
    </svg>
  )
}
