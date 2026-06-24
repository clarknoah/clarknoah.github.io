import { motion } from 'motion/react'
import { at } from './palette'

// iAm: multicolour manifestations appear in real time and link into a living graph. (iAm.)
const nodes = [
  { x: 50, y: 50 },
  { x: 32, y: 38 },
  { x: 68, y: 36 },
  { x: 24, y: 62 },
  { x: 74, y: 60 },
  { x: 44, y: 24 },
  { x: 58, y: 74 },
  { x: 16, y: 44 },
  { x: 84, y: 46 },
  { x: 40, y: 68 },
  { x: 62, y: 22 },
  { x: 30, y: 80 },
]
const edges: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [0, 5],
  [0, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [5, 10],
  [9, 11],
  [6, 4],
]

export function ThoughtStreamViz({ active }: { role: unknown; active: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[460px]" aria-hidden>
      <title>Live thought-stream graph</title>
      <defs>
        <filter id="tsGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
      </defs>
      {edges.map(([a, b]) => {
        const na = nodes[a]
        const nb = nodes[b]
        if (!na || !nb) return null
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke={at(a)}
            strokeWidth={0.6}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={active ? { pathLength: 1, opacity: 0.55 } : { opacity: 0 }}
            transition={{ delay: 0.6 + Math.max(a, b) * 0.28, duration: 0.5 }}
          />
        )
      })}
      <g filter="url(#tsGlow)">
        {nodes.map((n, i) => (
          <motion.circle
            key={`${n.x}-${n.y}`}
            cx={n.x}
            cy={n.y}
            r={i === 0 ? 3.2 : 2.2}
            fill={at(i)}
            initial={{ opacity: 0, scale: 0 }}
            animate={active ? { opacity: [0, 1, 0.9], scale: [0, 1.6, 1] } : { opacity: 0 }}
            transition={{ delay: 0.4 + i * 0.28, duration: 0.55 }}
            style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          />
        ))}
      </g>
    </svg>
  )
}
