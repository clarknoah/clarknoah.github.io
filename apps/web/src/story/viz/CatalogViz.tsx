import { motion } from 'motion/react'

// Book of Apps: a catalog of application tiles, then dependency lines draw and a graph emerges. (DIA.)
const tiles = Array.from({ length: 12 }, (_, i) => ({
  x: (i % 4) * 26 + 14,
  y: Math.floor(i / 4) * 26 + 16,
}))
const edges: [number, number][] = [
  [0, 1],
  [1, 5],
  [5, 6],
  [2, 6],
  [6, 10],
  [3, 7],
  [7, 11],
  [4, 8],
  [8, 9],
  [0, 4],
  [9, 10],
]

export function CatalogViz({ active }: { role: unknown; active: boolean }) {
  return (
    <svg viewBox="0 0 110 92" className="w-full max-w-[480px]" aria-hidden>
      <title>Book of Apps: catalog to dependency graph</title>
      {edges.map(([a, b], i) => {
        const ta = tiles[a]
        const tb = tiles[b]
        if (!ta || !tb) return null
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={ta.x + 8}
            y1={ta.y + 8}
            x2={tb.x + 8}
            y2={tb.y + 8}
            stroke="var(--color-accent)"
            strokeWidth={0.6}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={active ? { pathLength: 1, opacity: 0.5 } : { opacity: 0 }}
            transition={{ delay: 1.2 + i * 0.08, duration: 0.5 }}
          />
        )
      })}
      {tiles.map((t, i) => (
        <motion.rect
          key={`${t.x}-${t.y}`}
          x={t.x}
          y={t.y}
          width={16}
          height={16}
          rx={2}
          fill="var(--color-surface-raised)"
          stroke="var(--color-border-strong)"
          strokeWidth={0.6}
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
        />
      ))}
    </svg>
  )
}
