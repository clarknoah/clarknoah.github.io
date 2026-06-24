import {
  animate,
  createDraggable,
  createTimeline,
  createTimer,
  spring,
  stagger,
  svg,
} from 'animejs'
import { useRef } from 'react'
import { useAnime } from '../anime'
import { at } from './palette'

// Social engineering + document forging: a forged ID credential builds itself. A guilloche
// security pattern draws on, field rows populate, a redacted block resolves to text, an
// ACCESS GRANTED stamp lands, and a holographic foil sheen sweeps across. Drag the foil bar
// to seek the assembly (forward assembles, back disassembles); otherwise it autoplays once. (USAF.)

// Field rows. The redacted one resolves through staged glyph reveals (terminal-print feel).
const fields = [
  { label: 'NAME', value: 'R. HALLORAN', redacted: false },
  { label: 'RANK', value: 'CAPTAIN', redacted: false },
  { label: 'CLEARANCE', value: 'TS / SCI', redacted: true },
  { label: 'BADGE', value: '4471-A', redacted: false },
]

// Guilloche security pattern: fine intersecting Lissajous curves, built once as path data so
// they can be drawn on with createDrawable. Two interleaved families give the woven look.
const guillochePaths = Array.from({ length: 5 }, (_, k) => {
  const a = 3 + k
  const b = 4 + ((k * 2) % 3)
  const phase = (k * Math.PI) / 5
  const pts: string[] = []
  for (let t = 0; t <= 1.0001; t += 1 / 120) {
    const ang = t * Math.PI * 2
    const x = 50 + 42 * Math.sin(a * ang + phase) * Math.cos(ang * 0.5)
    const y = 26 + 20 * Math.sin(b * ang) * Math.cos(ang * 0.5 + phase)
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return { d: `M ${pts.join(' L ')}`, c: at(k) }
})

// Terminal-print: stage from full redaction block to the real glyphs. We swap opacity between a
// stacked block-char layer and the text layer, then flicker through a couple of frames.
function ForgeField({ f, idx }: { f: (typeof fields)[number]; idx: number }) {
  const blocks = '█'.repeat(Math.max(4, f.value.length))
  return (
    <div
      className="forge-row flex items-baseline gap-2 whitespace-nowrap"
      style={{ opacity: 0 }}
      data-idx={idx}
    >
      <span className="w-[64px] shrink-0 text-[8px] uppercase tracking-[0.14em] text-text-muted">
        {f.label}
      </span>
      {f.redacted ? (
        <span className="relative inline-block text-[11px] leading-none">
          <span className="forge-redact absolute inset-0 text-accent" aria-hidden>
            {blocks}
          </span>
          <span className="forge-clear text-text" style={{ opacity: 0 }}>
            {f.value}
          </span>
        </span>
      ) : (
        <span className="text-[11px] leading-none text-text">{f.value}</span>
      )}
    </div>
  )
}

export function ForgeViz({ active }: { role: unknown; active: boolean }) {
  // The assembly timeline. We hold a ref so the draggable foil bar can seek it directly.
  const tlRef = useRef<{
    pause: () => void
    play: () => void
    seek: (t: number) => void
    duration: number
  } | null>(null)
  const touchedRef = useRef(false)

  const ref = useAnime<HTMLDivElement>(active, ({ root, reduceMotion }) => {
    touchedRef.current = false
    const d = (full: number) => (reduceMotion ? 0 : full)

    const draggable = root.querySelector<HTMLDivElement>('.forge-foil-bar')
    const track = root.querySelector<HTMLDivElement>('.forge-foil-track')

    if (reduceMotion) {
      // Present the fully composed credential immediately.
      const drawn = svg.createDrawable('.forge-guilloche')
      animate(drawn, { draw: '0 1', duration: 0 })
      animate('.forge-row', { opacity: 1, duration: 0 })
      animate('.forge-clear', { opacity: 1, duration: 0 })
      animate('.forge-redact', { opacity: 0, duration: 0 })
      animate('.forge-photo', { opacity: 1, duration: 0 })
      animate('.forge-stamp', { opacity: 1, scale: 1, rotate: '-8deg', duration: 0 })
      // Reduced motion: skip the drag affordance entirely.
      if (draggable) {
        draggable.style.opacity = '0'
        draggable.style.pointerEvents = 'none'
      }
      if (track) {
        track.style.opacity = '0'
        track.style.pointerEvents = 'none'
      }
      return
    }

    // Build the assembly timeline, paused so the draggable (or the autoplay fallback) drives it.
    const tl = createTimeline({ autoplay: false })

    // 1. Guilloche security pattern draws on, staggered family by family.
    const guilloche = svg.createDrawable('.forge-guilloche')
    tl.add(
      guilloche,
      {
        draw: ['0 0', '0 1'],
        duration: 900,
        delay: stagger(120),
        ease: 'inOutSine',
      },
      0,
    )

    // 2. Photo plate develops in.
    tl.add(
      '.forge-photo',
      { opacity: [0, 1], scale: [0.86, 1], duration: 500, ease: 'out(3)' },
      240,
    )

    // 3. Field rows populate, staggered like a printer feeding lines.
    tl.add(
      '.forge-row',
      { opacity: [0, 1], x: [-8, 0], duration: 360, delay: stagger(150), ease: 'out(2)' },
      420,
    )

    // 4. The redacted block resolves: blocks fade, then the cleared text prints in with a flicker.
    tl.add('.forge-redact', { opacity: [1, 1, 0.25, 0.9, 0], duration: 520, ease: 'steps(5)' }, 980)
    tl.add('.forge-clear', { opacity: [0, 0.3, 1, 0.5, 1], duration: 520, ease: 'steps(5)' }, 980)

    // 5. ACCESS GRANTED stamp lands with a spring overshoot.
    tl.add(
      '.forge-stamp',
      {
        opacity: [0, 1],
        scale: [1.9, 1],
        rotate: ['4deg', '-8deg'],
        duration: 900,
        ease: spring({ stiffness: 140, damping: 11, mass: 1.1 }),
      },
      1280,
    )

    // 6. Holographic foil sheen sweeps across the whole credential.
    tl.add(
      '.forge-sheen',
      { translateX: ['-140%', '140%'], opacity: [0, 0.9, 0], duration: 1100, ease: 'inOutQuad' },
      1500,
    )

    tlRef.current = tl as unknown as typeof tlRef.current

    // Draggable foil bar FIRST: progressX (0..1) seeks the assembly timeline. Dragging forward
    // assembles the credential, dragging back disassembles it. We capture the instance so the
    // autoplay fallback can drive the bar through the draggable's OWN setter (setX) rather than
    // writing style.transform directly. A raw transform write is invisible to the draggable's
    // internal position model, so the bar would jump back to the start the moment it is grabbed.
    const drag =
      draggable && track
        ? createDraggable(draggable, {
            container: track,
            x: true,
            y: false,
            cursor: { onHover: 'grab', onGrab: 'grabbing' },
            releaseStiffness: 90,
            releaseDamping: 14,
            onGrab: () => {
              touchedRef.current = true
              timer.pause()
            },
            onUpdate: (self) => {
              const p = Math.min(1, Math.max(0, self.progressX))
              tl.seek(p * tl.duration)
            },
          })
        : null

    // Autoplay-once fallback: a fixed-rate timer scrubs the timeline forward exactly once, and
    // ghost-glides the foil bar along its track via the draggable's setX so the internal x stays
    // consistent. The moment the user grabs the bar, this yields (onGrab pauses the timer).
    const total = d(2700)
    const timer = createTimer({
      duration: Math.max(1, total),
      frameRate: 60,
      onUpdate: (self) => {
        if (touchedRef.current) return
        const p = total === 0 ? 1 : Math.min(1, self.currentTime / total)
        tl.seek(p * tl.duration)
        if (drag && draggable && track) {
          const span = Math.max(0, track.clientWidth - draggable.clientWidth)
          drag.setX(p * span, true)
        }
      },
      onComplete: () => {
        if (!touchedRef.current) tl.seek(tl.duration)
      },
    })

    timer.play()
  })

  return (
    <div ref={ref} className="relative w-full max-w-[400px] select-none font-mono">
      {/* Forged ID credential */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface-raised p-4">
        {/* Guilloche security pattern under the content */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
          viewBox="0 0 100 52"
          preserveAspectRatio="none"
          aria-hidden
        >
          <title>Guilloche security pattern</title>
          {guillochePaths.map((p) => (
            <path
              key={p.d}
              className="forge-guilloche"
              d={p.d}
              fill="none"
              stroke={p.c}
              strokeWidth={0.18}
              strokeOpacity={0.55}
            />
          ))}
        </svg>

        {/* Holographic foil sheen */}
        <div
          className="forge-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3"
          style={{
            opacity: 0,
            background:
              'linear-gradient(105deg, transparent 0%, rgba(224,162,59,0.42) 45%, rgba(255,255,255,0.3) 55%, transparent 100%)',
          }}
        />

        <div className="relative flex gap-3.5">
          {/* Photo plate */}
          <div
            className="forge-photo grid h-[68px] w-14 shrink-0 place-items-center rounded border border-border"
            style={{
              opacity: 0,
              transformBox: 'fill-box',
              transformOrigin: 'center',
              background:
                'repeating-linear-gradient(135deg, color-mix(in oklab, var(--color-accent) 22%, transparent) 0 3px, transparent 3px 6px)',
            }}
          >
            <span className="text-[20px] text-text-muted">{'□'}</span>
          </div>

          {/* Field rows */}
          <div className="flex flex-1 flex-col justify-center gap-2 pt-0.5">
            {fields.map((f, i) => (
              <ForgeField key={f.label} f={f} idx={i} />
            ))}
          </div>
        </div>

        {/* ACCESS GRANTED stamp */}
        <div className="relative mt-3 flex items-center justify-between">
          <span
            className="forge-stamp inline-block rounded border-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{
              opacity: 0,
              transformBox: 'fill-box',
              transformOrigin: 'center',
              color: at(3),
              borderColor: at(3),
            }}
          >
            Access granted
          </span>
          <span className="text-[8px] uppercase tracking-[0.14em] text-text-muted">
            USAF / forged
          </span>
        </div>
      </div>

      {/* Draggable foil bar: seek the assembly. */}
      <div className="forge-foil-track relative mt-4 h-7 w-full rounded-full border border-border bg-surface-raised">
        <div
          className="forge-foil-bar absolute top-1/2 left-0 h-7 w-16 -translate-y-1/2 cursor-grab rounded-full border border-border"
          style={{
            background:
              'linear-gradient(105deg, color-mix(in oklab, var(--color-accent) 60%, transparent), color-mix(in oklab, var(--color-accent) 18%, transparent))',
            touchAction: 'none',
          }}
        >
          <span className="grid h-full w-full place-items-center text-[8px] uppercase tracking-[0.2em] text-text">
            foil
          </span>
        </div>
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[8px] uppercase tracking-[0.16em] text-text-muted">
          drag to assemble
        </span>
      </div>
    </div>
  )
}
