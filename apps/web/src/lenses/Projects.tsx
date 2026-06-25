import { rolesChronological, yearOf } from '@noahclark/graph-engine'
import type { Project } from '@noahclark/schema'
import { Tag } from '@noahclark/ui'
import { motion } from 'motion/react'
import { dataset } from '../lib'
import { useStore } from '../store'

const reveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8% 0px' },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
}

const roles = rolesChronological(dataset.roles)

interface Group {
  label: string
  meta?: string
  projects: Project[]
}

// Projects grouped by the job they belong to, plus standalone client/personal work.
const groups: Group[] = [
  ...roles
    .map((r) => ({
      label: r.title,
      meta: dataset.orgs.find((o) => o.id === r.org)?.name,
      projects: dataset.projects.filter((p) => p.role === r.id),
    }))
    .filter((g) => g.projects.length > 0),
  {
    label: 'Independent & client work',
    projects: dataset.projects.filter((p) => !p.role),
  },
].filter((g) => g.projects.length > 0)

function roleYears(p: Project): string | undefined {
  if (p.year) return p.year
  const r = p.role ? dataset.roles.find((x) => x.id === p.role) : undefined
  if (!r) return undefined
  return `${yearOf(r.start)}–${r.end === 'present' ? 'now' : yearOf(r.end)}`
}

export function Projects() {
  const { dispatch } = useStore()
  return (
    <div className="space-y-12">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="font-display text-base italic text-text-muted">
            {g.meta ? `${g.label} · ${g.meta}` : g.label}
          </div>
          <dl className="mt-3 border-t border-border">
            {g.projects.map((p) => (
              <motion.div
                key={p.id}
                {...reveal}
                className="group grid cursor-pointer gap-2 border-b border-border py-5 md:grid-cols-3 md:gap-6"
                onClick={() => dispatch({ type: 'openEntity', id: p.id })}
              >
                <dt className="md:col-span-1">
                  <span className="font-display text-lg text-text group-hover:text-accent">{p.name}</span>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-wide text-text-faint">
                    <span className="rounded border border-border px-1.5 py-0.5">{p.kind}</span>
                    {roleYears(p) && <span>{roleYears(p)}</span>}
                    {p.url && <span className="text-accent">live ↗</span>}
                  </div>
                </dt>
                <dd className="md:col-span-2">
                  <p className="text-sm leading-relaxed text-text-muted">{p.summary}</p>
                  {p.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.skills.slice(0, 6).map((s) => (
                        <Tag key={s}>{s}</Tag>
                      ))}
                    </div>
                  )}
                  {p.image && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 block max-w-sm overflow-hidden rounded border border-border transition-colors hover:border-border-strong"
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
              </motion.div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}
