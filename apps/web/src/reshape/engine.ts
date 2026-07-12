/**
 * Imperative renderer for the /reshape visualization. React renders the static SVG
 * structure (see ReshapePage); this engine drives it frame by frame off a single
 * requestAnimationFrame loop. Every act is a pure function of loop time, so loops,
 * scrubbing between modes, and scrolling backwards all stay coherent.
 */

import {
  AFTER,
  BEFORE,
  CENTER,
  HUMANS,
  type Pt,
  type Snapshot,
  TOOLS,
  bowPoint,
  fmtShort,
  fmtSim,
  snapshotAt,
  toolById,
} from './scene'

export type Mode = 'before' | 'pivot' | 'after'

const PIVOT_MS = 3000
const AGENT_R = 124

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v))
const ramp = (v: number, a: number, b: number): number => clamp01((v - a) / (b - a))
const easeInOut = (u: number): number => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2)
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u

interface Handles {
  setMode(m: Mode): void
  destroy(): void
}

export function createReshapeEngine(root: SVGSVGElement): Handles {
  const $ = <T extends Element>(sel: string): T | null => root.querySelector<T>(sel)
  const $$ = <T extends Element>(sel: string): T[] => Array.from(root.querySelectorAll<T>(sel))

  // Element handles. All classes are rendered statically by ReshapePage.
  const humanEls = new Map($$<SVGGElement>('.rp-human').map((el) => [el.dataset.h ?? '', el]))
  const roleEls = $$<SVGTextElement>('.rp-role')
  const treeEdgeEls = $$<SVGPathElement>('.rp-tedge')
  const lateralEl = $<SVGPathElement>('#rp-lateral')
  const toolEls = $$<SVGGElement>('.rp-tool')
  const fragEls = $$<SVGCircleElement>('.rp-frag')
  const lnodeEls = $$<SVGGElement>('.rp-lnode')
  const ledgeEls = $$<SVGPathElement>('.rp-ledge')
  const ledgeLabelEls = $$<SVGTextElement>('.rp-ledge-label')
  const spokeEls = $$<SVGLineElement>('.rp-spoke')
  const agentEls = $$<SVGRectElement>('.rp-agent')
  const microEls = $$<SVGCircleElement>('.rp-micro')
  const packetEl = $<SVGCircleElement>('#rp-packet')
  const haloEl = $<SVGCircleElement>('#rp-halo')
  const dwellEl = $<SVGTextElement>('#rp-dwell')
  const rippleA = $<SVGLineElement>('#rp-ripple-a')
  const rippleB = $<SVGLineElement>('#rp-ripple-b')
  const rippleRes = $<SVGTextElement>('#rp-ripple-res')
  const qLabel = $<SVGTextElement>('#rp-q-label')
  const qLines = [$<SVGTextElement>('#rp-q1'), $<SVGTextElement>('#rp-q2')]
  const traceEls = $$<SVGTextElement>('.rp-trace')
  const clockEl = $<SVGTextElement>('#rp-clock')
  const nightLabelEl = $<SVGTextElement>('#rp-nightlabel')
  const nightEl = $<SVGRectElement>('#rp-night')
  const led = {
    hb: $<SVGTextElement>('#rp-led-hb'),
    ha: $<SVGTextElement>('#rp-led-ha'),
    bHand: $<SVGTextElement>('#rp-led-b-hand'),
    bEl: $<SVGTextElement>('#rp-led-b-el'),
    bWork: $<SVGTextElement>('#rp-led-b-work'),
    aHand: $<SVGTextElement>('#rp-led-a-hand'),
    aEl: $<SVGTextElement>('#rp-led-a-el'),
    aWork: $<SVGTextElement>('#rp-led-a-work'),
  }

  // Lattice edge lengths for the draw-on effect.
  const ledgeLens = ledgeEls.map((el) => {
    const len = el.getTotalLength()
    el.setAttribute('stroke-dasharray', String(len))
    el.setAttribute('stroke-dashoffset', String(len))
    return len
  })

  // Point-reference -> human id, so a dwell can highlight the person it sits at.
  const ptToHuman = new Map<Pt, string>()
  for (const h of HUMANS) {
    ptToHuman.set(h.tree, h.id)
    ptToHuman.set(h.ring, h.id)
  }

  const textCache = new Map<Element, string>()
  const setText = (el: Element | null, s: string) => {
    if (!el || textCache.get(el) === s) return
    textCache.set(el, s)
    el.textContent = s
  }
  const setO = (el: Element | null, o: number) => {
    if (el) (el as SVGElement).style.opacity = String(Math.round(o * 1000) / 1000)
  }

  // Indexes of the two human-touch dwells in the after script.
  const decisionIdx = AFTER.steps.findIndex((s) => s.k === 'dwell' && s.label === 'decision')
  const approvalIdx = AFTER.steps.findIndex((s) => s.k === 'dwell' && s.label === 'approval')
  const compareIdx = AFTER.steps.length - 3
  const ambientIdx = AFTER.steps.length - 2
  const simAtDone = AFTER.simStarts[compareIdx] ?? 26

  // ---------------------------------------------------------------------------
  // State.
  // ---------------------------------------------------------------------------

  let mode: Mode = 'before'
  let lp = 0 // layout: 0 = tree, 1 = ring
  let beforeT = 0
  let afterT = 0
  let last = performance.now()
  let raf = 0
  let destroyed = false

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Current human positions, refreshed each frame from the layout parameter.
  const hpos = new Map<string, Pt>()
  const layoutHumans = (now: number) => {
    HUMANS.forEach((h, i) => {
      const off = (i / HUMANS.length) * 0.35
      const u = easeInOut(ramp(lp, off, off + 0.65))
      const p = { x: lerp(h.tree.x, h.ring.x, u), y: lerp(h.tree.y, h.ring.y, u) }
      hpos.set(h.id, p)
      const el = humanEls.get(h.id)
      if (el) el.setAttribute('transform', `translate(${p.x} ${p.y})`)
    })
    // Spokes track the humans; only visible once the ring has formed.
    const so = 0.08 * ramp(lp, 0.8, 1)
    for (const el of spokeEls) {
      const p = hpos.get(el.dataset.h ?? '')
      if (!p) continue
      el.setAttribute('x2', String(p.x))
      el.setAttribute('y2', String(p.y))
      setO(el, so)
    }
    // Agents orbit the centre slowly once present.
    const ao = ramp(lp, 0.82, 1)
    agentEls.forEach((el, i) => {
      const th = ((i * 120 + now * 0.006) * Math.PI) / 180
      const x = CENTER.x + AGENT_R * Math.cos(th)
      const y = CENTER.y + AGENT_R * 0.72 * Math.sin(th)
      el.setAttribute('transform', `translate(${x} ${y}) rotate(45)`)
      setO(el, ao)
    })
  }

  /** Everything driven purely by the layout parameter (the reshaping itself). */
  const layoutScene = () => {
    for (const el of treeEdgeEls) setO(el, 0.35 * (1 - ramp(lp, 0, 0.35)))
    for (const el of roleEls) setO(el, 0.85 * (1 - ramp(lp, 0, 0.3)))
    toolEls.forEach((el, i) => setO(el, 1 - ramp(lp, 0.05 + i * 0.02, 0.4 + i * 0.02)))
    // Fragments fly from each tool into the forming centre.
    fragEls.forEach((el, i) => {
      const tool = toolById.get(el.dataset.from ?? '')
      if (!tool) return
      const u = ramp(lp, 0.16 + i * 0.025, 0.52 + i * 0.025)
      if (u <= 0 || u >= 1) {
        setO(el, 0)
        return
      }
      const e = easeInOut(u)
      el.setAttribute('cx', String(lerp(tool.x, CENTER.x, e)))
      el.setAttribute('cy', String(lerp(tool.y + 12, CENTER.y, e)))
      setO(el, Math.sin(Math.PI * u) * 0.9)
    })
    lnodeEls.forEach((el, i) => {
      const u = ramp(lp, 0.5 + i * 0.04, 0.72 + i * 0.04)
      setO(el, u)
      const n = el.dataset.x
      const y = el.dataset.y
      el.setAttribute('transform', `translate(${n} ${y}) scale(${0.7 + 0.3 * easeInOut(u)})`)
    })
    ledgeEls.forEach((el, i) => {
      const u = ramp(lp, 0.62 + i * 0.03, 0.88 + i * 0.03)
      el.setAttribute('stroke-dashoffset', String((ledgeLens[i] ?? 0) * (1 - u)))
      setO(el, 0.6 * ramp(lp, 0.6, 0.7))
    })
    for (const el of ledgeLabelEls) setO(el, 0.8 * ramp(lp, 0.86, 0.96))
    const lo = ramp(lp, 0.9, 1)
    setO(led.ha, lo * 0.8)
    setO(led.aHand, lo)
    setO(led.aEl, lo)
    setO(led.aWork, lo)
  }

  const hideMoving = () => {
    setO(packetEl, 0)
    setO(haloEl, 0)
    setO(dwellEl, 0)
    setO(rippleA, 0)
    setO(rippleB, 0)
    setO(rippleRes, 0)
    setO(qLabel, 0)
    for (const el of qLines) setO(el, 0)
    for (const el of traceEls) setO(el, 0)
    setO(lateralEl, 0)
    setO(nightLabelEl, 0)
    for (const el of microEls) setO(el, 0)
  }

  const setQuestion = (snap: Snapshot, o: number) => {
    if (!snap.text) {
      setO(qLabel, 0)
      for (const el of qLines) setO(el, 0)
      return
    }
    setText(qLabel, snap.text.label)
    setO(qLabel, 0.75 * o)
    qLines.forEach((el, i) => {
      setText(el, snap.text?.lines[i] ?? '')
      setO(el, o)
    })
  }

  const setDwell = (snap: Snapshot, now: number, o: number) => {
    if (!snap.dwell || !snap.packet) {
      setO(dwellEl, 0)
      setO(haloEl, 0)
      return
    }
    const d = snap.dwell
    const flipped = d.at.x > 660
    dwellEl?.setAttribute('x', String(d.at.x + (flipped ? -16 : 16)))
    dwellEl?.setAttribute('y', String(d.at.y - 14))
    dwellEl?.setAttribute('text-anchor', flipped ? 'end' : 'start')
    setText(dwellEl, `${d.label} · ${fmtShort(d.simElapsed)}`)
    setO(dwellEl, o)
    haloEl?.setAttribute('cx', String(d.at.x))
    haloEl?.setAttribute('cy', String(d.at.y))
    haloEl?.setAttribute('r', String(10 + 2.5 * Math.sin(now / 260)))
    setO(haloEl, 0.35 * o)
  }

  const setPacket = (snap: Snapshot, o: number) => {
    if (!snap.packet) {
      setO(packetEl, 0)
      return
    }
    packetEl?.setAttribute('cx', String(snap.packet.x))
    packetEl?.setAttribute('cy', String(snap.packet.y))
    setO(packetEl, o)
  }

  /** Highlight whichever human the packet currently sits at. */
  const setActiveHuman = (snap: Snapshot | null) => {
    const active = snap?.dwell ? ptToHuman.get(snap.dwell.at) : undefined
    for (const [id, el] of humanEls) {
      const c = el.querySelector('circle')
      if (!c) continue
      if (id === active) {
        c.setAttribute('stroke', 'var(--color-accent)')
        c.setAttribute('stroke-width', '1.5')
      } else {
        c.setAttribute('stroke', 'var(--color-border-strong)')
        c.setAttribute('stroke-width', '1')
      }
    }
  }

  const setBeforeLedger = (snap: Snapshot | null) => {
    setText(led.bHand, snap ? String(snap.handoffs) : String(BEFORE.handoffsTotal))
    setText(led.bEl, snap ? fmtSim(snap.sim) : fmtSim(BEFORE.simTotal))
    setText(led.bWork, snap ? fmtShort(snap.work) : fmtShort(BEFORE.workTotal))
  }

  // ---------------------------------------------------------------------------
  // Act renderers.
  // ---------------------------------------------------------------------------

  const renderBefore = (t: number, now: number) => {
    const snap = snapshotAt(BEFORE, t)
    const o = snap.fade
    setPacket(snap, o)
    setDwell(snap, now, o)
    setActiveHuman(snap)
    setQuestion(snap, o)
    setBeforeLedger(snap)
    setText(led.aHand, '·')
    setText(led.aEl, '·')
    setText(led.aWork, '·')
    setText(clockEl, `t+${fmtSim(snap.sim)}`)
    setO(clockEl, 0.9 * o)

    // The cross-team hop draws its own dashed line: that edge does not exist in the tree.
    const isLateral = snap.step.k === 'travel' && snap.step.lateral
    setO(lateralEl, isLateral ? Math.sin(Math.PI * snap.p) * 0.55 : 0)

    // Digging: ripples out to the tools, then the unhelpful result.
    if (snap.dwell?.dig && snap.packet) {
      const from = snap.packet
      const a = toolById.get('slack')
      const b = toolById.get('notion')
      if (a && rippleA) {
        rippleA.setAttribute('x1', String(from.x))
        rippleA.setAttribute('y1', String(from.y))
        rippleA.setAttribute('x2', String(a.x + 20))
        rippleA.setAttribute('y2', String(a.y + 12))
        setO(rippleA, 0.5 * Math.min(1, snap.p * 4) * o)
      }
      if (b && rippleB) {
        rippleB.setAttribute('x1', String(from.x))
        rippleB.setAttribute('y1', String(from.y))
        rippleB.setAttribute('x2', String(b.x + 20))
        rippleB.setAttribute('y2', String(b.y + 12))
        setO(rippleB, 0.5 * Math.min(1, snap.p * 4) * o)
      }
      if (rippleRes) {
        rippleRes.setAttribute('x', String(from.x - 16))
        rippleRes.setAttribute('y', String(from.y + 28))
        setO(rippleRes, snap.p > 0.45 ? 0.9 * o : 0)
      }
    } else {
      setO(rippleA, 0)
      setO(rippleB, 0)
      setO(rippleRes, 0)
    }

    // Nights: the whole scene dims each time the sim clock crosses midnight.
    let dim = 0
    for (const c of BEFORE.nights) {
      const u = (t - c) / 950 + 0.5
      if (u > 0 && u < 1) dim = Math.max(dim, Math.sin(Math.PI * u))
    }
    setO(nightEl, dim * 0.55)
    for (const el of traceEls) setO(el, 0)
    setO(nightLabelEl, 0)
    for (const el of microEls) setO(el, 0)
  }

  const renderIdle = () => {
    hideMoving()
    setActiveHuman(null)
    setBeforeLedger(null)
    setText(led.aHand, '·')
    setText(led.aEl, '·')
    setText(led.aWork, '·')
    setO(clockEl, 0)
    setO(nightEl, 0)
  }

  const renderAfter = (t: number, now: number) => {
    const snap = snapshotAt(AFTER, t)
    const o = snap.fade
    const stepIdx = AFTER.steps.indexOf(snap.step)
    const inAmbient = stepIdx === ambientIdx

    setPacket(snap, inAmbient ? 0 : o)
    setDwell(snap, now, inAmbient ? 0 : o)
    setActiveHuman(snap)
    setQuestion(snap, o)
    setBeforeLedger(null)

    traceEls.forEach((el, i) => setO(el, i < snap.trace ? 0.9 * o : 0))

    // Ledger, after column. Elapsed freezes at the run's end; the clock keeps going.
    const touches = (stepIdx > decisionIdx ? 1 : 0) + (stepIdx > approvalIdx ? 1 : 0)
    setText(led.aHand, String(touches))
    setText(led.aEl, fmtSim(Math.min(snap.sim, simAtDone)))
    setText(led.aWork, fmtShort(snap.work))
    setText(clockEl, `t+${fmtSim(snap.sim)}`)
    setO(clockEl, 0.9 * o)

    // Lattice nodes flash as the packet passes through them.
    for (const el of lnodeEls) {
      const x = Number(el.dataset.x)
      const y = Number(el.dataset.y)
      const near = snap.packet && Math.hypot(snap.packet.x - x, snap.packet.y - y) < 12
      const rect = el.querySelector('rect')
      if (rect)
        rect.setAttribute('stroke', near ? 'var(--color-accent)' : 'var(--color-border-strong)')
    }

    // The ambient hold: night over the ring, the centre still working.
    if (inAmbient) {
      const nightO = Math.min(ramp(snap.p, 0, 0.18), 1 - ramp(snap.p, 0.85, 1))
      setO(nightEl, nightO * 0.5)
      for (const el of humanEls.values()) setO(el, 1 - nightO * 0.65)
      setO(nightLabelEl, nightO * 0.9)
      microEls.forEach((el, i) => {
        const u = (now / 1100 + i * 0.5) % 1
        const edge = ledgeEls[i % ledgeEls.length]
        if (!edge) return
        const p = edge.getPointAtLength(u * (ledgeLens[i % ledgeLens.length] ?? 0))
        el.setAttribute('cx', String(p.x))
        el.setAttribute('cy', String(p.y))
        setO(el, nightO * 0.85)
      })
    } else {
      setO(nightEl, 0)
      setO(nightLabelEl, 0)
      for (const el of humanEls.values()) setO(el, 1)
      for (const el of microEls) setO(el, 0)
    }
    setO(lateralEl, 0)
    setO(rippleA, 0)
    setO(rippleB, 0)
    setO(rippleRes, 0)
  }

  // ---------------------------------------------------------------------------
  // Main loop.
  // ---------------------------------------------------------------------------

  const frame = (now: number) => {
    if (destroyed) return
    const dt = Math.min(64, now - last)
    last = now

    const target = mode === 'before' ? 0 : 1
    if (lp !== target) {
      const d = dt / PIVOT_MS
      lp = target > lp ? Math.min(target, lp + d) : Math.max(target, lp - d)
      hideMoving()
      setO(nightEl, 0)
      for (const el of humanEls.values()) setO(el, 1)
      setText(clockEl, '')
    }
    layoutHumans(now)
    layoutScene()

    if (lp === 0) {
      beforeT = (beforeT + dt) % BEFORE.total
      renderBefore(beforeT, now)
    } else if (lp === 1) {
      if (mode === 'after') {
        afterT = (afterT + dt) % AFTER.total
        renderAfter(afterT, now)
      } else {
        renderIdle()
      }
    }

    raf = requestAnimationFrame(frame)
  }

  /** Reduced motion: present the settled after-state, no animation. */
  const renderStatic = () => {
    lp = 1
    layoutHumans(0)
    layoutScene()
    hideMoving()
    const t = (AFTER.starts[compareIdx] ?? 0) + 10
    renderAfter(t, 0)
    setPacket(snapshotAt(AFTER, t), 0)
    setBeforeLedger(null)
  }

  if (reduceMotion) {
    renderStatic()
  } else {
    raf = requestAnimationFrame((now) => {
      last = now
      frame(now)
    })
  }

  return {
    setMode(m: Mode) {
      if (reduceMotion || m === mode) return
      // Restart the incoming act from its beginning so the story reads cleanly.
      if (m === 'before') beforeT = 0
      if (m === 'after' && mode !== 'after') afterT = 0
      mode = m
    },
    destroy() {
      destroyed = true
      cancelAnimationFrame(raf)
    },
  }
}
