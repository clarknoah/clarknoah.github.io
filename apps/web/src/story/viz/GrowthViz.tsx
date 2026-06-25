import { animate, createTimer, stagger, svg, utils } from 'animejs'
import { useState } from 'react'
import { useAnime } from '../anime'
import { at } from './palette'

// SEI: users scaled from a few hundred to 1.2M across 59 enterprise partners.
// A single createTimer drives BOTH the counter and the line-draw off one eased
// progress value, so the number and the curve can never desync. The stroked path
// is drawn via svg.createDrawable; the area fill and partner-milestone dots are
// gated to the same progress.
const TARGET = 1_200_000
const DURATION = 1900

// chart control points (viewBox 0..100), rising left to right
const pts: [number, number][] = [
  [0, 96],
  [16, 91],
  [32, 82],
  [48, 67],
  [64, 47],
  [80, 25],
  [100, 8],
]
const line = `M ${pts.map(([x, y]) => `${x} ${y}`).join(' L ')}`
const area = `M 0 100 L ${pts.map(([x, y]) => `${x} ${y}`).join(' L ')} L 100 100 Z`

// partner milestones sit on the curve; each pops as the draw sweeps past it.
const milestones = pts.slice(1, -1).map(([x, y], i) => ({ x, y, c: at(i + 1) }))

// ease-out cubic, shared by the counter and the line so they move as one.
const easeOut = (p: number) => 1 - (1 - p) ** 3

const formatGB = (v: number) => new Intl.NumberFormat('en-GB').format(Math.round(v))

export function GrowthViz({ active }: { role: unknown; active: boolean }) {
  const [n, setN] = useState(0)

  const ref = useAnime<HTMLDivElement>(active, ({ root, reduceMotion }) => {
    const drawn = svg.createDrawable('.growth-line')
    const path = drawn[0]
    const areaEl = root.querySelector<SVGPathElement>('.growth-area')

    if (reduceMotion) {
      // present the final composed state instantly
      setN(TARGET)
      // setAttribute routes through the drawable proxy's draw trap; a plain
      // `path.draw =` assignment compiles but never updates the dash geometry.
      if (path) path.setAttribute('draw', '0 1')
      if (areaEl) utils.set(areaEl, { opacity: 1 })
      utils.set('.growth-dot', { opacity: 1, scale: 1 })
      return
    }

    // start hidden, then draw on
    setN(0)
    if (path) path.setAttribute('draw', '0 0')
    if (areaEl) utils.set(areaEl, { opacity: 0 })
    utils.set('.growth-dot', { opacity: 0, scale: 0 })

    // milestone dots pop as the line sweeps past them (stagger along the curve)
    animate('.growth-dot', {
      opacity: [0, 1],
      scale: [0, 1.25, 1],
      duration: 420,
      delay: stagger(DURATION / (milestones.length + 1), { start: DURATION * 0.18 }),
      ease: 'out(3)',
    })

    // ONE engine: eased progress drives the counter AND gates the line + area.
    createTimer({
      duration: DURATION,
      frameRate: 60,
      onUpdate: (self) => {
        const e = easeOut(self.progress)
        setN(Math.round(TARGET * e))
        if (path) path.setAttribute('draw', `0 ${e}`)
        if (areaEl) areaEl.style.opacity = String(e * 0.9)
      },
      onComplete: () => {
        setN(TARGET)
        if (path) path.setAttribute('draw', '0 1')
        if (areaEl) areaEl.style.opacity = '0.9'
      },
    })
  })

  return (
    <div ref={ref} className="w-full max-w-[520px]">
      <div className="font-display text-base italic text-text-muted">users scaled</div>
      <div className="mt-1 font-display text-6xl font-bold tracking-tight text-text tabular-nums md:text-7xl">
        {formatGB(n)}
      </div>
      <div className="mt-1 font-mono text-sm text-accent">across 59 enterprise partners</div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="mt-8 h-44 w-full"
        aria-hidden
      >
        <title>SEI: users scaled to 1.2 million</title>
        <defs>
          <linearGradient id="growthArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0a23b" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#c95f33" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c95f33" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="growthLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c95f33" />
            <stop offset="55%" stopColor="#d2683f" />
            <stop offset="100%" stopColor="#e0a23b" />
          </linearGradient>
        </defs>

        {/* faint baseline grid for editorial structure */}
        {[25, 50, 75].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeWidth={0.25}
            opacity={0.12}
          />
        ))}

        {/* area fill, opacity gated to the line progress */}
        <path className="growth-area" d={area} fill="url(#growthArea)" style={{ opacity: 0 }} />

        {/* stroked line drawn via createDrawable, gated to the same eased progress */}
        <path
          className="growth-line"
          d={line}
          fill="none"
          stroke="url(#growthLine)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* partner-milestone dots pop along the curve */}
        {milestones.map((m) => (
          <circle
            key={`${m.x}-${m.y}`}
            className="growth-dot"
            cx={m.x}
            cy={m.y}
            r={1.7}
            fill={m.c}
            stroke="var(--color-surface-raised, #fff)"
            strokeWidth={0.6}
            vectorEffect="non-scaling-stroke"
            style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        ))}
      </svg>
    </div>
  )
}
