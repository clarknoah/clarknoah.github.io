import { yearOf } from '@noahclark/graph-engine'
import type { Role } from '@noahclark/schema'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { type ComponentType, useEffect, useRef, useState } from 'react'
import { dataset } from '../lib'
import { scenes, type VizKind } from '../story/scenes'
import { BrainViz } from '../story/viz/BrainViz'
import { CatalogViz } from '../story/viz/CatalogViz'
import { ForgeViz } from '../story/viz/ForgeViz'
import { GlobeViz } from '../story/viz/GlobeViz'
import { GrowthViz } from '../story/viz/GrowthViz'
import { SilosViz } from '../story/viz/SilosViz'
import { SwarmAtlasViz } from '../story/viz/SwarmAtlasViz'
import { ThoughtStreamViz } from '../story/viz/ThoughtStreamViz'
import { TreeViz } from '../story/viz/TreeViz'

type VizProps = { role: Role; active: boolean }
const asViz = (c: ComponentType<{ role: unknown; active: boolean }>) => c as ComponentType<VizProps>

// One bespoke visualization per era (designed with Noah).
const VIZ: Record<VizKind, ComponentType<VizProps>> = {
  forge: asViz(ForgeViz),
  silos: asViz(SilosViz),
  catalog: asViz(CatalogViz),
  brain: asViz(BrainViz),
  globe: GlobeViz,
  tree: asViz(TreeViz),
  growth: asViz(GrowthViz),
  thoughtstream: asViz(ThoughtStreamViz),
  swarm: asViz(SwarmAtlasViz),
}

const roleById = new Map(dataset.roles.map((r) => [r.id, r]))
const steps = scenes
  .map((s) => ({ ...s, role: roleById.get(s.roleId) }))
  .filter((s): s is { roleId: string; viz: VizKind; role: Role } => s.role !== undefined)

function SceneText({ role, idx, onActive }: { role: Role; idx: number; onActive: (i: number) => void }) {
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
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.12, y: 24 }}
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
  const step = steps[active]
  const Viz = step ? VIZ[step.viz] : GlobeViz

  return (
    <main className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">the path</p>
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-text md:text-4xl">
          Eighteen years, told as data.
        </h1>
        <p className="mt-2 font-mono text-xs text-text-faint">scroll ↓</p>
      </div>

      {/* Sticky stage; the active era's visualization crossfades in. On mobile the viz
          sits in the top portion so the scene card (bottom) never covers it. */}
      <div className="pointer-events-none sticky top-0 z-0 flex h-screen items-start justify-center px-6 pt-20 md:items-center md:pt-0">
        <AnimatePresence mode="wait">
          {step && (
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="flex w-full max-w-[300px] items-center justify-center md:max-w-[520px]"
            >
              <Viz role={step.role} active />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 -mt-[100vh] mx-auto max-w-6xl">
        {steps.map((s, i) => (
          <SceneText key={s.roleId} role={s.role} idx={i} onActive={setActive} />
        ))}
      </div>
    </main>
  )
}
