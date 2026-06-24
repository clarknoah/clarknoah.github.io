import { animate, createTimeline, spring, stagger, svg } from 'animejs'
import { Globe } from '../../components/Globe'
import { useAnime } from '../anime'
import { at } from './palette'

// Thermopylae geospatial: the cobe WebGL globe owns rotation while an SVG overlay traces a
// great-circle arc, runs a marker along it that drops onto the coast, draws four reticle
// brackets in around it, then fades up the place label. (Greek campaign.)
//
// The overlay lives in a 100x100 viewBox laid over the square globe canvas. The arc sweeps
// from the upper-left toward a landing point just right of centre, where the globe pins its
// own amber marker; the reticle frames that same point.

// role is typed `unknown` here (the viz registry is polymorphic); narrow location at runtime.
type GlobeLocation = { label: string; lat: number; lng: number }

function readLocation(role: unknown): GlobeLocation | null {
  if (typeof role !== 'object' || role === null || !('location' in role)) return null
  const loc = (role as { location: unknown }).location
  if (typeof loc !== 'object' || loc === null) return null
  const { label, lat, lng } = loc as Record<string, unknown>
  if (typeof label !== 'string' || typeof lat !== 'number' || typeof lng !== 'number') return null
  return { label, lat, lng }
}

const ARC = 'M 14 26 C 36 6, 64 6, 80 40'
const LAND = { x: 80, y: 40 }
const AMBER = at(4)

// reticle corner-brackets around the landing point: each is an L-shaped polyline
const BRACKET = 7
const GAP = 4.6
const corners: { key: string; points: string }[] = [
  {
    key: 'tl',
    points: `${LAND.x - GAP} ${LAND.y - GAP + BRACKET} ${LAND.x - GAP} ${LAND.y - GAP} ${LAND.x - GAP + BRACKET} ${LAND.y - GAP}`,
  },
  {
    key: 'tr',
    points: `${LAND.x + GAP - BRACKET} ${LAND.y - GAP} ${LAND.x + GAP} ${LAND.y - GAP} ${LAND.x + GAP} ${LAND.y - GAP + BRACKET}`,
  },
  {
    key: 'br',
    points: `${LAND.x + GAP} ${LAND.y + GAP - BRACKET} ${LAND.x + GAP} ${LAND.y + GAP} ${LAND.x + GAP - BRACKET} ${LAND.y + GAP}`,
  },
  {
    key: 'bl',
    points: `${LAND.x - GAP + BRACKET} ${LAND.y + GAP} ${LAND.x - GAP} ${LAND.y + GAP} ${LAND.x - GAP} ${LAND.y + GAP - BRACKET}`,
  },
]

export function GlobeViz({ role, active }: { role: unknown; active: boolean }) {
  const location = readLocation(role)
  const target = location ? { lat: location.lat, lng: location.lng } : null

  const ref = useAnime<SVGSVGElement>(active, ({ root, reduceMotion }) => {
    const d = (full: number) => (reduceMotion ? 0 : full)
    const arcPath = root.querySelector<SVGPathElement>('.globe-arc')
    if (!arcPath) return

    if (reduceMotion) {
      // present the composed final state instantly: arc + brackets fully drawn, marker
      // parked on the landing point, label up.
      animate(svg.createDrawable('.globe-arc'), { draw: '0 1', duration: 0 })
      animate(svg.createDrawable('.globe-bracket'), { draw: '0 1', opacity: 1, duration: 0 })
      animate('.globe-marker', {
        translateX: LAND.x,
        translateY: LAND.y,
        opacity: 1,
        scale: 1,
        duration: 0,
      })
      animate('.globe-label', { opacity: 1, duration: 0 })
      return
    }

    const tl = createTimeline()

    // 1. the great-circle arc draws across the overlay (capture the drawable return, then
    //    animate that — animating the bare selector does not draw).
    tl.add(svg.createDrawable('.globe-arc'), {
      draw: ['0 0', '0 1'],
      duration: d(900),
      ease: 'inOut(2)',
    })

    // 2. a marker travels the arc, then drops onto the landing point with a spring scale.
    tl.add(
      '.globe-marker',
      {
        ...svg.createMotionPath(arcPath),
        opacity: [0, 1],
        duration: d(820),
        ease: 'inOutQuad',
      },
      '-=120',
    )
    tl.add(
      '.globe-marker',
      {
        scale: [0.4, 1],
        ease: spring({ stiffness: 220, damping: 11 }),
      },
      '-=40',
    )

    // 3. four reticle brackets draw in around the landing point
    tl.add(
      svg.createDrawable('.globe-bracket'),
      {
        draw: ['0 0', '0 1'],
        opacity: [0, 1],
        duration: d(360),
        delay: stagger(70),
        ease: 'out(3)',
      },
      '-=120',
    )

    // 4. the place label fades up
    tl.add(
      '.globe-label',
      {
        opacity: [0, 1],
        translateY: [4, 0],
        duration: d(420),
        ease: 'out(2)',
      },
      '-=40',
    )
  })

  return (
    <div className="relative w-full max-w-[520px]">
      <Globe target={target} />
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <title>Geospatial reticle locking onto a coastal target</title>

        {/* great-circle arc */}
        <path
          className="globe-arc"
          d={ARC}
          fill="none"
          stroke={AMBER}
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeDasharray="2.4 2"
          opacity={0.85}
        />

        {/* reticle corner-brackets framing the landing point */}
        {corners.map((c) => (
          <polyline
            key={c.key}
            className="globe-bracket"
            points={c.points}
            fill="none"
            stroke={AMBER}
            strokeWidth={0.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0 }}
          />
        ))}

        {/* travelling / landing marker */}
        <g
          className="globe-marker"
          style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <circle cx={0} cy={0} r={2.6} fill="none" stroke={AMBER} strokeWidth={0.9} />
          <circle cx={0} cy={0} r={0.9} fill={AMBER} />
        </g>

        {/* place label */}
        {location ? (
          <text
            className="globe-label"
            x={LAND.x}
            y={LAND.y + 11}
            textAnchor="middle"
            fontSize={4}
            fill="currentColor"
            style={{
              opacity: 0,
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.04em',
            }}
          >
            {location.label.toUpperCase()}
          </text>
        ) : null}
      </svg>
    </div>
  )
}
