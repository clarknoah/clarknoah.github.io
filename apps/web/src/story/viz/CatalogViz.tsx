import { animate, createAnimatable, stagger, svg } from 'animejs'
import { useRef } from 'react'
import { useAnime } from '../anime'
import { at } from './palette'

// Book of Apps: a multicolour catalog of app tiles pops in radially, dependency edges
// draw on, then hovering a tile lights up its dependency subtree. (DIA.)
const COLS = 4
const ROWS = 3
const tiles = Array.from({ length: COLS * ROWS }, (_, i) => ({
  i,
  x: (i % COLS) * 26 + 14,
  y: Math.floor(i / COLS) * 26 + 16,
  c: at(i),
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

// adjacency (undirected) for the hover subtree highlight
const adj = new Map<number, Set<number>>()
for (const t of tiles) adj.set(t.i, new Set([t.i]))
for (const [a, b] of edges) {
  adj.get(a)?.add(b)
  adj.get(b)?.add(a)
}

interface Anim {
  opacity: (v: number) => void
}

export function CatalogViz({ active }: { role: unknown; active: boolean }) {
  const tileAnims = useRef<Anim[]>([])

  const ref = useAnime<SVGSVGElement>(active, ({ root, reduceMotion }) => {
    const d = (full: number) => (reduceMotion ? 0 : full)

    // edges draw on
    const drawables = svg.createDrawable('.cat-edge')
    animate(drawables, {
      draw: ['0 0', '0 1'],
      duration: d(620),
      delay: reduceMotion ? 0 : stagger(70, { start: 700 }),
      ease: 'inOutQuad',
    })

    // tiles pop in radially from the centre
    animate('.cat-tile', {
      opacity: [0, 1],
      scale: [0, 1],
      duration: d(420),
      delay: reduceMotion ? 0 : stagger(55, { grid: [COLS, ROWS], from: 'center' }),
      ease: 'out(3)',
    })

    // per-tile animatables for smooth 60fps hover dimming
    tileAnims.current = Array.from(root.querySelectorAll<SVGRectElement>('.cat-tile')).map(
      (el) => createAnimatable(el, { opacity: 220, ease: 'out(3)' }) as unknown as Anim,
    )
  })

  const highlight = (id: number | null) => {
    const connected = id === null ? null : adj.get(id)
    tileAnims.current.forEach((a, i) => a.opacity(id === null || connected?.has(i) ? 1 : 0.16))
  }

  return (
    <svg ref={ref} viewBox="0 0 110 92" className="w-full max-w-[480px]" aria-hidden>
      <title>Book of Apps: catalog to dependency graph</title>
      {edges.map(([a, b]) => {
        const ta = tiles[a]
        const tb = tiles[b]
        if (!ta || !tb) return null
        return (
          <line
            key={`${a}-${b}`}
            className="cat-edge"
            x1={ta.x + 8}
            y1={ta.y + 8}
            x2={tb.x + 8}
            y2={tb.y + 8}
            stroke={ta.c}
            strokeWidth={0.7}
            opacity={0.7}
          />
        )
      })}
      {tiles.map((t) => (
        <rect
          key={t.i}
          className="cat-tile"
          x={t.x}
          y={t.y}
          width={16}
          height={16}
          rx={2.5}
          fill={`color-mix(in oklab, ${t.c} 24%, transparent)`}
          stroke={t.c}
          strokeWidth={0.8}
          style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center' }}
          onPointerEnter={() => highlight(t.i)}
          onPointerLeave={() => highlight(null)}
        />
      ))}
    </svg>
  )
}
