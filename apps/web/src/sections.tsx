import { Card, Section, Stat, Tag } from '@noahclark/ui'
import { motion } from 'motion/react'
import { dataset, index, profile, threadColor } from './lib'
import { useStore } from './store'

const MotionDiv = motion.div
const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

export function Hero() {
  const { dispatch } = useStore()
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-10 md:pt-28">
      <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{profile.title}</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-text md:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-5 max-w-2xl font-display text-xl text-text md:text-2xl">{profile.tagline}</p>
        <p className="mt-4 max-w-2xl text-text-muted">{profile.summary}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-md bg-accent px-4 py-2 font-mono text-sm text-ink transition-opacity hover:opacity-90"
          >
            get in touch
          </a>
          <button
            type="button"
            onClick={() => dispatch({ type: 'downloadResume' })}
            className="rounded-md border border-border-strong px-4 py-2 font-mono text-sm text-text transition-colors hover:bg-surface"
          >
            résumé ↗
          </button>
        </div>
      </MotionDiv>
    </section>
  )
}

const FEATURED_STATS = [
  { value: '18 yrs', label: 'engineering', context: 'USAF → iAm' },
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

export function Capabilities() {
  const { dispatch } = useStore()
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {dataset.capabilities.map((c) => {
        const evidence = index.evidenceFor(c.evidence)
        return (
          <MotionDiv key={c.id} {...reveal}>
            <Card accent={threadColor[c.threads[0] ?? 'graph']}>
              <h3 className="font-display text-lg font-semibold text-text">{c.name}</h3>
              <p className="mt-2 text-sm text-text-muted">{c.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.threads.map((t) => (
                  <Tag key={t} color={threadColor[t]}>
                    {t}
                  </Tag>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <p className="font-mono text-xs text-text-faint">evidence</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
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
              </div>
            </Card>
          </MotionDiv>
        )
      })}
    </div>
  )
}

const FEATURED_WORK = ['iam', 'atlas', 'workforceedge', 'dia-asset-mgmt']

export function SelectedWork() {
  const { dispatch } = useStore()
  const projects = FEATURED_WORK.map((id) => dataset.projects.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => p !== undefined,
  )
  return (
    <Section id="work" eyebrow="selected work" title="Things built">
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <MotionDiv key={p.id} {...reveal}>
            <Card interactive onClick={() => dispatch({ type: 'openEntity', id: p.id })}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-text">{p.name}</h3>
                {p.url && <span className="font-mono text-xs text-accent">↗</span>}
              </div>
              <p className="mt-2 text-sm text-text-muted">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.skills.slice(0, 6).map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </Card>
          </MotionDiv>
        ))}
      </div>
    </Section>
  )
}

export function Now() {
  return (
    <Section id="now" eyebrow="now" title="What I'm doing">
      <p className="max-w-2xl text-lg text-text-muted">
        Founding <span className="text-text">iAm</span>, a graph-native platform for measuring
        subjective experience, and leading the cloud platform team at{' '}
        <span className="text-text">Quatt</span>. Most of my attention goes to building products
        end-to-end with AI agents at the centre of the workflow.
      </p>
    </Section>
  )
}

export function Contact() {
  return (
    <Section id="contact" eyebrow="contact" title="Get in touch">
      <div className="flex flex-col gap-4">
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
