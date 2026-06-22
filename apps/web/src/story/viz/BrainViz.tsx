import { motion } from 'motion/react'

// fMRI activation as a glowing multicolour heatmap. (CMU / NDERF.)
const blobs = [
  { x: 38, y: 35, r: 12, c: '#2f7dc4' }, // blue
  { x: 61, y: 37, r: 14, c: '#8157d6' }, // violet
  { x: 50, y: 51, r: 16, c: '#c95f33' }, // terracotta
  { x: 33, y: 57, r: 11, c: '#3a9663' }, // green
  { x: 65, y: 58, r: 13, c: '#e0a23b' }, // amber
  { x: 47, y: 69, r: 12, c: '#d2683f' }, // orange
  { x: 54, y: 28, r: 9, c: '#5ec8c0' }, // teal
]

export function BrainViz({ active }: { role: unknown; active: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[460px]" aria-hidden>
      <title>fMRI activation</title>
      <defs>
        <filter id="brainGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        {blobs.map((b, i) => (
          <radialGradient key={b.c} id={`brainG${i}`}>
            <stop offset="0%" stopColor={b.c} stopOpacity="0.95" />
            <stop offset="60%" stopColor={b.c} stopOpacity="0.45" />
            <stop offset="100%" stopColor={b.c} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* brain silhouette */}
      <path
        d="M50 14 C32 14 20 28 20 44 C20 66 34 86 50 86 C66 86 80 66 80 44 C80 28 68 14 50 14 Z"
        fill="color-mix(in oklab, var(--color-accent) 4%, transparent)"
        stroke="var(--color-border-strong)"
        strokeWidth={0.8}
      />
      <path d="M50 16 L50 84" stroke="var(--color-border)" strokeWidth={0.5} fill="none" />

      {/* glowing activation */}
      <g filter="url(#brainGlow)">
        {blobs.map((b, i) => (
          <motion.circle
            key={b.c}
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill={`url(#brainG${i})`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              active
                ? { opacity: [0, 0.95, 0.55, 0.9], scale: [0.6, 1.15, 0.92, 1.1] }
                : { opacity: 0 }
            }
            transition={{
              duration: 3 + (i % 3),
              repeat: active ? Number.POSITIVE_INFINITY : 0,
              repeatType: 'reverse',
              delay: 0.15 + i * 0.22,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: `${b.x}px ${b.y}px` }}
          />
        ))}
      </g>
    </svg>
  )
}
