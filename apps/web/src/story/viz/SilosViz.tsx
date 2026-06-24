import { animate, createTimeline, createTimer, stagger, svg } from 'animejs'
import { useAnime } from '../anime'

// Questor ICITE: five colour-coded agency silos morph into one unified ICITE cloud.
// Each silo is an 8-point polygon (same primitive, same vertex count as the cloud) so
// svg.morphTo tweens vertex-to-vertex cleanly. After the merge, data packets ride motion
// paths from each former-silo location through the cloud and out to the others, and a
// dashed shared-boundary perimeter draws around the unified cloud.

const W = 200
const H = 150

interface Silo {
  l: string
  c: string
  cx: number
  points: string
}

// Five silos spread across the floor. Each is a tapered tower with a roof ridge,
// described by exactly 8 vertices so it can morph point-for-point into the cloud.
const SILO_DEFS = [
  { l: 'CIA', c: '#2f7dc4' },
  { l: 'NSA', c: '#8157d6' },
  { l: 'DIA', c: '#c95f33' },
  { l: 'NGA', c: '#3a9663' },
  { l: 'FBI', c: '#e0a23b' },
] as const

const FLOOR = 138
const SILO_TOP = 92
const SILO_HALF = 13

function siloPolygon(cx: number): string {
  const top = SILO_TOP
  const mid = (top + FLOOR) / 2
  const w = SILO_HALF
  const wn = SILO_HALF * 0.62 // narrower roof ridge
  // 8 vertices, clockwise from the roof apex: ridge-left, ridge-right, shoulder-right,
  // wall-right, base-right, base-left, wall-left, shoulder-left.
  const pts: [number, number][] = [
    [cx - wn, top + 4],
    [cx + wn, top + 4],
    [cx + w, top + 12],
    [cx + w, mid],
    [cx + w, FLOOR],
    [cx - w, FLOOR],
    [cx - w, mid],
    [cx - w, top + 12],
  ]
  return pts.map(([x, y]) => `${x},${y}`).join(' ')
}

const silos: Silo[] = SILO_DEFS.map((s, i) => {
  const cx = 26 + i * 37
  return { ...s, cx, points: siloPolygon(cx) }
})

// The unified ICITE cloud: a soft 8-vertex blob centred up top. Same vertex count as the
// silos, ordered so each morph rotates minimally. Amber, per the accent rule.
const CLOUD_CX = 100
const CLOUD_CY = 38
function cloudPolygon(): string {
  const rx = 50
  const ry = 26
  const pts: [number, number][] = [
    [CLOUD_CX - 22, CLOUD_CY - ry],
    [CLOUD_CX + 22, CLOUD_CY - ry],
    [CLOUD_CX + rx, CLOUD_CY - 6],
    [CLOUD_CX + rx, CLOUD_CY + 8],
    [CLOUD_CX + 24, CLOUD_CY + ry],
    [CLOUD_CX - 24, CLOUD_CY + ry],
    [CLOUD_CX - rx, CLOUD_CY + 8],
    [CLOUD_CX - rx, CLOUD_CY - 6],
  ]
  return pts.map(([x, y]) => `${x},${y}`).join(' ')
}
const CLOUD_POINTS = cloudPolygon()

// Where each silo's verbatim centre sat on the floor, used as motion-path anchors.
const siloAnchors = silos.map((s) => ({ x: s.cx, y: (SILO_TOP + FLOOR) / 2 }))

// Packet routes: from each former-silo floor anchor, up into the cloud, then back down to a
// different silo's anchor. A cubic curve through the cloud centre gives a graceful arc.
const PACKET_ROUTES = siloAnchors.map((from, i) => {
  const to = siloAnchors[(i + 2) % siloAnchors.length] ?? from
  const midX = (from.x + to.x) / 2
  return `M ${from.x} ${from.y} C ${from.x} ${CLOUD_CY}, ${midX} ${CLOUD_CY - 14}, ${CLOUD_CX} ${CLOUD_CY} S ${to.x} ${CLOUD_CY}, ${to.x} ${to.y}`
})

// Dashed look for the shared-boundary perimeter. createDrawable overwrites stroke-dasharray
// while drawing the line on, so the dashes are reapplied once the draw completes.
const EDGE_DASH = '3 3'

export function SilosViz({ active }: { role: unknown; active: boolean }) {
  const ref = useAnime<SVGSVGElement>(active, ({ root, reduceMotion }) => {
    const siloEls = Array.from(root.querySelectorAll<SVGPolygonElement>('.silo'))
    const labelEls = Array.from(root.querySelectorAll<SVGTextElement>('.silo-label'))
    const packetEls = Array.from(root.querySelectorAll<SVGCircleElement>('.packet'))
    const pathEls = Array.from(root.querySelectorAll<SVGPathElement>('.packet-path'))
    const bodyEl = root.querySelector<SVGPolygonElement>('.cloud-body')

    if (reduceMotion) {
      // Present the composed end-state instantly: silos already collapsed into the cloud,
      // perimeter drawn, packets and labels hidden.
      for (const el of siloEls) {
        el.setAttribute('points', CLOUD_POINTS)
        el.style.opacity = '0.16'
      }
      for (const el of labelEls) el.style.opacity = '0'
      for (const el of packetEls) el.style.opacity = '0'
      // Capture the drawable and animate THAT (not the bare selector) so the line is drawn.
      const edge = svg.createDrawable('.cloud-edge')
      animate(edge, {
        draw: ['0 1', '0 1'],
        duration: 0,
        onComplete: () => {
          for (const el of edge) {
            el.setAttribute('stroke-dasharray', EDGE_DASH)
            el.setAttribute('stroke-dashoffset', '0')
          }
        },
      })
      animate('.cloud-body', { opacity: 1, duration: 0 })
      animate('.cloud-text', { opacity: 1, duration: 0 })
      if (bodyEl) bodyEl.style.opacity = '1'
      return
    }

    const tl = createTimeline({ defaults: { ease: 'out(3)' } })

    // Ambient breathing on the cloud body. Defined here but only started from the cloud-body
    // reveal's onComplete (a finite child) so the timer's per-frame opacity writes never
    // fight the reveal tween, and so it does not depend on the whole timeline completing
    // (the looping packet children mean the timeline itself never resolves).
    const PERIOD = 3200
    let breathing = false
    const startBreathing = () => {
      if (breathing || !bodyEl) return
      breathing = true
      createTimer({
        duration: PERIOD,
        loop: true,
        frameRate: 30,
        onUpdate: (self) => {
          const t = (Math.sin((self.currentTime / PERIOD) * Math.PI * 2) + 1) / 2
          bodyEl.style.opacity = String(0.82 + t * 0.18)
        },
      })
    }

    // 1. Silos rise from the floor, staggered left to right.
    tl.add(siloEls, { translateY: [34, 0], opacity: [0, 1], duration: 620, delay: stagger(120) }, 0)
    tl.add(labelEls, { opacity: [0, 1], duration: 420, delay: stagger(120) }, 220)

    // 2. Each silo morphs, point-for-point, into the unified cloud shape and fades to a
    //    faint trace as the amber cloud body takes over.
    tl.add(
      siloEls,
      {
        points: svg.morphTo('#icite-cloud', 0.5),
        opacity: [1, 0.14],
        duration: 1100,
        ease: 'inOut(2)',
        delay: stagger(70),
      },
      '+=260',
    )
    tl.add(labelEls, { opacity: [1, 0], duration: 360 }, '<<+=120')

    // 3. The amber cloud body and its label resolve in. Start the ambient breather once the
    //    body has finished revealing so the two never compete for the inline opacity.
    tl.add(
      '.cloud-body',
      { opacity: [0, 1], scale: [0.92, 1], duration: 640, onComplete: startBreathing },
      '-=620',
    )
    tl.add('.cloud-text', { opacity: [0, 1], translateY: [4, 0], duration: 520 }, '-=300')

    // 4. The dashed shared-boundary perimeter draws around the cloud. createDrawable rewrites
    //    stroke-dasharray to draw the line on, so the dashes are restored once it finishes.
    const perimeter = svg.createDrawable('.cloud-edge')
    tl.add(
      perimeter,
      {
        draw: ['0 0', '0 1'],
        duration: 900,
        ease: 'inOutQuad',
        onComplete: () => {
          for (const el of perimeter) {
            el.setAttribute('stroke-dasharray', EDGE_DASH)
            el.setAttribute('stroke-dashoffset', '0')
          }
        },
      },
      '-=520',
    )

    // 5. Data packets ride motion paths: out of each former silo, through the cloud, and on
    //    to another agency's slot. They loop continuously to read as live traffic.
    packetEls.forEach((el, i) => {
      const pathEl = pathEls[i]
      if (!pathEl) return
      tl.add(
        el,
        {
          ...svg.createMotionPath(pathEl),
          opacity: [
            { to: 1, duration: 160 },
            { to: 1, duration: 1240 },
            { to: 0, duration: 220 },
          ],
          duration: 1620,
          ease: 'inOutQuad',
          loop: true,
        },
        // Fan the packets out in time so they read as a steady stream of traffic.
        i === 0 ? '-=260' : `<<+=${i * 260}`,
      )
    })
  })

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[480px]" aria-hidden>
      <title>Questor ICITE: agency silos merge into one shared cloud</title>

      {/* Hidden morph target: the unified ICITE cloud shape. */}
      <polygon id="icite-cloud" points={CLOUD_POINTS} fill="none" stroke="none" opacity={0} />

      {/* Motion-path guides for the data packets (invisible). */}
      {PACKET_ROUTES.map((dPath, i) => (
        <path
          key={`route-${silos[i]?.l ?? i}`}
          className="packet-path"
          d={dPath}
          fill="none"
          stroke="none"
        />
      ))}

      {/* The amber cloud body, revealed once the silos have merged. */}
      <polygon
        className="cloud-body"
        points={CLOUD_POINTS}
        fill="color-mix(in oklab, var(--color-accent) 18%, transparent)"
        stroke="var(--color-accent)"
        strokeWidth={1}
        style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center' }}
      />

      {/* Dashed shared-boundary perimeter (stroked polygon). createDrawable draws it on,
          then the dashes are restored onComplete. Starts undrawn (large offset) so it does
          not flash a solid line in the frame before the draw animation runs. */}
      <polygon
        className="cloud-edge"
        points={CLOUD_POINTS}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1}
        strokeDasharray={1000}
        strokeDashoffset={1000}
        opacity={0.85}
      />

      {/* Silo polygons: morph sources. Same vertex count as the cloud. */}
      {silos.map((s) => (
        <polygon
          key={s.l}
          className="silo"
          points={s.points}
          fill={`color-mix(in oklab, ${s.c} 16%, transparent)`}
          stroke={s.c}
          strokeWidth={1}
          style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}

      {/* Silo labels. */}
      {silos.map((s) => (
        <text
          key={`${s.l}-label`}
          className="silo-label"
          x={s.cx}
          y={FLOOR - 8}
          textAnchor="middle"
          fontSize={7}
          fontFamily="var(--font-mono, monospace)"
          fill={s.c}
          style={{ opacity: 0 }}
        >
          {s.l}
        </text>
      ))}

      {/* Data packets travelling the motion paths. */}
      {silos.map((s) => (
        <circle
          key={`packet-${s.l}`}
          className="packet"
          r={2.4}
          cx={0}
          cy={0}
          fill={s.c}
          style={{ opacity: 0 }}
        />
      ))}

      {/* Unified cloud label. */}
      <text
        className="cloud-text"
        x={CLOUD_CX}
        y={CLOUD_CY + 2}
        textAnchor="middle"
        fontSize={8}
        fontFamily="var(--font-mono, monospace)"
        fill="var(--color-accent)"
        style={{ opacity: 0 }}
      >
        ICITE cloud
      </text>
    </svg>
  )
}
