import { motion } from 'motion/react'

// Curriculum tree branching out: topic -> skills -> lessons. (General Assembly.)
const root = { x: 55, y: 10 }
const l1 = [
  { x: 22, y: 42 },
  { x: 55, y: 42 },
  { x: 88, y: 42 },
]
const l2 = [
  { x: 12, y: 78 },
  { x: 32, y: 78 },
  { x: 48, y: 78 },
  { x: 62, y: 78 },
  { x: 78, y: 78 },
  { x: 96, y: 78 },
]
const edges: [{ x: number; y: number }, { x: number; y: number }, number][] = [
  [root, l1[0] as { x: number; y: number }, 0],
  [root, l1[1] as { x: number; y: number }, 0],
  [root, l1[2] as { x: number; y: number }, 0],
  [l1[0] as { x: number; y: number }, l2[0] as { x: number; y: number }, 1],
  [l1[0] as { x: number; y: number }, l2[1] as { x: number; y: number }, 1],
  [l1[1] as { x: number; y: number }, l2[2] as { x: number; y: number }, 1],
  [l1[1] as { x: number; y: number }, l2[3] as { x: number; y: number }, 1],
  [l1[2] as { x: number; y: number }, l2[4] as { x: number; y: number }, 1],
  [l1[2] as { x: number; y: number }, l2[5] as { x: number; y: number }, 1],
]
const nodes = [
  { ...root, r: 4, d: 0 },
  ...l1.map((n) => ({ ...n, r: 3, d: 0.5 })),
  ...l2.map((n) => ({ ...n, r: 2.2, d: 1.1 })),
]

export function TreeViz({ active }: { role: unknown; active: boolean }) {
  return (
    <svg viewBox="0 0 108 90" className="w-full max-w-[460px]" aria-hidden>
      <title>Curriculum tree</title>
      {edges.map(([a, b, depth], i) => (
        <motion.line
          key={`${a.x}-${a.y}-${b.x}-${b.y}`}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="var(--color-border-strong)"
          strokeWidth={0.7}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.8 } : { opacity: 0 }}
          transition={{ delay: 0.3 + depth * 0.6 + i * 0.05, duration: 0.45 }}
        />
      ))}
      {nodes.map((n) => (
        <motion.circle
          key={`${n.x}-${n.y}`}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="var(--color-accent)"
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 + n.d, duration: 0.3 }}
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
        />
      ))}
    </svg>
  )
}
