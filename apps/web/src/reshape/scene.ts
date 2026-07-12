/**
 * Scene data for the /reshape visualization: geometry for the org tree, the ring,
 * the central lattice, and the two workflow scripts (before / after), compiled into
 * pure functions of loop time so the engine can render any frame deterministically.
 *
 * Times are illustrative, not measured claims: dwell durations are picked to read as
 * a familiar week, and the page says so in a caption.
 */

export const W = 920
export const H = 600
export const CENTER = { x: 460, y: 308 }

export interface Pt {
  x: number
  y: number
}

export interface Human {
  id: string
  initials: string
  tier: 'ceo' | 'lead' | 'mgr' | 'ic'
  tree: Pt
  ring: Pt
  role?: string
}

// ---------------------------------------------------------------------------
// People. Tree coordinates are the org chart; ring coordinates are where each
// person lands after the reshaping (an ellipse around the central structure).
// ---------------------------------------------------------------------------

const RX = 330
const RY = 198

const ringAt = (deg: number): Pt => ({
  x: CENTER.x + RX * Math.cos((deg * Math.PI) / 180),
  y: CENTER.y + RY * Math.sin((deg * Math.PI) / 180),
})

interface HumanDef {
  id: string
  initials: string
  tier: Human['tier']
  tree: Pt
  role?: string
}

const HUMAN_DEFS: HumanDef[] = [
  { id: 'ceo', initials: 'JB', tier: 'ceo', tree: { x: 460, y: 84 } },
  { id: 'l1', initials: 'KT', tier: 'lead', tree: { x: 200, y: 176 } },
  { id: 'l2', initials: 'RS', tier: 'lead', tree: { x: 460, y: 176 } },
  { id: 'l3', initials: 'AM', tier: 'lead', tree: { x: 720, y: 176 } },
  { id: 'm1', initials: 'DP', tier: 'mgr', tree: { x: 120, y: 282 } },
  { id: 'm2', initials: 'CV', tier: 'mgr', tree: { x: 280, y: 282 } },
  { id: 'm3', initials: 'HN', tier: 'mgr', tree: { x: 400, y: 282 } },
  { id: 'm4', initials: 'GK', tier: 'mgr', tree: { x: 520, y: 282 } },
  { id: 'm5', initials: 'SW', tier: 'mgr', tree: { x: 640, y: 282 } },
  { id: 'm6', initials: 'LF', tier: 'mgr', tree: { x: 800, y: 282 } },
  { id: 'i1', initials: 'RD', tier: 'ic', tree: { x: 80, y: 408 }, role: 'sales' },
  { id: 'i2', initials: 'TQ', tier: 'ic', tree: { x: 168, y: 408 } },
  { id: 'i3', initials: 'MB', tier: 'ic', tree: { x: 280, y: 408 } },
  { id: 'i4', initials: 'YL', tier: 'ic', tree: { x: 400, y: 408 } },
  { id: 'i5', initials: 'EO', tier: 'ic', tree: { x: 520, y: 408 } },
  { id: 'i6', initials: 'PJ', tier: 'ic', tree: { x: 600, y: 408 } },
  { id: 'i7', initials: 'NV', tier: 'ic', tree: { x: 688, y: 408 }, role: 'engineering' },
  { id: 'i8', initials: 'UC', tier: 'ic', tree: { x: 800, y: 408 } },
]

// Ring order: neighbours in the tree end up spread apart, which reads as the
// hierarchy genuinely dissolving rather than the tree folding in place.
const RING_ORDER = [
  'i1',
  'm1',
  'i2',
  'l1',
  'i3',
  'm2',
  'ceo',
  'm3',
  'i4',
  'l2',
  'i5',
  'm4',
  'i6',
  'l3',
  'i7',
  'm5',
  'i8',
  'm6',
]

export const HUMANS: Human[] = HUMAN_DEFS.map((d) => {
  const k = RING_ORDER.indexOf(d.id)
  return { ...d, ring: ringAt(180 + k * 20) }
})

export const humanById = new Map(HUMANS.map((h) => [h.id, h]))

/** Reporting edges of the tree (parent -> child). */
export const TREE_EDGES: [string, string][] = [
  ['ceo', 'l1'],
  ['ceo', 'l2'],
  ['ceo', 'l3'],
  ['l1', 'm1'],
  ['l1', 'm2'],
  ['l2', 'm3'],
  ['l2', 'm4'],
  ['l3', 'm5'],
  ['l3', 'm6'],
  ['m1', 'i1'],
  ['m1', 'i2'],
  ['m2', 'i3'],
  ['m3', 'i4'],
  ['m4', 'i5'],
  ['m5', 'i6'],
  ['m5', 'i7'],
  ['m6', 'i8'],
]

// ---------------------------------------------------------------------------
// Tools: where knowledge lives before the reshaping. Scattered between the
// branches, each holding fragments (drawn as hairline "text" rows).
// ---------------------------------------------------------------------------

export interface Tool {
  id: string
  label: string
  x: number
  y: number
}

export const TOOLS: Tool[] = [
  { id: 'slite', label: 'slite', x: 250, y: 208 },
  { id: 'sheets', label: 'sheets', x: 668, y: 208 },
  { id: 'slack', label: 'slack', x: 318, y: 348 },
  { id: 'notion', label: 'notion', x: 585, y: 348 },
  { id: 'email', label: 'email', x: 460, y: 464 },
]

export const toolById = new Map(TOOLS.map((t) => [t.id, t]))

// ---------------------------------------------------------------------------
// The central lattice: the typed, queryable source of truth that replaces the
// scattered fragments. Node widths are computed from label length (mono).
// ---------------------------------------------------------------------------

export interface LatticeNode {
  id: string
  label: string
  x: number
  y: number
  w: number
}

const lnode = (id: string, label: string, x: number, y: number): LatticeNode => ({
  id,
  label,
  x,
  y,
  w: 14 + label.length * 4.8,
})

export const LATTICE_NODES: LatticeNode[] = [
  lnode('customer', 'customer', 384, 248),
  lnode('order', 'order', 530, 240),
  lnode('product', 'product', 566, 330),
  lnode('inventory', 'inventory', 462, 392),
  lnode('policy', 'policy', 366, 340),
]

export const latticeById = new Map(LATTICE_NODES.map((n) => [n.id, n]))

export const LATTICE_EDGES: { from: string; to: string; label: string }[] = [
  { from: 'customer', to: 'order', label: 'ordered' },
  { from: 'order', to: 'product', label: 'contains' },
  { from: 'product', to: 'inventory', label: 'in stock' },
  { from: 'policy', to: 'order', label: 'governs' },
]

// ---------------------------------------------------------------------------
// Copy that lives inside the canvas: the question, its degradations, answers.
// Pre-split into lines because SVG text does not wrap.
// ---------------------------------------------------------------------------

export const Q1 = ['Can we ship the custom build', 'to Meridian by the 14th?']
const Q2 = ['Meridian want their order', 'on the 14th. Doable?']
const Q3 = ['Can engineering rush', 'the Meridian thing?']
const Q4 = ['Something about', 'a rush order?']
const A1 = ['Yes, if QA takes it Monday and', 'we skip the staging batch.']
const A2 = ['Engineering says probably fine.']
export const A_AFTER = ['Yes. Skip the staging batch; QA slot', 'booked Monday. Ops notified.']

export const TRACES = [
  'parse · order #4211 · meridian',
  'query · stock + rush policy · 0.3s',
  'plan · skip staging batch → human call',
  'done · 2 human touches · 26m',
]

export const DIG_RESULT = '4 results · 2 stale · 1 contradicts'

// ---------------------------------------------------------------------------
// Scripts. A script is a list of steps; compilation precomputes real-time and
// sim-time offsets so any frame is a pure function of loop time.
// ---------------------------------------------------------------------------

interface StepBase {
  /** Set the question text when this step starts. */
  q?: string[]
  /** Set the answer text when this step starts (replaces the question block). */
  a?: string[]
  /** Reveal agent-trace lines up to this count when this step starts. */
  trace?: number
}

export interface TravelStep extends StepBase {
  k: 'travel'
  from: Pt
  to: Pt
  ms: number
  sim: number
  bow: number
  lateral?: boolean
}

export interface DwellStep extends StepBase {
  k: 'dwell'
  at: Pt
  ms: number
  sim: number
  label: string
  work?: number
  dig?: boolean
}

export interface HoldStep extends StepBase {
  k: 'hold'
  ms: number
  sim: number
}

export interface FadeStep extends StepBase {
  k: 'fade'
  ms: number
  sim: number
}

export type Step = TravelStep | DwellStep | HoldStep | FadeStep

const hp = (id: string): Pt => {
  const h = humanById.get(id)
  if (!h) throw new Error(`unknown human ${id}`)
  return h.tree
}

const rp = (id: string): Pt => {
  const h = humanById.get(id)
  if (!h) throw new Error(`unknown human ${id}`)
  return h.ring
}

const lp = (id: string): Pt => {
  const n = latticeById.get(id)
  if (!n) throw new Error(`unknown lattice node ${id}`)
  return { x: n.x, y: n.y }
}

const travel = (
  from: Pt,
  to: Pt,
  ms: number,
  sim: number,
  bow: number,
  extra?: Partial<TravelStep>,
): TravelStep => ({
  k: 'travel',
  from,
  to,
  ms,
  sim,
  bow,
  ...extra,
})

const dwell = (
  at: Pt,
  label: string,
  ms: number,
  sim: number,
  extra?: Partial<DwellStep>,
): DwellStep => ({
  k: 'dwell',
  at,
  label,
  ms,
  sim,
  ...extra,
})

/** Act one: the question crosses the tree by hand. Waits dominate; the text degrades. */
const BEFORE_STEPS: Step[] = [
  dwell(hp('i1'), 'writing it up', 1300, 20, { work: 10, q: Q1 }),
  travel(hp('i1'), hp('m1'), 800, 10, 14),
  dwell(hp('m1'), 'inbox', 1500, 180),
  travel(hp('m1'), hp('l1'), 800, 10, -14),
  dwell(hp('l1'), 'next 1:1', 2400, 2880, { work: 30 }),
  travel(hp('l1'), hp('l3'), 1200, 15, -84, { lateral: true, q: Q2 }),
  dwell(hp('l3'), "thursday's sync", 3200, 4320, { work: 30 }),
  travel(hp('l3'), hp('m5'), 800, 10, 14, { q: Q3 }),
  dwell(hp('m5'), 'inbox', 1400, 240),
  travel(hp('m5'), hp('i7'), 800, 10, -14, { q: Q4 }),
  dwell(hp('i7'), 'digging through slack + notion', 2600, 45, { work: 45, dig: true }),
  dwell(hp('i7'), 'assessing, after standup', 2200, 1150, { work: 95, a: A1 }),
  travel(hp('i7'), hp('m5'), 700, 10, 14),
  dwell(hp('m5'), 'inbox', 1200, 300),
  travel(hp('m5'), hp('l3'), 700, 10, -14),
  dwell(hp('l3'), 'calendars', 2200, 2880, { work: 10 }),
  travel(hp('l3'), hp('l1'), 1200, 15, 84, { lateral: true, a: A2 }),
  // Note: the sign flips with direction so both lateral hops arc above the tree.
  dwell(hp('l1'), 'inbox', 1100, 180),
  travel(hp('l1'), hp('m1'), 700, 10, 14),
  dwell(hp('m1'), 'inbox', 1100, 180),
  travel(hp('m1'), hp('i1'), 700, 10, -14),
  { k: 'hold', ms: 3600, sim: 0 },
  { k: 'fade', ms: 700, sim: 0 },
]

/** Act two: the same question against the centre. Two human touches, minutes end to end. */
const AFTER_STEPS: Step[] = [
  dwell(rp('i1'), 'asks the system', 1000, 3, { work: 3, q: Q1 }),
  travel(rp('i1'), CENTER, 700, 1, 12),
  travel(CENTER, lp('customer'), 320, 0.2, 6, { trace: 1 }),
  travel(lp('customer'), lp('order'), 300, 0.2, 6),
  travel(lp('order'), lp('inventory'), 300, 0.2, -6),
  travel(lp('inventory'), lp('policy'), 300, 0.2, 6, { trace: 2 }),
  travel(lp('policy'), CENTER, 300, 0.2, -6),
  travel(CENTER, rp('l3'), 650, 1, 12, { trace: 3 }),
  dwell(rp('l3'), 'decision', 1500, 10, { work: 10 }),
  travel(rp('l3'), CENTER, 550, 1, -12),
  travel(CENTER, rp('m4'), 650, 1, 12),
  dwell(rp('m4'), 'approval', 1200, 6, { work: 6 }),
  travel(rp('m4'), CENTER, 550, 1, -12),
  travel(CENTER, rp('i1'), 700, 1, 12, { a: A_AFTER, trace: 4 }),
  { k: 'hold', ms: 3200, sim: 0 },
  // The ambient window: night falls over the ring while the centre keeps working.
  { k: 'hold', ms: 5600, sim: 480 },
  { k: 'fade', ms: 700, sim: 0 },
]

// ---------------------------------------------------------------------------
// Compilation: absolute offsets + night crossings, then pure snapshot lookups.
// ---------------------------------------------------------------------------

export interface CompiledScript {
  steps: Step[]
  starts: number[]
  simStarts: number[]
  workStarts: number[]
  handoffsBefore: number[]
  total: number
  simTotal: number
  workTotal: number
  handoffsTotal: number
  /** Real loop times at which the sim clock crosses midnight. */
  nights: number[]
}

function compile(steps: Step[]): CompiledScript {
  const starts: number[] = []
  const simStarts: number[] = []
  const workStarts: number[] = []
  const handoffsBefore: number[] = []
  const nights: number[] = []
  let t = 0
  let sim = 0
  let work = 0
  let handoffs = 0
  for (const s of steps) {
    starts.push(t)
    simStarts.push(sim)
    workStarts.push(work)
    handoffsBefore.push(handoffs)
    const simEnd = sim + s.sim
    for (let d = Math.floor(sim / 1440) + 1; d * 1440 <= simEnd; d++) {
      nights.push(t + ((d * 1440 - sim) / (simEnd - sim || 1)) * s.ms)
    }
    t += s.ms
    sim = simEnd
    if (s.k === 'dwell' && s.work) work += s.work
    if (s.k === 'travel') handoffs += 1
  }
  return {
    steps,
    starts,
    simStarts,
    workStarts,
    handoffsBefore,
    total: t,
    simTotal: sim,
    workTotal: work,
    handoffsTotal: handoffs,
    nights,
  }
}

export const BEFORE = compile(BEFORE_STEPS)
export const AFTER = compile(AFTER_STEPS)

export interface Snapshot {
  step: Step
  /** Progress within the current step, 0..1. */
  p: number
  packet: Pt | null
  dwell: { at: Pt; label: string; simElapsed: number; dig: boolean } | null
  sim: number
  work: number
  handoffs: number
  text: { label: 'question' | 'answer'; lines: string[] } | null
  trace: number
  /** Opacity multiplier for the moving layer (drops during the fade step). */
  fade: number
  /** True during the terminal hold: end state, ledger settled. */
  final: boolean
}

const easeInOut = (u: number): number => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2)

/** Quadratic bezier through a control point offset perpendicular to the chord. */
export function bowPoint(from: Pt, to: Pt, bow: number, u: number): Pt {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const cx = (from.x + to.x) / 2 + (dy / len) * -bow
  const cy = (from.y + to.y) / 2 + (dx / len) * bow
  const v = 1 - u
  return {
    x: v * v * from.x + 2 * v * u * cx + u * u * to.x,
    y: v * v * from.y + 2 * v * u * cy + u * u * to.y,
  }
}

export function snapshotAt(c: CompiledScript, tRaw: number): Snapshot {
  const t = Math.max(0, Math.min(tRaw, c.total - 1))
  let i = c.steps.length - 1
  for (let k = 0; k < c.steps.length; k++) {
    const start = c.starts[k] ?? 0
    const step = c.steps[k] as Step
    if (t >= start && t < start + step.ms) {
      i = k
      break
    }
  }
  const step = c.steps[i] as Step
  const start = c.starts[i] ?? 0
  const p = Math.min(1, (t - start) / step.ms)
  const sim = (c.simStarts[i] ?? 0) + step.sim * p
  const work = c.workStarts[i] ?? 0
  const handoffs = c.handoffsBefore[i] ?? 0

  let text: Snapshot['text'] = null
  let trace = 0
  for (let k = 0; k <= i; k++) {
    const s = c.steps[k] as Step
    if (s.q) text = { label: 'question', lines: s.q }
    if (s.a) text = { label: 'answer', lines: s.a }
    if (s.trace) trace = s.trace
  }

  let packet: Pt | null = null
  let dw: Snapshot['dwell'] = null
  if (step.k === 'travel') {
    packet = bowPoint(step.from, step.to, step.bow, easeInOut(p))
  } else if (step.k === 'dwell') {
    packet = step.at
    dw = { at: step.at, label: step.label, simElapsed: step.sim * p, dig: Boolean(step.dig) }
  } else if (step.k === 'hold') {
    const prev = c.steps[i - 1]
    if (prev && prev.k === 'travel') packet = prev.to
  }

  return {
    step,
    p,
    packet,
    dwell: dw,
    sim,
    work: step.k === 'dwell' && step.work ? work + step.work * p : work,
    handoffs,
    text,
    trace,
    fade: step.k === 'fade' ? 1 - p : 1,
    final: step.k === 'hold',
  }
}

// ---------------------------------------------------------------------------
// Formatting.
// ---------------------------------------------------------------------------

const pad = (n: number): string => String(Math.floor(n)).padStart(2, '0')

/** Long form for the clock and the elapsed ledger row: 3d 04h, 5h 12m, 26m. */
export function fmtSim(min: number): string {
  const d = Math.floor(min / 1440)
  const h = Math.floor((min % 1440) / 60)
  const m = Math.floor(min % 60)
  if (d > 0) return `${d}d ${pad(h)}h`
  if (h > 0) return `${h}h ${pad(m)}m`
  return `${m}m`
}

/** Short form for dwell labels: 2h 14m, 41m. */
export function fmtShort(min: number): string {
  const h = Math.floor(min / 60)
  const m = Math.floor(min % 60)
  if (h > 0) return `${h}h ${pad(m)}m`
  return `${m}m`
}
