import { Section, Stat, Tag } from '@noahclark/ui'
import { motion } from 'motion/react'
import { dataset, index, profile, services, threadColor } from './lib'
import { useStore } from './store'

const MotionDiv = motion.div
const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

const currentRoles = dataset.roles.filter((r) => r.end === 'present')

// Verified figures only (each traces to the résumé). Kept terse and faint under the headline.
const HERO_FIGURES = [
  { v: '1.2M', l: 'users scaled' },
  { v: '20,000+', l: 'devices in production' },
  { v: '670', l: 'entity graph, agent-queryable' },
]

export function Hero() {
  const { dispatch } = useStore()
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-14 md:pt-28">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <MotionDiv
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
            {profile.name} · {profile.title}
          </p>
          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.06] tracking-tight text-text md:text-6xl">
            {profile.positioning}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted md:text-xl">{profile.subhead}</p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
            {HERO_FIGURES.map((f) => (
              <div key={f.l} className="flex items-baseline gap-2">
                <dt className="tabular text-text">{f.v}</dt>
                <dd className="text-text-faint">{f.l}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-md bg-accent px-4 py-2 font-mono text-sm text-ink transition-opacity hover:opacity-90"
            >
              start a conversation
            </a>
            <button
              type="button"
              onClick={() => dispatch({ type: 'downloadResume' })}
              className="font-mono text-sm text-text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              résumé ↗
            </button>
          </div>
        </MotionDiv>

        <MotionDiv
          className="hidden lg:col-span-4 lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <dl className="space-y-4 border-l border-border pl-6 font-mono text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-text-faint">available</dt>
              <dd className="mt-1 text-text">Independent and contract work</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-text-faint">based in</dt>
              <dd className="mt-1 text-text">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-text-faint">currently</dt>
              <dd className="mt-1 space-y-0.5 text-text">
                {currentRoles.map((r) => (
                  <div key={r.id}>
                    {r.title}, {dataset.orgs.find((o) => o.id === r.org)?.name}
                  </div>
                ))}
              </dd>
            </div>
          </dl>
        </MotionDiv>
      </div>
    </section>
  )
}

// What someone can hire Noah to do. Editorial definition list, not a card grid: term left,
// plain description plus a verifiable proof line right. Proof links open the entity panel.
export function Services() {
  const { dispatch } = useStore()
  return (
    <Section id="services" eyebrow="services" title="What I do">
      <dl className="border-t border-border">
        {services.map((s) => {
          const proofProject = s.proof ? dataset.projects.find((p) => p.id === s.proof) : undefined
          return (
            <MotionDiv
              key={s.id}
              {...reveal}
              className="grid gap-3 border-b border-border py-7 md:grid-cols-3 md:gap-8"
            >
              <dt className="font-display text-xl text-text md:col-span-1">{s.name}</dt>
              <dd className="space-y-3 md:col-span-2">
                <p className="leading-relaxed text-text-muted">{s.blurb}</p>
                <p className="font-mono text-xs text-text-faint">
                  {proofProject ? (
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'openEntity', id: proofProject.id })}
                      className="text-left underline-offset-2 hover:text-accent hover:underline"
                    >
                      {s.proofLabel}
                    </button>
                  ) : (
                    s.proofLabel
                  )}
                </p>
              </dd>
            </MotionDiv>
          )
        })}
      </dl>
    </Section>
  )
}

const FEATURED_STATS = [
  { value: '18 yrs', label: 'engineering', context: 'USAF to iAm' },
  { value: '1.2M+', label: 'users scaled', context: 'WorkforceEdge' },
  { value: '20,000+', label: 'IoT devices', context: 'Quatt fleet' },
  { value: '670', label: 'Atlas entities', context: 'knowledge graph' },
  { value: '59', label: 'enterprise partners', context: 'WorkforceEdge' },
  { value: '$1.1B', label: 'infra strategy', context: 'DIA consolidation' },
]

export function StatWall() {
  return (
    <Section id="numbers" eyebrow="by the numbers" title="Scope, in figures">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
        {FEATURED_STATS.map((s) => (
          <MotionDiv key={s.label} {...reveal}>
            <Stat value={s.value} label={s.label} context={s.context} />
          </MotionDiv>
        ))}
      </div>
    </Section>
  )
}

// Editorial definition list: title left, claim + receipts right. Not a card grid.
export function Capabilities() {
  const { dispatch } = useStore()
  return (
    <dl className="border-t border-border">
      {dataset.capabilities.map((c) => {
        const evidence = index.evidenceFor(c.evidence)
        return (
          <MotionDiv key={c.id} {...reveal} className="grid gap-3 border-b border-border py-7 md:grid-cols-3 md:gap-8">
            <dt className="font-display text-xl text-text md:col-span-1">{c.name}</dt>
            <dd className="space-y-3 md:col-span-2">
              <p className="leading-relaxed text-text-muted">{c.blurb}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {c.threads.map((t) => (
                  <Tag key={t} color={threadColor[t]}>
                    {t}
                  </Tag>
                ))}
                <span className="font-mono text-xs text-text-faint">·</span>
                {evidence.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => dispatch({ type: 'openEntity', id: e.id })}
                    className="font-mono text-xs text-text-muted underline-offset-2 hover:text-accent hover:underline"
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </dd>
          </MotionDiv>
        )
      })}
    </dl>
  )
}

const FEATURED_WORK = ['iam', 'atlas', 'workforceedge', 'dia-asset-mgmt']

// Editorial list, not tiles.
export function SelectedWork() {
  const { dispatch } = useStore()
  const projects = FEATURED_WORK.map((id) => dataset.projects.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => p !== undefined,
  )
  return (
    <Section id="work" eyebrow="selected work" title="Things built">
      <dl className="border-t border-border">
        {projects.map((p) => (
          <MotionDiv
            key={p.id}
            {...reveal}
            className="group grid cursor-pointer gap-3 border-b border-border py-7 md:grid-cols-3 md:gap-8"
            onClick={() => dispatch({ type: 'openEntity', id: p.id })}
          >
            <dt className="md:col-span-1">
              <span className="font-display text-xl text-text group-hover:text-accent">{p.name}</span>
              {p.url && <span className="ml-2 font-mono text-xs text-accent">↗</span>}
            </dt>
            <dd className="space-y-3 md:col-span-2">
              <p className="leading-relaxed text-text-muted">{p.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.skills.slice(0, 6).map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </dd>
          </MotionDiv>
        ))}
      </dl>
    </Section>
  )
}

export function Now() {
  return (
    <Section id="now" title="What I'm doing">
      <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
        Founding <span className="text-text">iAm</span>, a graph-native platform for measuring
        subjective experience, and leading the cloud platform team at{' '}
        <span className="text-text">Quatt</span>. Most of my attention goes to building products
        end to end with AI agents at the centre of the work.
      </p>
    </Section>
  )
}

export function Contact() {
  return (
    <Section id="contact" title="Get in touch">
      <div className="flex flex-col gap-5">
        <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
          {profile.availability} Tell me what you are trying to measure, model, or automate, and I
          will tell you honestly whether I am the right person for it.
        </p>
        <a href={`mailto:${profile.email}`} className="font-display text-2xl text-accent hover:underline">
          {profile.email}
        </a>
        <div className="flex flex-wrap gap-4 font-mono text-sm text-text-muted">
          {profile.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:text-accent">
              {l.label} ↗
            </a>
          ))}
        </div>
        <p className="mt-2 font-mono text-xs text-text-faint">{profile.location}</p>
      </div>
    </Section>
  )
}
