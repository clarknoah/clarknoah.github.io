import {
  animate,
  createAnimatable,
  createDraggable,
  createTimer,
  stagger,
  svg,
} from 'animejs'
import { useRef } from 'react'
import { useAnime } from '../anime'
import { at } from './palette'

// iAm thought-stream: multicolour manifestation nodes appear and link into a living
// graph. Edges draw on as links form, nodes breathe on a fixed-rate timer, and
// thought-pulses ride each edge. Grab a node and the cluster settles on release
// springs; hovering a node intensifies its first-order neighbours. (iAm.)

interface Node {
  x: number
  y: number
  r: number
}

const nodes: Node[] = [
  { x: 50, y: 50, r: 3.4 },
  { x: 32, y: 38, r: 2.4 },
  { x: 68, y: 36, r: 2.4 },
  { x: 24, y: 62, r: 2.2 },
  { x: 74, y: 60, r: 2.2 },
  { x: 44, y: 24, r: 2.2 },
  { x: 58, y: 74, r: 2.2 },
  { x: 16, y: 44, r: 2 },
  { x: 84, y: 46, r: 2 },
  { x: 40, y: 68, r: 2 },
  { x: 62, y: 22, r: 2 },
  { x: 30, y: 80, r: 2 },
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

// undirected adjacency (incl. self) for the hover neighbour-intensify
const adj = new Map<number, Set<number>>()
for (let i = 0; i < nodes.length; i++) adj.set(i, new Set([i]))
for (const [a, b] of edges) {
  adj.get(a)?.add(b)
  adj.get(b)?.add(a)
}

// edges incident on each node, for live relinking while dragging
const incident = new Map<number, number[]>()
for (let i = 0; i < nodes.length; i++) incident.set(i, [])
edges.forEach(([a, b], ei) => {
  incident.get(a)?.push(ei)
  incident.get(b)?.push(ei)
})

interface OpacitySetter {
  opacity: (v: number) => void
}
interface ScaleSetter {
  scale: (v: number) => void
}

const VB = 100 // viewBox is 0 0 100 100

export function ThoughtStreamViz({ active }: { role: unknown; active: boolean }) {
  const nodeOpacity = useRef<OpacitySetter[]>([])
  const nodeScale = useRef<ScaleSetter[]>([])

  const ref = useAnime<SVGSVGElement>(active, ({ root, reduceMotion }) => {
    const d = (full: number) => (reduceMotion ? 0 : full)
    const svgEl = root as unknown as SVGSVGElement

    // live position of every node in viewBox units (mutated by drag)
    const pos = nodes.map((n) => ({ x: n.x, y: n.y }))

    // px-per-viewBox-unit, so drag deltas in screen space map back to geometry
    const pxScale = () => {
      const rect = svgEl.getBoundingClientRect()
      return rect.width > 0 ? rect.width / VB : 1
    }

    // rewrite an edge line + its motion path from current node positions
    const relinkEdge = (ei: number) => {
      const pair = edges[ei]
      if (!pair) return
      const a = pos[pair[0]]
      const b = pos[pair[1]]
      if (!a || !b) return
      const line = root.querySelector<SVGLineElement>(`.ts-edge[data-ei="${ei}"]`)
      if (line) {
        line.setAttribute('x1', String(a.x))
        line.setAttribute('y1', String(a.y))
        line.setAttribute('x2', String(b.x))
        line.setAttribute('y2', String(b.y))
      }
      const path = root.querySelector<SVGPathElement>(`.ts-path[data-ei="${ei}"]`)
      if (path) path.setAttribute('d', `M${a.x},${a.y} L${b.x},${b.y}`)
    }

    // per-node opacity setters (smooth neighbour-intensify on hover)
    nodeOpacity.current = nodes.map((_, i) => {
      const el = root.querySelector<SVGCircleElement>(`.ts-node[data-i="${i}"]`)
      return createAnimatable(el as Element, {
        opacity: 240,
        ease: 'out(3)',
      }) as unknown as OpacitySetter
    })

    // per-node scale setters drive the ambient breathing onto the circle itself,
    // keeping it independent of the drag translate applied to the node group
    nodeScale.current = nodes.map((_, i) => {
      const el = root.querySelector<SVGCircleElement>(`.ts-node[data-i="${i}"]`)
      return createAnimatable(el as Element, {
        scale: reduceMotion ? 1 : 160,
        ease: 'inOut(2)',
      }) as unknown as ScaleSetter
    })

    if (reduceMotion) {
      // present the composed graph instantly, no loops, no drag
      animate('.ts-node', { opacity: 1, scale: 1, duration: 0 })
      const drawn = svg.createDrawable('.ts-edge')
      animate(drawn, { draw: '0 1', duration: 0 })
      animate('.ts-pulse', { opacity: 0, duration: 0 })
      return
    }

    // 1. nodes bloom in from the centre of the cluster. The breathing timer below
    // also drives each circle's scale, so the bloom owns scale only until a node's
    // intro finishes; bloomUntil[i] gates the timer off for that node until then.
    const bloomStep = 60
    const bloomDur = 560
    const bloomUntil = nodes.map((_, i) => i * bloomStep + bloomDur)
    animate('.ts-node', {
      opacity: [0, 1],
      scale: [0, 1.5, 1],
      duration: d(bloomDur),
      delay: stagger(bloomStep, { from: 'first' }),
      ease: 'out(3)',
    })

    // 2. edges draw on as the links form (createDrawable: animate the RETURN)
    const drawables = svg.createDrawable('.ts-edge')
    animate(drawables, {
      draw: ['0 0', '0 1'],
      duration: d(620),
      delay: stagger(70, { start: 620 }),
      ease: 'inOutQuad',
      onComplete: () => {
        // fade each finished link to its resting opacity
        animate('.ts-edge', { opacity: 0.5, duration: 360, ease: 'outQuad' })
      },
    })

    // 3. thought-pulses travel along each edge's motion path, looping
    edges.forEach((_, ei) => {
      const pathEl = root.querySelector<SVGPathElement>(`.ts-path[data-ei="${ei}"]`)
      const pulse = root.querySelector<SVGCircleElement>(`.ts-pulse[data-ei="${ei}"]`)
      if (!pathEl || !pulse) return
      animate(pulse, {
        ...svg.createMotionPath(pathEl),
        opacity: [
          { to: 0.9, duration: 120 },
          { to: 0.9, duration: 760 },
          { to: 0, duration: 220 },
        ],
        duration: 1100,
        delay: 1200 + ei * 230,
        loop: true,
        loopDelay: 900 + (ei % 4) * 360,
        ease: 'inOutQuad',
      })
    })

    // 4. fixed-rate ambient breathing: nodes pulse on one shared clock
    createTimer({
      duration: 2600,
      loop: true,
      frameRate: 30,
      onUpdate: (self) => {
        const t = self.currentTime
        const phase = (t % 2600) / 2600
        const wave = Math.sin(phase * Math.PI * 2)
        nodeScale.current.forEach((s, i) => {
          // let the intro bloom own this node's scale until its pop-in has finished
          const until = bloomUntil[i] ?? 0
          if (t < until) return
          // staggered phase per node so the cluster breathes, not pulses in lockstep
          const off = Math.sin(phase * Math.PI * 2 + i * 0.7)
          s.scale(1 + off * 0.07 + wave * 0.01)
        })
      },
    })

    // 5. every node is draggable with release-spring physics; on drag we relink
    // its incident edges live, on release the cluster settles back via the spring
    nodes.forEach((_, i) => {
      const group = root.querySelector<SVGGElement>(`.ts-grab[data-i="${i}"]`)
      if (!group) return
      const base = nodes[i]
      if (!base) return
      const sync = (drag: { x: number; y: number }) => {
        const k = pxScale()
        const p = pos[i]
        if (!p) return
        p.x = base.x + drag.x / k
        p.y = base.y + drag.y / k
        for (const ei of incident.get(i) ?? []) relinkEdge(ei)
      }
      createDraggable(group, {
        // soft tether: settle back toward the origin on release
        snap: 0,
        releaseStiffness: 26,
        releaseDamping: 0.78,
        releaseEase: 'out(3)',
        onGrab: () => {
          nodeOpacity.current[i]?.opacity(1)
        },
        onDrag: (self) => sync({ x: self.x, y: self.y }),
        onUpdate: (self) => sync({ x: self.x, y: self.y }),
        onRelease: (self) => sync({ x: self.x, y: self.y }),
        onSettle: () => {
          const p = pos[i]
          if (!p || !base) return
          p.x = base.x
          p.y = base.y
          for (const ei of incident.get(i) ?? []) relinkEdge(ei)
        },
      })
    })
  })

  // hover: intensify a node and its first-order neighbours, dim the rest
  const highlight = (id: number | null) => {
    const near = id === null ? null : adj.get(id)
    nodeOpacity.current.forEach((a, i) =>
      a.opacity(id === null || near?.has(i) ? 1 : 0.18),
    )
  }

  return (
    <svg ref={ref} viewBox="0 0 100 100" className="w-full max-w-[460px]" aria-hidden>
      <title>iAm live thought-stream graph</title>

      {/* invisible motion paths, one per edge, for the travelling pulses */}
      {edges.map(([a, b], ei) => {
        const na = nodes[a]
        const nb = nodes[b]
        if (!na || !nb) return null
        return (
          <path
            key={`p-${ei}`}
            className="ts-path"
            data-ei={ei}
            d={`M${na.x},${na.y} L${nb.x},${nb.y}`}
            fill="none"
            stroke="none"
          />
        )
      })}

      {/* edges: stroked lines so createDrawable can draw them on */}
      {edges.map(([a, b], ei) => {
        const na = nodes[a]
        const nb = nodes[b]
        if (!na || !nb) return null
        return (
          <line
            key={`e-${ei}`}
            className="ts-edge"
            data-ei={ei}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke={at(a)}
            strokeWidth={0.55}
            strokeLinecap="round"
            opacity={0.5}
          />
        )
      })}

      {/* thought-pulses: ride the motion paths */}
      {edges.map(([a], ei) => (
        <circle
          key={`pulse-${ei}`}
          className="ts-pulse"
          data-ei={ei}
          r={1}
          fill={at(a)}
          opacity={0}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}

      {/* nodes: each circle sits inside a draggable group so the drag translate
          and the breathing scale never fight each other */}
      {nodes.map((n, i) => (
        <g key={`g-${i}`} className="ts-grab" data-i={i}>
          <circle
            className="ts-node"
            data-i={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={at(i)}
            stroke={`color-mix(in oklab, ${at(i)} 70%, white)`}
            strokeWidth={0.4}
            style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center', cursor: 'grab' }}
            onPointerEnter={() => highlight(i)}
            onPointerLeave={() => highlight(null)}
          />
        </g>
      ))}
    </svg>
  )
}
