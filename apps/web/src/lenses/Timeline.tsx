import { rolesChronological, yearOf } from '@noahclark/graph-engine'
import { Tag } from '@noahclark/ui'
import { motion } from 'motion/react'
import { dataset, threadColor } from '../lib'
import { useStore } from '../store'

const roles = rolesChronological(dataset.roles)

export function Timeline() {
  const { dispatch } = useStore()
  return (
    <ol className="relative ml-1 border-l border-border pl-6">
      {roles.map((r) => {
        const org = dataset.orgs.find((o) => o.id === r.org)
        return (
          <motion.li
            key={r.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-10"
          >
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-ink bg-accent" />
            <div className="font-mono text-xs text-text-faint">
              {yearOf(r.start)} — {r.end === 'present' ? 'now' : yearOf(r.end)}
            </div>
            <button type="button" onClick={() => dispatch({ type: 'openEntity', id: r.id })} className="mt-1 block text-left">
              <h3 className="font-display text-lg font-semibold text-text hover:text-accent">{r.title}</h3>
              <div className="text-sm text-text-muted">
                {org?.name}
                {r.location ? ` · ${r.location}` : ''}
              </div>
            </button>
            <p className="mt-2 max-w-2xl text-sm text-text-muted">{r.summary}</p>
            {r.metrics.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-faint">
                {r.metrics.map((m) => (
                  <span key={m.label}>
                    <span className="text-text">{m.value}</span> {m.label}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.threads.map((t) => (
                <Tag key={t} color={threadColor[t]} onClick={() => dispatch({ type: 'highlightThread', id: t })}>
                  {t}
                </Tag>
              ))}
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
