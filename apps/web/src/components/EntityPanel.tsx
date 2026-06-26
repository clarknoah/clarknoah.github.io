import type { Capability, Project, Role, Thread } from '@noahclark/schema'
import { Tag } from '@noahclark/ui'
import { AnimatePresence, motion } from 'motion/react'
import { dataset, index, threadColor } from '../lib'
import { useStore } from '../store'

export function EntityPanel() {
  const { state, dispatch } = useStore()
  const resolved = state.selectedId ? index.entity(state.selectedId) : undefined

  return (
    <AnimatePresence>
      {resolved && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'closePanel' })}
            className="fixed inset-0 z-50 bg-black/50"
            aria-label="close"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-border-strong bg-surface p-6"
          >
            <button
              type="button"
              onClick={() => dispatch({ type: 'closePanel' })}
              className="mb-5 font-mono text-xs text-text-faint hover:text-text"
            >
              ✕ close
            </button>
            <p className="font-display text-base italic text-text-muted">{resolved.kind}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-text">{resolved.label}</h2>
            <Body kind={resolved.kind} id={resolved.id} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Body({ kind, id }: { kind: string; id: string }) {
  const { dispatch } = useStore()

  if (kind === 'role') {
    const r = dataset.roles.find((x) => x.id === id) as Role
    const org = dataset.orgs.find((o) => o.id === r.org)
    return (
      <div className="mt-3 space-y-4">
        <div className="text-sm text-text-muted">
          {org?.name} · {r.start}–{r.end === 'present' ? 'now' : r.end}
        </div>
        <p className="text-sm text-text-muted">{r.summary}</p>
        {r.highlights.length > 0 && (
          <ul className="space-y-1.5 text-sm text-text-muted">
            {r.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-accent">›</span>
                {h}
              </li>
            ))}
          </ul>
        )}
        {r.metrics.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-faint">
            {r.metrics.map((m) => (
              <span key={m.label}>
                <span className="text-text">{m.value}</span> {m.label}
              </span>
            ))}
          </div>
        )}
        <SkillTags ids={r.skills} />
        <ThreadTags ids={r.threads} />
      </div>
    )
  }

  if (kind === 'project') {
    const p = dataset.projects.find((x) => x.id === id) as Project
    return (
      <div className="mt-3 space-y-4">
        {p.image && (
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded border border-border transition-colors hover:border-border-strong"
          >
            <img
              src={p.image}
              alt={`${p.name} website`}
              loading="lazy"
              className="block aspect-[16/10] w-full object-cover object-top"
            />
          </a>
        )}
        <p className="text-sm text-text-muted">{p.summary}</p>
        {p.url && (
          <a href={p.url} target="_blank" rel="noreferrer" className="font-mono text-sm text-accent hover:underline">
            {p.url} ↗
          </a>
        )}
        {p.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {p.images.map((src) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded border border-border transition-colors hover:border-border-strong"
              >
                <img
                  src={src}
                  alt={`${p.name} screenshot`}
                  loading="lazy"
                  className="block aspect-[4/3] w-full object-cover object-top"
                />
              </a>
            ))}
          </div>
        )}
        <SkillTags ids={p.skills} />
        <ThreadTags ids={p.threads} />
      </div>
    )
  }

  if (kind === 'skill') {
    const { roles, projects } = index.usingSkill(id)
    return (
      <div className="mt-3 space-y-3 text-sm text-text-muted">
        <p className="font-mono text-xs text-text-faint">
          used in {roles.length} role(s), {projects.length} project(s)
        </p>
        {[...roles.map((r) => ({ id: r.id, label: r.title })), ...projects.map((p) => ({ id: p.id, label: p.name }))].map(
          (e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => dispatch({ type: 'openEntity', id: e.id })}
              className="block text-left hover:text-accent"
            >
              {e.label}
            </button>
          ),
        )}
      </div>
    )
  }

  if (kind === 'capability' || kind === 'thread') {
    const item = (
      kind === 'capability'
        ? dataset.capabilities.find((x) => x.id === id)
        : dataset.threads.find((x) => x.id === id)
    ) as Capability | Thread
    const evidence = index.evidenceFor(item.evidence)
    return (
      <div className="mt-3 space-y-4">
        <p className="text-sm text-text-muted">{item.blurb}</p>
        <div>
          <p className="font-mono text-xs text-text-faint">evidence</p>
          <div className="mt-1.5 space-y-1">
            {evidence.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => dispatch({ type: 'openEntity', id: e.id })}
                className="block text-left text-sm text-text-muted hover:text-accent"
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'org') {
    const o = dataset.orgs.find((x) => x.id === id)
    const heldRoles = dataset.roles.filter((r) => r.org === id)
    return (
      <div className="mt-3 space-y-3 text-sm text-text-muted">
        <p className="font-mono text-xs text-text-faint">{o?.sector}</p>
        {o?.url && (
          <a href={o.url} target="_blank" rel="noreferrer" className="block font-mono text-sm text-accent hover:underline">
            {o.url} ↗
          </a>
        )}
        {heldRoles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => dispatch({ type: 'openEntity', id: r.id })}
            className="block text-left hover:text-accent"
          >
            {r.title}
          </button>
        ))}
      </div>
    )
  }

  return <p className="mt-3 text-sm text-text-muted">No detail view.</p>
}

function SkillTags({ ids }: { ids: string[] }) {
  const { dispatch } = useStore()
  if (ids.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((s) => (
        <Tag key={s} onClick={() => dispatch({ type: 'highlightSkill', id: s })}>
          {s}
        </Tag>
      ))}
    </div>
  )
}

function ThreadTags({ ids }: { ids: string[] }) {
  const { dispatch } = useStore()
  if (ids.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((t) => (
        <Tag key={t} color={threadColor[t as keyof typeof threadColor]} onClick={() => dispatch({ type: 'highlightThread', id: t })}>
          {t}
        </Tag>
      ))}
    </div>
  )
}
