import { Section, Tag } from '@noahclark/ui'
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

// A plain opening: a sentence of what I do, who it is for, and two quiet links.
// No headline-as-slogan, no numbers wall, no filled call-to-action button.
export function Hero() {
  const { dispatch } = useStore()
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-12 md:pt-28">
      <MotionDiv
        className="max-w-2xl"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-text md:text-[2.6rem]">
          {profile.positioning}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-text-muted">{profile.subhead}</p>
        <div className="mt-6 flex flex-wrap items-center gap-5 text-base">
          <a
            href={`mailto:${profile.email}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            Email me
          </a>
          <button
            type="button"
            onClick={() => dispatch({ type: 'downloadResume' })}
            className="text-text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            Résumé ↗
          </button>
        </div>
      </MotionDiv>
    </section>
  )
}

// What someone can hire Noah to do. Editorial definition list, not a card grid: term left,
// plain description plus a verifiable proof line right. Proof links open the entity panel.
export function Services() {
  const { dispatch } = useStore()
  return (
    <Section id="services" eyebrow="Services" title="What I do">
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

const FEATURED_WORK = ['iam', 'atlas', 'workforceedge', 'icpr-conference', 'myguidedgrowth', 'dia-asset-mgmt']

// Editorial list, not tiles.
export function SelectedWork() {
  const { dispatch } = useStore()
  const projects = FEATURED_WORK.map((id) => dataset.projects.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => p !== undefined,
  )
  return (
    <Section id="work" eyebrow="Selected work" title="Things built">
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
              {p.image && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="block max-w-sm overflow-hidden rounded border border-border transition-colors hover:border-border-strong"
                >
                  <img
                    src={p.image}
                    alt={`${p.name} website`}
                    loading="lazy"
                    className="block aspect-[16/10] w-full object-cover object-top"
                  />
                </a>
              )}
            </dd>
          </MotionDiv>
        ))}
      </dl>
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
