import { motion } from 'motion/react'
import { at } from './palette'

// Quatt: a 20k-device telemetry swarm coalescing into the multicolour Atlas graph. (Quatt.)
const N = 120
const dots = Array.from({ length: N }, (_, i) => {
  const sx = 50 + Math.cos(i * 1.7) * (30 + ((i * 13) % 20))
  const sy = 50 + Math.sin(i * 2.3) * (30 + ((i * 7) % 20))
  const a = i * 2.39996
  const r = 6 + Math.sqrt(i) * 3.5
  const tx = 50 + r * Math.cos(a) * 0.82
  const ty = 50 + r * Math.sin(a) * 0.82
  return { sx, sy, tx, ty, c: at(i), delay: 0.2 + i * 0.012 }
})
const edges: [number, number][] = [
  [0, 5],
  [5, 12],
  [12, 21],
  [3, 9],
  [9, 18],
  [1, 8],
  [8, 17],
  [2, 11],
  [11, 22],
  [6, 14],
  [14, 25],
  [4, 16],
]

export function SwarmAtlasViz({ active }: { role: unknown; active: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[500px]" aria-hidden>
      <title>Telemetry swarm assembling into the Atlas graph</title>
      <defs>
        <filter id="swarmGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      {edges.map(([a, b]) => {
        const da = dots[a]
        const db = dots[b]
        if (!da || !db) return null
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={da.tx}
            y1={da.ty}
            x2={db.tx}
            y2={db.ty}
            stroke={da.c}
            strokeWidth={0.6}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={active ? { pathLength: 1, opacity: 0.6 } : { opacity: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          />
        )
      })}
      <g filter="url(#swarmGlow)">
        {dots.map((d, i) => (
          <motion.circle
            key={`d-${i}-${d.tx.toFixed(1)}`}
            r={1}
            fill={d.c}
            initial={{ cx: d.sx, cy: d.sy, opacity: 0 }}
            animate={
              active
                ? { cx: d.tx, cy: d.ty, opacity: [0, 1, 0.7] }
                : { cx: d.sx, cy: d.sy, opacity: 0 }
            }
            transition={{ duration: 1.7, delay: d.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </g>
    </svg>
  )
}
