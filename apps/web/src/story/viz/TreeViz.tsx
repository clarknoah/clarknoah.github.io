import { motion } from 'motion/react'

// Curriculum tree branching out, each branch its own colour. (General Assembly.)
const C0 = '#2f7dc4'
const C1 = '#8157d6'
const C2 = '#3a9663'
const ACC = '#e0a23b'

const edges = [
  { x1: 55, y1: 10, x2: 22, y2: 42, c: C0, d: 0.3 },
  { x1: 55, y1: 10, x2: 55, y2: 42, c: C1, d: 0.3 },
  { x1: 55, y1: 10, x2: 88, y2: 42, c: C2, d: 0.3 },
  { x1: 22, y1: 42, x2: 12, y2: 78, c: C0, d: 0.9 },
  { x1: 22, y1: 42, x2: 32, y2: 78, c: C0, d: 0.9 },
  { x1: 55, y1: 42, x2: 48, y2: 78, c: C1, d: 0.9 },
  { x1: 55, y1: 42, x2: 62, y2: 78, c: C1, d: 0.9 },
  { x1: 88, y1: 42, x2: 78, y2: 78, c: C2, d: 0.9 },
  { x1: 88, y1: 42, x2: 96, y2: 78, c: C2, d: 0.9 },
]
const nodes = [
  { x: 55, y: 10, r: 4, c: ACC, d: 0 },
  { x: 22, y: 42, r: 3, c: C0, d: 0.5 },
  { x: 55, y: 42, r: 3, c: C1, d: 0.5 },
  { x: 88, y: 42, r: 3, c: C2, d: 0.5 },
  { x: 12, y: 78, r: 2.4, c: C0, d: 1.1 },
  { x: 32, y: 78, r: 2.4, c: C0, d: 1.1 },
  { x: 48, y: 78, r: 2.4, c: C1, d: 1.1 },
  { x: 62, y: 78, r: 2.4, c: C1, d: 1.1 },
  { x: 78, y: 78, r: 2.4, c: C2, d: 1.1 },
  { x: 96, y: 78, r: 2.4, c: C2, d: 1.1 },
]

export function TreeViz({ active }: { role: unknown; active: boolean }) {
  return (
    <svg viewBox="0 0 108 90" className="w-full max-w-[460px]" aria-hidden>
      <title>Curriculum tree</title>
      <defs>
        <filter id="treeGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>
      {edges.map((e) => (
        <motion.line
          key={`${e.x1}-${e.y1}-${e.x2}-${e.y2}`}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={e.c}
          strokeWidth={0.8}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.85 } : { opacity: 0 }}
          transition={{ delay: 0.3 + e.d, duration: 0.5 }}
        />
      ))}
      <g filter="url(#treeGlow)">
        {nodes.map((n) => (
          <motion.circle
            key={`${n.x}-${n.y}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.c}
            initial={{ opacity: 0, scale: 0 }}
            animate={active ? { opacity: 1, scale: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 + n.d, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          />
        ))}
      </g>
    </svg>
  )
}
