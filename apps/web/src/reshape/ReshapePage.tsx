import { profile } from '@noahclark/architecture'
import { useEffect, useRef } from 'react'
import { type Mode, createReshapeEngine } from './engine'
import {
  CENTER,
  DIG_RESULT,
  H,
  HUMANS,
  LATTICE_EDGES,
  LATTICE_NODES,
  TOOLS,
  TOOL_H,
  TOOL_W,
  TRACES,
  TREE_EDGES,
  W,
  humanById,
  latticeById,
} from './scene'

/**
 * /reshape: a hidden, URL-only page. One canvas, three acts. A question crosses an
 * org tree by hand (days of waiting), the organization reshapes around a queryable
 * source of truth, and the same question re-runs in minutes. The scroll rail on the
 * right advances the act; each act runs on its own clock.
 */

const STEPS: { eyebrow: string; title: string; body: string; mode: Mode }[] = [
  {
    eyebrow: 'before',
    title: 'Point to point',
    mode: 'before',
    body: 'An organisation is shaped by a constraint: one person can only hold so many conversations. So we build trees, and information moves point to point along the branches, through inboxes, standups and Thursday syncs. Follow one question. The work in it is measured in hours; the waiting is measured in days. And each retelling compresses the question a little more.',
  },
  {
    eyebrow: 'the reshaping',
    title: 'Truth moves to the centre',
    mode: 'pivot',
    body: 'Two moves happen together. The knowledge that lived in threads, docs and heads gets a structure: typed, current, queryable by people and agents alike. And the people move to the edge, where the judgment calls live. Nobody disappears from this picture. What disappears is routing as a job: the part of everyone’s day that was spent carrying information between other people.',
  },
  {
    eyebrow: 'after',
    title: 'The same question, re-run',
    mode: 'after',
    body: 'An agent picks the question up, queries the structure, and runs the workflow end to end. It interrupts a human exactly twice, at the two moments that need one. Nothing is retold, so nothing degrades. The answer comes back in under half an hour, and the centre keeps working after the ring goes home.',
  },
  {
    eyebrow: 'the offer',
    title: 'This is the work I do',
    mode: 'after',
    body: 'The gap between these two pictures is not a tool purchase. It is a reshaping: of where your knowledge lives, what your workflows are made of, and where your people spend their judgment. That is the work I take on: mapping where truth actually sits in your organisation, giving it a structure worth querying, and building the agents and workflows on top.',
  },
]

const treePt = (id: string) => {
  const h = humanById.get(id)
  if (!h) throw new Error(`unknown human ${id}`)
  return h.tree
}

export function ReshapePage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const engineRef = useRef<ReturnType<typeof createReshapeEngine> | null>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'The shape of the organisation · Noah Clark'
    if (!svgRef.current) return
    const engine = createReshapeEngine(svgRef.current)
    engineRef.current = engine

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const idx = Number((e.target as HTMLElement).dataset.step)
          const step = STEPS[idx]
          if (step) engine.setMode(step.mode)
        }
      },
      { rootMargin: '-42% 0px -42% 0px' },
    )
    const blocks = stepsRef.current?.querySelectorAll('[data-step]') ?? []
    for (const b of blocks) io.observe(b)

    return () => {
      io.disconnect()
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  return (
    <div className="min-h-screen">
      <header className="mx-auto w-full max-w-[1400px] px-6 pt-12 pb-2">
        <a
          href="/"
          className="font-display text-base italic text-text-faint transition-colors hover:text-accent"
        >
          Noah Clark
        </a>
        <h1 className="mt-6 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight text-text md:text-4xl">
          The shape of the organisation
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
          Watch one question cross a company the old way, then watch the same question after the
          reshaping. The difference is not people working faster. It is the waiting between them
          going away.
        </p>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-6 pb-28 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
        <div className="sticky top-0 z-10 self-start bg-ink py-3 lg:top-6">
          <div className="overflow-x-auto">
            <Canvas ref={svgRef} />
          </div>
          <p className="mt-1 font-mono text-[11px] text-text-faint">
            times illustrative · the shape is not
          </p>
        </div>

        <div ref={stepsRef} className="mt-4 lg:mt-0">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              data-step={i}
              className="flex min-h-[70vh] flex-col justify-center lg:min-h-[85vh]"
            >
              <p className="font-display text-base italic text-text-faint">{s.eyebrow}</p>
              <h2 className="mt-2 font-display text-2xl text-text">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-text-muted">{s.body}</p>
              {i === STEPS.length - 1 && (
                <div className="mt-6 flex flex-wrap items-center gap-5 text-base">
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    Email me
                  </a>
                  <a
                    href="/"
                    className="text-text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    More about the work →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Canvas({ ref }: { ref: React.Ref<SVGSVGElement> }) {
  const l1 = treePt('l1')
  const l3 = treePt('l3')
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full min-w-[640px]"
      role="img"
      aria-label="An org chart where a question travels person to person over days, reshaping into a ring of people around a queryable source of truth where the same question resolves in minutes."
    >
      {/* Spokes: each person's direct line to the centre, once the ring exists. */}
      <g>
        {HUMANS.map((h) => (
          <line
            key={`spoke-${h.id}`}
            className="rp-spoke"
            data-h={h.id}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={h.tree.x}
            y2={h.tree.y}
            stroke="var(--color-text)"
            strokeWidth={0.7}
            style={{ opacity: 0 }}
          />
        ))}
      </g>

      {/* Reporting lines of the tree. */}
      <g>
        {TREE_EDGES.map(([a, b]) => {
          const pa = treePt(a)
          const pb = treePt(b)
          return (
            <path
              key={`te-${a}-${b}`}
              className="rp-tedge"
              d={`M ${pa.x} ${pa.y} L ${pb.x} ${pb.y}`}
              fill="none"
              stroke="var(--color-border-strong)"
              strokeWidth={1}
              style={{ opacity: 0.35 }}
            />
          )
        })}
      </g>

      {/* The cross-team hop has no reporting line: a dashed one appears just for it. */}
      <path
        id="rp-lateral"
        d={`M ${l1.x} ${l1.y} Q ${CENTER.x} ${l1.y - 84} ${l3.x} ${l3.y}`}
        fill="none"
        stroke="var(--color-accent-dim)"
        strokeWidth={1}
        strokeDasharray="4 4"
        style={{ opacity: 0 }}
      />

      {/* The central lattice: typed edges first, then node tags above them. */}
      <g>
        {LATTICE_EDGES.map((e, i) => {
          const a = latticeById.get(e.from)
          const b = latticeById.get(e.to)
          if (!a || !b) return null
          return (
            <path
              key={`le-${e.from}-${e.to}`}
              className="rp-ledge"
              data-i={i}
              d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
              fill="none"
              stroke="var(--color-accent-dim)"
              strokeWidth={0.9}
              style={{ opacity: 0 }}
            />
          )
        })}
        {LATTICE_EDGES.map((e) => {
          const a = latticeById.get(e.from)
          const b = latticeById.get(e.to)
          if (!a || !b) return null
          return (
            <text
              key={`lel-${e.from}-${e.to}`}
              className="rp-ledge-label"
              x={(a.x + b.x) / 2 + 6}
              y={(a.y + b.y) / 2 - 5}
              fontSize={9.5}
              fontFamily="var(--font-mono, monospace)"
              fill="var(--color-text-faint)"
              style={{ opacity: 0 }}
            >
              {e.label}
            </text>
          )
        })}
        {LATTICE_NODES.map((n) => (
          <g
            key={`ln-${n.id}`}
            className="rp-lnode"
            data-l={n.id}
            data-x={n.x}
            data-y={n.y}
            transform={`translate(${n.x} ${n.y})`}
            style={{ opacity: 0 }}
          >
            <rect
              x={-n.w / 2}
              y={-13}
              width={n.w}
              height={26}
              rx={3}
              fill="var(--color-surface)"
              stroke="var(--color-border-strong)"
              strokeWidth={1}
            />
            <text
              y={4}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-mono, monospace)"
              fill="var(--color-text-muted)"
            >
              {n.label}
            </text>
          </g>
        ))}
      </g>

      {/* Tools: where knowledge lives before. Hairline rows read as fragments of docs. */}
      <g>
        {TOOLS.map((t) => (
          <g key={`tool-${t.id}`} className="rp-tool" data-t={t.id}>
            <rect
              x={t.x}
              y={t.y}
              width={TOOL_W}
              height={TOOL_H}
              rx={3}
              fill="var(--color-surface)"
              stroke="var(--color-border-strong)"
              strokeWidth={1}
            />
            <line
              x1={t.x + 10}
              y1={t.y + 10}
              x2={t.x + 46}
              y2={t.y + 10}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
            <line
              x1={t.x + 10}
              y1={t.y + 17}
              x2={t.x + 38}
              y2={t.y + 17}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
            <line
              x1={t.x + 10}
              y1={t.y + 24}
              x2={t.x + 43}
              y2={t.y + 24}
              stroke="var(--color-border)"
              strokeWidth={1}
            />
            <text
              x={t.x + TOOL_W / 2}
              y={t.y + TOOL_H + 13}
              textAnchor="middle"
              fontSize={10}
              fontFamily="var(--font-mono, monospace)"
              fill="var(--color-text-faint)"
            >
              {t.label}
            </text>
          </g>
        ))}
        {TOOLS.flatMap((t) =>
          [0, 1].map((i) => (
            <circle
              key={`frag-${t.id}-${i}`}
              className="rp-frag"
              data-from={t.id}
              cx={t.x + TOOL_W / 2}
              cy={t.y + TOOL_H / 2}
              r={2.5}
              fill="var(--color-accent)"
              style={{ opacity: 0 }}
            />
          )),
        )}
      </g>

      {/* Agents: hollow diamonds orbiting the centre once it exists. */}
      <g>
        {[0, 1, 2].map((i) => (
          <rect
            key={`agent-${i}`}
            className="rp-agent"
            data-i={i}
            x={-6.5}
            y={-6.5}
            width={13}
            height={13}
            fill="var(--color-surface)"
            stroke="var(--color-accent)"
            strokeWidth={1.2}
            style={{ opacity: 0 }}
          />
        ))}
      </g>

      {/* People. */}
      <g>
        {HUMANS.map((h) => (
          <g
            key={`h-${h.id}`}
            className="rp-human"
            data-h={h.id}
            transform={`translate(${h.tree.x} ${h.tree.y})`}
          >
            <circle
              r={15}
              fill="var(--color-surface)"
              stroke="var(--color-border-strong)"
              strokeWidth={1}
            />
            <text
              y={3.5}
              textAnchor="middle"
              fontSize={10.5}
              fontFamily="var(--font-display, serif)"
              fill="var(--color-text-muted)"
            >
              {h.initials}
            </text>
            {h.role && (
              <text
                className="rp-role"
                y={28}
                textAnchor="middle"
                fontSize={9.5}
                fontFamily="var(--font-mono, monospace)"
                fill="var(--color-text-faint)"
              >
                {h.role}
              </text>
            )}
          </g>
        ))}
      </g>

      {/* Search ripples out to the tools, and what came back. */}
      <line
        id="rp-ripple-a"
        stroke="var(--color-accent-dim)"
        strokeWidth={0.8}
        strokeDasharray="3 3"
        style={{ opacity: 0 }}
      />
      <line
        id="rp-ripple-b"
        stroke="var(--color-accent-dim)"
        strokeWidth={0.8}
        strokeDasharray="3 3"
        style={{ opacity: 0 }}
      />
      <text
        id="rp-ripple-res"
        textAnchor="end"
        fontSize={11}
        fontFamily="var(--font-mono, monospace)"
        fill="var(--color-text-muted)"
        style={{ opacity: 0 }}
      >
        {DIG_RESULT}
      </text>

      {/* Micro packets: the centre still working overnight. */}
      {[0, 1].map((i) => (
        <circle
          key={`micro-${i}`}
          className="rp-micro"
          r={3}
          fill="var(--color-accent)"
          style={{ opacity: 0 }}
        />
      ))}

      {/* The question in flight. */}
      <circle
        id="rp-halo"
        r={15}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1}
        style={{ opacity: 0 }}
      />
      <circle id="rp-packet" r={5.5} fill="var(--color-accent)" style={{ opacity: 0 }} />
      <text
        id="rp-dwell"
        fontSize={12}
        fontFamily="var(--font-mono, monospace)"
        fill="var(--color-accent)"
        style={{ opacity: 0 }}
      />

      {/* The question itself, top left. Rewritten at hops; replaced by the answer. */}
      <text
        id="rp-q-label"
        x={24}
        y={36}
        fontSize={11}
        fontFamily="var(--font-mono, monospace)"
        fill="var(--color-text-faint)"
        style={{ opacity: 0 }}
      />
      <text
        id="rp-q1"
        x={24}
        y={64}
        fontSize={19}
        fontStyle="italic"
        fontFamily="var(--font-display, serif)"
        fill="var(--color-text)"
        style={{ opacity: 0 }}
      />
      <text
        id="rp-q2"
        x={24}
        y={88}
        fontSize={19}
        fontStyle="italic"
        fontFamily="var(--font-display, serif)"
        fill="var(--color-text)"
        style={{ opacity: 0 }}
      />

      {/* Agent trace, under the question, in the after act. */}
      {TRACES.map((t, i) => (
        <text
          key={t}
          className="rp-trace"
          data-i={i}
          x={24}
          y={112 + i * 17}
          fontSize={11.5}
          fontFamily="var(--font-mono, monospace)"
          fill="var(--color-accent-dim)"
          style={{ opacity: 0 }}
        >
          {t}
        </text>
      ))}

      {/* Clock, top right. */}
      <text
        id="rp-clock"
        x={W - 24}
        y={38}
        textAnchor="end"
        fontSize={14}
        fontFamily="var(--font-mono, monospace)"
        fill="var(--color-text-muted)"
        className="tabular"
        style={{ opacity: 0 }}
      />
      <text
        id="rp-nightlabel"
        x={W - 24}
        y={60}
        textAnchor="end"
        fontSize={11}
        fontFamily="var(--font-mono, monospace)"
        fill="var(--color-text-faint)"
        style={{ opacity: 0 }}
      >
        overnight · 2 more workflows closed
      </text>

      {/* Ledger, bottom left: the same three numbers, before and after. */}
      <g fontFamily="var(--font-mono, monospace)">
        <text id="rp-led-hb" x={150} y={516} fontSize={10} fill="var(--color-text-faint)">
          before
        </text>
        <text
          id="rp-led-ha"
          x={272}
          y={516}
          fontSize={10}
          fill="var(--color-text-faint)"
          style={{ opacity: 0 }}
        >
          after
        </text>
        {(
          [
            ['handoffs', 540],
            ['elapsed', 562],
            ['work (human)', 584],
          ] as const
        ).map(([label, y]) => (
          <text key={label} x={24} y={y} fontSize={12} fill="var(--color-text-muted)">
            {label}
          </text>
        ))}
        <text
          id="rp-led-b-hand"
          x={150}
          y={540}
          fontSize={12.5}
          fill="var(--color-text)"
          className="tabular"
        />
        <text
          id="rp-led-b-el"
          x={150}
          y={562}
          fontSize={12.5}
          fill="var(--color-text)"
          className="tabular"
        />
        <text
          id="rp-led-b-work"
          x={150}
          y={584}
          fontSize={12.5}
          fill="var(--color-text)"
          className="tabular"
        />
        <text
          id="rp-led-a-hand"
          x={272}
          y={540}
          fontSize={12.5}
          fill="var(--color-accent)"
          className="tabular"
          style={{ opacity: 0 }}
        />
        <text
          id="rp-led-a-el"
          x={272}
          y={562}
          fontSize={12.5}
          fill="var(--color-accent)"
          className="tabular"
          style={{ opacity: 0 }}
        />
        <text
          id="rp-led-a-work"
          x={272}
          y={584}
          fontSize={12.5}
          fill="var(--color-accent)"
          className="tabular"
          style={{ opacity: 0 }}
        />
      </g>

      {/* Night: the whole scene dims when the org sleeps. */}
      <rect
        id="rp-night"
        x={0}
        y={0}
        width={W}
        height={H}
        fill="var(--color-ink)"
        style={{ opacity: 0 }}
      />
    </svg>
  )
}
