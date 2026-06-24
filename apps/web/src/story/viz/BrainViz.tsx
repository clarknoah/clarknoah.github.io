import { animate, createAnimatable, createTimer, stagger, svg, utils } from 'animejs'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useRef } from 'react'
import { useAnime } from '../anime'
import { at } from './palette'

// CMU / NDERF fMRI: the brain contour draws itself, multicolour activation hotspots bloom in
// a wave, ambient breathing runs on a fixed-rate timer, and a focal hotspot tracks the cursor
// while nearby region blobs intensify by inverse distance: an interactive attention scan.

// viewBox is 0..100. The silhouette occupies roughly this box; the focal point is clamped to it.
const BBOX = { x0: 22, y0: 18, x1: 78, y1: 84 }

// region activation blobs seeded across the cortex, each a distinct channel colour
const blobs = [
  { x: 38, y: 33, r: 10, c: at(0) }, // blue
  { x: 62, y: 35, r: 11, c: at(1) }, // violet
  { x: 50, y: 49, r: 13, c: at(2) }, // terracotta
  { x: 32, y: 56, r: 9, c: at(3) }, // green
  { x: 67, y: 57, r: 10, c: at(4) }, // amber
  { x: 47, y: 70, r: 10, c: at(6) }, // orange
  { x: 55, y: 26, r: 8, c: at(5) }, // teal
  { x: 41, y: 47, r: 7, c: at(4) }, // amber satellite
  { x: 60, y: 68, r: 8, c: at(0) }, // blue satellite
]

interface XY {
  x: (v: number) => void
  y: (v: number) => void
}
interface Glow {
  opacity: (v: number) => void
  scale: (v: number) => void
}

export function BrainViz({ active }: { role: unknown; active: boolean }) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const focal = useRef<XY | null>(null)
  const blobAnims = useRef<Glow[]>([])
  const idle = useRef(true)

  const ref = useAnime<SVGSVGElement>(active, ({ root, reduceMotion }) => {
    const d = (full: number) => (reduceMotion ? 0 : full)

    // 1. the brain silhouette and sulci draw themselves as stroked contours
    const contour = svg.createDrawable('.brain-edge')
    animate(contour, {
      draw: ['0 0', '0 1'],
      duration: d(1100),
      delay: reduceMotion ? 0 : stagger(140),
      ease: 'inOut(2)',
    })

    // 2. multicolour activation hotspots bloom in a wave across the cortex
    animate('.brain-blob', {
      opacity: [0, 0.85],
      scale: [0, 1],
      duration: d(640),
      delay: reduceMotion ? 0 : stagger(95, { start: 900, from: 'center' }),
      ease: 'out(3)',
    })

    // the focal marker fades up last, sitting at rest in the centre until the cursor arrives.
    // opacity/scale animate the INNER marker so the OUTER group is free for the translate animatable
    animate('.brain-focal-mark', {
      opacity: [0, 0.9],
      scale: [0, 1],
      duration: d(560),
      delay: d(1700),
      ease: 'out(3)',
    })

    // per-blob animatables drive smooth inverse-distance intensification under the cursor
    blobAnims.current = Array.from(root.querySelectorAll<SVGCircleElement>('.brain-blob')).map(
      (el) => createAnimatable(el, { opacity: 260, scale: 260, ease: 'out(3)' }) as unknown as Glow,
    )

    // the focal hotspot tracks the pointer with an eased follow
    const focalEl = root.querySelector<SVGGElement>('.brain-focal')
    if (focalEl) {
      const fa = createAnimatable(focalEl, { x: 360, y: 360, ease: 'out(3)' }) as unknown as XY
      // seat it at the resting centre so the first cursor move eases from there, not from 0
      fa.x(50)
      fa.y(49)
      focal.current = fa
    }
    idle.current = true

    if (reduceMotion) return

    // 3. ambient breathing on a fixed-rate timer: a slow global pulse of the activation field
    createTimer({
      duration: 4200,
      loop: true,
      frameRate: 30,
      onUpdate: (self) => {
        // 0..1 sawtooth across the loop, shaped into a smooth in-and-out breath
        const phase = (self.currentTime % 4200) / 4200
        const breath = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2)
        const grp = root.querySelector<SVGGElement>('.brain-field')
        if (grp) {
          grp.style.opacity = String(0.78 + breath * 0.22)
          grp.style.transform = `scale(${(0.985 + breath * 0.03).toFixed(4)})`
        }
        // when the cursor is absent, let the blobs idle-shimmer so the field stays alive
        if (idle.current) {
          blobAnims.current.forEach((a, i) => {
            const off = (phase + i * 0.11) % 1
            const pulse = 0.5 - 0.5 * Math.cos(off * Math.PI * 2)
            a.opacity(0.45 + pulse * 0.25)
            a.scale(0.94 + pulse * 0.12)
          })
        }
      },
    })
  })

  const setRefs = (el: SVGSVGElement | null) => {
    svgRef.current = el
    ref.current = el
  }

  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const el = svgRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // map client pixels into the 0..100 viewBox, then clamp inside the silhouette bbox
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    const cx = utils.clamp(px, BBOX.x0, BBOX.x1)
    const cy = utils.clamp(py, BBOX.y0, BBOX.y1)

    idle.current = false
    focal.current?.x(cx)
    focal.current?.y(cy)

    // nearby region blobs intensify by inverse distance to the cursor: an attention scan
    blobAnims.current.forEach((a, i) => {
      const b = blobs[i]
      if (!b) return
      const dist = Math.hypot(b.x - cx, b.y - cy)
      const near = utils.clamp(1 - dist / 34, 0, 1)
      a.opacity(0.4 + near * 0.6)
      a.scale(0.92 + near * 0.5)
    })
  }

  const onLeave = () => {
    idle.current = true
    focal.current?.x(50)
    focal.current?.y(49)
    blobAnims.current.forEach((a) => {
      a.opacity(0.6)
      a.scale(1)
    })
  }

  return (
    <svg
      ref={setRefs}
      viewBox="0 0 100 100"
      className="w-full max-w-[460px] touch-none"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden
    >
      <title>fMRI activation tracking an attention scan</title>

      {/* soft fill behind the silhouette */}
      <path
        d="M50 14 C32 14 19 27 19 43 C19 50 21 56 24 62 C28 74 38 86 50 86 C62 86 72 74 76 62 C79 56 81 50 81 43 C81 27 68 14 50 14 Z"
        fill="color-mix(in oklab, var(--color-accent) 4%, transparent)"
        stroke="none"
      />

      {/* activation field: blooming region hotspots, breathing on the ambient timer */}
      <g
        className="brain-field"
        style={{ transformBox: 'view-box', transformOrigin: 'center', mixBlendMode: 'multiply' }}
      >
        {blobs.map((b, i) => (
          <circle
            key={`${b.x}-${b.y}-${i}`}
            className="brain-blob"
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill={`color-mix(in oklab, ${b.c} 70%, transparent)`}
            style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        ))}
      </g>

      {/* brain silhouette: a stroked contour that draws itself on */}
      <path
        className="brain-edge"
        d="M50 14 C32 14 19 27 19 43 C19 50 21 56 24 62 C28 74 38 86 50 86 C62 86 72 74 76 62 C79 56 81 50 81 43 C81 27 68 14 50 14 Z"
        fill="none"
        stroke="var(--color-border-strong)"
        strokeWidth={0.9}
        strokeLinecap="round"
      />
      {/* central fissure */}
      <path
        className="brain-edge"
        d="M50 16 C47 30 53 44 50 56 C47 68 52 78 50 84"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={0.55}
        strokeLinecap="round"
      />
      {/* left sulci */}
      <path
        className="brain-edge"
        d="M32 26 C36 32 30 38 35 44 C40 50 33 56 37 62"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={0.5}
        strokeLinecap="round"
      />
      {/* right sulci */}
      <path
        className="brain-edge"
        d="M68 26 C64 32 70 38 65 44 C60 50 67 56 63 62"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={0.5}
        strokeLinecap="round"
      />

      {/* focal hotspot: the outer group is translated by the createAnimatable (x/y -> translateX/Y),
          so it rides the cursor in absolute viewBox units; the inner marker carries the bloom + breath */}
      <g className="brain-focal" style={{ transform: 'translate(50px, 49px)' }}>
        <g
          className="brain-focal-mark"
          style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center', mixBlendMode: 'multiply' }}
        >
          <circle r={6} fill="color-mix(in oklab, var(--color-accent) 60%, transparent)" />
          <circle r={9.5} fill="none" stroke="var(--color-accent)" strokeWidth={0.7} opacity={0.7} />
          <circle r={1.6} fill="var(--color-accent)" />
        </g>
      </g>
    </svg>
  )
}
