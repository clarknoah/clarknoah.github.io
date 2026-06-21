import { animate, motion } from 'motion/react'
import { useEffect, useState } from 'react'

// SEI: users scaled from a few hundred to 1.2M across 59 partners.
const pts = [
  [0, 96],
  [16, 92],
  [32, 84],
  [48, 70],
  [64, 50],
  [80, 26],
  [100, 8],
]
const line = `M ${pts.map((p) => `${p[0]} ${p[1]}`).join(' L ')}`
const area = `M 0 100 L ${pts.map((p) => `${p[0]} ${p[1]}`).join(' L ')} L 100 100 Z`

export function GrowthViz({ active }: { role: unknown; active: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) {
      setN(0)
      return
    }
    const controls = animate(0, 1_200_000, {
      duration: 1.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [active])

  return (
    <div className="w-full max-w-[520px]">
      <div className="font-mono text-xs uppercase tracking-widest text-text-faint">users scaled</div>
      <div className="mt-1 font-display text-6xl font-bold tracking-tight text-text tabular-nums md:text-7xl">
        {n.toLocaleString()}
      </div>
      <div className="mt-1 font-mono text-sm text-accent">across 59 enterprise partners</div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-8 h-44 w-full" aria-hidden>
        <motion.path
          d={area}
          fill="var(--color-accent)"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 0.12 } : { opacity: 0 }}
          transition={{ duration: 1.7 }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  )
}
