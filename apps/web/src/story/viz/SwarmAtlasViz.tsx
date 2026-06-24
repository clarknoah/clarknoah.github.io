import { animate, createTimer, stagger, svg, utils } from 'animejs'
import { useAnime } from '../anime'
import { at } from './palette'

// Quatt: a telemetry swarm of ~116 devices crystallises into the structured Atlas
// lattice. Dots fly disordered, then travel curved motion paths into a hexagonal
// grid; structural edges draw between settled nodes; signal pulses then run the
// edges continuously. (Quatt.)

// --- lattice geometry -------------------------------------------------------
// A centred hexagonal lattice: offset rows give the crystalline, load-bearing look.
const ROWS = 9
const COLS = 14
const STEP_X = 6.2
const STEP_Y = 5.4
const GRID_W = (COLS - 1) * STEP_X
const GRID_H = (ROWS - 1) * STEP_Y
const ORIGIN_X = 50 - GRID_W / 2
const ORIGIN_Y = 50 - GRID_H / 2

interface Node {
  i: number
  // lattice (target) position
  tx: number
  ty: number
  // disordered swarm (start) position
  sx: number
  sy: number
  // quadratic control point bowing the flight path
  cx: number
  cy: number
  col: number
  row: number
  c: string
}

// deterministic pseudo-random so SSR and client agree
const rnd = (seed: number) => {
  const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return v - Math.floor(v)
}

const nodes: Node[] = []
let idx = 0
for (let r = 0; r < ROWS; r++) {
  // taper the edges of a few rows so the crystal reads as a rounded lattice, not a slab
  const inset = r === 0 || r === ROWS - 1 ? 2 : r === 1 || r === ROWS - 2 ? 1 : 0
  const offset = r % 2 === 0 ? 0 : STEP_X / 2
  for (let c = inset; c < COLS - inset; c++) {
    const tx = ORIGIN_X + c * STEP_X + offset
    const ty = ORIGIN_Y + r * STEP_Y
    // swarm origin: a loose disordered cloud, biased outward from centre
    const ang = rnd(idx * 1.3 + 4) * Math.PI * 2
    const rad = 26 + rnd(idx * 2.7 + 1) * 24
    const sx = 50 + Math.cos(ang) * rad
    const sy = 50 + Math.sin(ang) * rad
    // control point: bow the path sideways for an organic, flocking arc
    const mx = (sx + tx) / 2
    const my = (sy + ty) / 2
    const bow = 14 + rnd(idx * 3.1 + 9) * 20
    const side = rnd(idx * 5.9 + 2) > 0.5 ? 1 : -1
    // perpendicular to the start->target vector
    const dx = tx - sx
    const dy = ty - sy
    const len = Math.hypot(dx, dy) || 1
    const cx = mx + (-dy / len) * bow * side
    const cy = my + (dx / len) * bow * side
    nodes.push({ i: idx, tx, ty, sx, sy, cx, cy, col: c, row: r, c: at(idx) })
    idx++
  }
}
const N = nodes.length

// --- structural Atlas edges between settled lattice neighbours ---------------
// Connect each node to its right and lower-diagonal neighbours where they exist,
// then thin to the strongest backbone so the lattice reads as structure, not mesh.
const nodeAt = new Map<string, Node>()
for (const n of nodes) nodeAt.set(`${n.row},${n.col}`, n)

const rawEdges: [number, number][] = []
for (const n of nodes) {
  const right = nodeAt.get(`${n.row},${n.col + 1}`)
  if (right) rawEdges.push([n.i, right.i])
  const down = nodeAt.get(`${n.row + 1},${n.col}`)
  if (down) rawEdges.push([n.i, down.i])
  const downR = nodeAt.get(`${n.row + 1},${n.col + 1}`)
  if (downR && (n.i + n.row) % 3 === 0) rawEdges.push([n.i, downR.i])
}
// thin: keep ~62% of candidate edges for an open, legible structure
const edges = rawEdges.filter((_, k) => rnd(k * 7.3 + 6) > 0.38)

// telemetry signal pulses that ride the settled edges after crystallisation
const PULSE_COUNT = 7
const PULSES = Array.from({ length: PULSE_COUNT }, (_, k) => ({
  key: `pulse-${k}`,
  c: at(k + 2),
}))

export function SwarmAtlasViz({ active }: { role: unknown; active: boolean }) {
  const ref = useAnime<SVGSVGElement>(active, ({ root, reduceMotion }) => {
    const d = (full: number) => (reduceMotion ? 0 : full)

    if (reduceMotion) {
      // present the composed lattice instantly: settle dots, draw edges fully
      const dots = root.querySelectorAll<SVGCircleElement>('.swarm-dot')
      dots.forEach((el, i) => {
        const n = nodes[i]
        if (!n) return
        utils.set(el, { translateX: n.tx, translateY: n.ty, opacity: 0.85, scale: 1 })
      })
      const drawn = svg.createDrawable('.atlas-edge')
      animate(drawn, { draw: '0 1', duration: 0 })
      utils.set('.atlas-edge', { opacity: 0.5 })
      return
    }

    // 1) seed the swarm: every dot starts at its disordered cloud position, faint
    const dotEls = Array.from(root.querySelectorAll<SVGCircleElement>('.swarm-dot'))
    dotEls.forEach((el, i) => {
      const n = nodes[i]
      if (!n) return
      utils.set(el, { translateX: n.sx, translateY: n.sy, opacity: 0, scale: 0.4 })
    })

    // 2) flicker the swarm alive (telemetry waking up), then crystallise each dot
    //    along its curved motion path into the lattice. Stagger + per-dot jitter
    //    gives organic flocking timing.
    dotEls.forEach((el, i) => {
      const n = nodes[i]
      const pathEl = root.querySelector<SVGPathElement>(`#flight-${i}`)
      if (!n || !pathEl) return
      const jitter = rnd(i * 9.2 + 3) * 420
      // fade/scale the dot up as it begins to move
      animate(el, {
        opacity: [0, 0.5, 0.85],
        scale: [0.4, 1.25, 1],
        duration: 900,
        delay: 200 + i * 6 + jitter,
        ease: 'out(2)',
      })
      // travel the curved path from swarm origin to lattice seat
      animate(el, {
        ...svg.createMotionPath(pathEl),
        duration: 1500 + rnd(i * 4.4 + 8) * 700,
        delay: 200 + i * 6 + jitter,
        ease: 'inOut(3)',
      })
    })

    // total time for the slowest dot to settle, so edges wait for structure
    const settleEnd = 200 + (N - 1) * 6 + 420 + 2200
    // when the staggered edge draw has finished, so pulses only ride settled edges
    const edgeDrawEnd = settleEnd + 26 * Math.ceil(edges.length / 2) + 540

    // 3) structural edges draw on between settled nodes
    const drawn = svg.createDrawable('.atlas-edge')
    animate(drawn, {
      draw: ['0 0', '0 1'],
      duration: d(540),
      delay: stagger(26, { start: settleEnd, from: 'center' }),
      ease: 'inOutQuad',
    })
    animate('.atlas-edge', {
      opacity: [0, 0.42],
      duration: d(540),
      delay: stagger(26, { start: settleEnd, from: 'center' }),
      ease: 'out(2)',
    })

    // 4) ambient settle: a slow shared breath so the crystal is never fully static.
    //    Write to style.opacity (the same channel the entry animation uses) so the
    //    breath composes with anime's inline opacity instead of being masked by it,
    //    and hold it back until the dots have settled so it never fights the fade-in.
    createTimer({
      duration: 3200,
      loop: true,
      frameRate: 30,
      onUpdate: (self) => {
        if (self.currentTime < settleEnd) return
        const wave = Math.sin(self.iterationProgress * Math.PI * 2)
        for (const el of dotEls) el.style.opacity = (0.78 + wave * 0.08).toFixed(3)
      },
    })

    // 5) telemetry signal pulses run the edges continuously after the structure
    //    has drawn. Each pulse rides one edge at a time on a fixed-rate loop.
    const pulseEls = Array.from(root.querySelectorAll<SVGCircleElement>('.signal-pulse'))
    const edgeGeom = edges.map(([a, b]) => {
      const na = nodes[a]
      const nb = nodes[b]
      return na && nb ? { ax: na.tx, ay: na.ty, bx: nb.tx, by: nb.ty } : null
    })

    const edgeCount = edgeGeom.length
    pulseEls.forEach((el, k) => {
      if (edgeCount === 0) return
      // each pulse starts on a spread-out edge and hops to the next one each loop,
      // so the lattice keeps lighting up with travelling telemetry
      const period = 1700 + k * 130
      const span = Math.max(1, Math.floor(edgeCount / pulseEls.length))
      let current = (k * span) % edgeCount
      el.style.opacity = '0'
      let started = false
      createTimer({
        duration: period,
        loop: true,
        frameRate: 40,
        onLoop: () => {
          // advance to the next edge, skipping ahead so pulses don't bunch up
          current = (current + pulseEls.length) % edgeCount
        },
        onUpdate: (self) => {
          // hold pulses dark until the lattice edges have finished drawing
          if (self.currentTime < edgeDrawEnd) {
            el.style.opacity = '0'
            return
          }
          // on the first frame after the edges settle, snap to the start of an edge
          // so the pulse never appears mid-flight at a stale position
          if (!started) {
            started = true
            current = (k * span) % edgeCount
          }
          const e = edgeGeom[current]
          if (!e) {
            el.style.opacity = '0'
            return
          }
          const t = self.iterationProgress
          const x = e.ax + (e.bx - e.ax) * t
          const y = e.ay + (e.by - e.ay) * t
          el.setAttribute('cx', x.toFixed(2))
          el.setAttribute('cy', y.toFixed(2))
          // fade in/out across the edge so pulses feel like signals, not dots
          const intensity = Math.sin(t * Math.PI)
          el.style.opacity = (intensity * 0.9).toFixed(2)
        },
      })
    })
  })

  return (
    <svg ref={ref} viewBox="0 0 100 100" className="w-full max-w-[500px]" aria-hidden>
      <title>Telemetry swarm crystallising into the Atlas lattice</title>

      {/* curved flight paths (invisible): one per dot, swarm origin to lattice seat */}
      <defs>
        {nodes.map((n) => (
          <path
            key={`p-${n.i}`}
            id={`flight-${n.i}`}
            d={`M ${n.sx.toFixed(2)} ${n.sy.toFixed(2)} Q ${n.cx.toFixed(2)} ${n.cy.toFixed(2)} ${n.tx.toFixed(2)} ${n.ty.toFixed(2)}`}
            fill="none"
          />
        ))}
      </defs>

      {/* structural Atlas edges between settled lattice nodes */}
      {edges.map(([a, b]) => {
        const na = nodes[a]
        const nb = nodes[b]
        if (!na || !nb) return null
        return (
          <line
            key={`e-${na.row},${na.col}-${nb.row},${nb.col}`}
            className="atlas-edge"
            x1={na.tx}
            y1={na.ty}
            x2={nb.tx}
            y2={nb.ty}
            stroke={na.c}
            strokeWidth={0.45}
            style={{ opacity: 0 }}
          />
        )
      })}

      {/* the swarm dots: rendered at origin, placed by the motion path's translate */}
      {nodes.map((n) => (
        <circle
          key={`d-${n.i}`}
          className="swarm-dot"
          cx={0}
          cy={0}
          r={n.row === Math.floor(ROWS / 2) ? 1.15 : 0.95}
          fill={n.c}
          style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}

      {/* telemetry signal pulses that ride the settled edges */}
      {PULSES.map((p) => (
        <circle
          key={p.key}
          className="signal-pulse"
          cx={50}
          cy={50}
          r={0.85}
          fill={p.c}
          style={{ opacity: 0 }}
        />
      ))}
    </svg>
  )
}
