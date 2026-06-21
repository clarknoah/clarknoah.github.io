import type { Role } from '@noahclark/schema'
import { parseMonth, yearOf } from '@noahclark/graph-engine'
import { motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Globe } from '../components/Globe'
import { dataset } from '../lib'

// Oldest to newest: the journey, traced over time.
const roles = [...dataset.roles].sort((a, b) => parseMonth(a.start) - parseMonth(b.start))

function Scene({ role, idx, onActive }: { role: Role; idx: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.6 })
  useEffect(() => {
    if (inView) onActive(idx)
  }, [inView, idx, onActive])
  const org = dataset.orgs.find((o) => o.id === role.org)
  const metric = role.metrics[0]
  return (
    <section ref={ref} className="flex h-screen items-end justify-start px-6 pb-24 md:items-center md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 24 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md rounded-lg border border-border bg-surface/85 p-6 backdrop-blur-sm"
      >
        <div className="font-mono text-xs text-accent">
          {yearOf(role.start)}–{role.end === 'present' ? 'now' : yearOf(role.end)}
        </div>
        <h2 className="mt-2 font-display text-3xl font-semibold text-text">{role.title}</h2>
        <div className="text-text-muted">
          {org?.name}
          {role.location ? ` · ${role.location.label}` : ''}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{role.summary}</p>
        {metric && (
          <div className="mt-4 font-mono text-sm">
            <span className="text-accent">{metric.value}</span>{' '}
            <span className="text-text-faint">{metric.label}</span>
          </div>
        )}
      </motion.div>
    </section>
  )
}

export function StoryView() {
  const [active, setActive] = useState(0)
  const role = roles[active]
  const target = role?.location ? { lat: role.location.lat, lng: role.location.lng } : null

  return (
    <main className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">the path</p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-text md:text-4xl">
          Eighteen years, traced across the map.
        </h1>
        <p className="mt-2 font-mono text-xs text-text-faint">scroll ↓</p>
      </div>

      {/* Sticky globe; scenes scroll over it. */}
      <div className="pointer-events-none sticky top-0 z-0 flex h-screen items-center justify-center px-6">
        <Globe target={target} />
      </div>

      <div className="relative z-10 -mt-[100vh] mx-auto max-w-6xl">
        {roles.map((r, i) => (
          <Scene key={r.id} role={r} idx={i} onActive={setActive} />
        ))}
      </div>
    </main>
  )
}
