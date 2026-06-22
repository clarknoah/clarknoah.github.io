import { entityTypes, relationships } from '@noahclark/schema'
import { cx } from '@noahclark/ui'
import { useEffect, useState } from 'react'
import { dataset, index } from '../lib'

interface Pkg {
  name: string
  dir: string
  type: 'app' | 'lib'
  dependsOn: string[]
}

const groups: { type: string; items: { id: string; label: string }[] }[] = [
  { type: 'roles', items: dataset.roles.map((r) => ({ id: r.id, label: r.title })) },
  { type: 'projects', items: dataset.projects.map((p) => ({ id: p.id, label: p.name })) },
  { type: 'capabilities', items: dataset.capabilities.map((c) => ({ id: c.id, label: c.name })) },
  { type: 'threads', items: dataset.threads.map((t) => ({ id: t.id, label: t.label })) },
  { type: 'skills', items: dataset.skills.map((s) => ({ id: s.id, label: s.name })) },
  { type: 'orgs', items: dataset.orgs.map((o) => ({ id: o.id, label: o.name })) },
  { type: 'education', items: dataset.education.map((e) => ({ id: e.id, label: e.credential })) },
]

export function RepoView() {
  const [sel, setSel] = useState('iam')
  const [source, setSource] = useState(false)
  const [packages, setPackages] = useState<Pkg[]>([])
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['roles', 'projects']))
  const resolved = index.entity(sel)

  const toggleFolder = (type: string) =>
    setOpenFolders((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })

  useEffect(() => {
    fetch('/repo.json')
      .then((r) => r.json())
      .then((d: { packages: Pkg[] }) => setPackages(d.packages))
      .catch(() => setPackages([]))
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 font-mono text-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">repo view</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-text">packages/architecture</h1>
      <p className="mt-3 max-w-2xl text-text-muted">
        Every entry is a real, validated entity in the career graph: the same data the
        portfolio renders, shown as the repo that produces it. Toggle{' '}
        <span className="text-accent">view source</span> to see the typed object.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        <nav className="h-fit rounded-lg border border-border bg-surface p-3">
          <div className="mb-1 text-text-faint">packages/architecture/src/</div>
          {groups.map((g) => {
            const isOpen = openFolders.has(g.type)
            return (
              <div key={g.type}>
                <button
                  type="button"
                  onClick={() => toggleFolder(g.type)}
                  className="flex w-full items-center gap-1.5 py-0.5 text-left text-text-muted hover:text-text"
                >
                  <span className="w-2 text-accent">{isOpen ? '▾' : '▸'}</span>
                  <span>{g.type}/</span>
                  <span className="text-text-faint">{g.items.length}</span>
                </button>
                {isOpen && (
                  <ul className="ml-[7px] border-border border-l pl-3">
                    {g.items.map((it) => (
                      <li key={it.id}>
                        <button
                          type="button"
                          onClick={() => setSel(it.id)}
                          className={cx(
                            'block w-full truncate py-0.5 text-left',
                            sel === it.id ? 'text-accent' : 'text-text-muted hover:text-text',
                          )}
                        >
                          {it.id}.ts
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>

        <div className="h-fit rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs text-text-faint">
            <span>
              {resolved?.kind}/{sel}.ts
            </span>
            <button type="button" onClick={() => setSource((s) => !s)} className="text-text-muted hover:text-accent">
              {source ? 'formatted' : 'view source'}
            </button>
          </div>
          <div className="p-4">
            {!resolved ? (
              <div className="text-text-faint">select an entity</div>
            ) : source ? (
              <pre className="overflow-x-auto whitespace-pre-wrap text-text-muted">
                {`${resolved.kind}(${JSON.stringify(resolved.entity, null, 2)})`}
              </pre>
            ) : (
              <Formatted entity={resolved.entity as Record<string, unknown>} />
            )}
          </div>
        </div>
      </div>

      {packages.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-xl font-semibold text-text">monorepo</h2>
          <p className="mt-2 text-text-muted">
            {packages.length} workspace packages, introspected from the real{' '}
            <span className="text-text">package.json</span> files at build.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {packages.map((p) => (
              <div key={p.name} className="rounded border border-border bg-surface p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-text">{p.name}</span>
                  <span className="text-xs text-text-faint">{p.type}</span>
                </div>
                <div className="mt-1 text-xs text-text-faint">{p.dir}</div>
                {p.dependsOn.length > 0 && (
                  <div className="mt-2 text-xs text-text-muted">
                    → {p.dependsOn.map((d) => d.replace('@noahclark/', '')).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-text">schema</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {entityTypes.map((t) => (
            <div key={t.kind} className="rounded border border-border bg-surface p-3">
              <div className="text-text">
                {t.label}{' '}
                <span className={cx('text-xs', t.class === 'curatorial' ? 'text-thread-consciousness' : 'text-text-faint')}>
                  · {t.class}
                </span>
              </div>
              <div className="mt-1 text-xs text-text-muted">{t.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-xs text-text-muted">
          {relationships.map((r) => (
            <div key={r.verb}>
              {(Array.isArray(r.from) ? r.from.join('|') : r.from)} {r.verb} → {r.to}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function Formatted({ entity }: { entity: Record<string, unknown> }) {
  return (
    <dl className="space-y-2">
      {Object.entries(entity).map(([k, v]) => (
        <div key={k} className="grid grid-cols-[110px_1fr] gap-3">
          <dt className="text-text-faint">{k}</dt>
          <dd className="text-text-muted">
            {Array.isArray(v) ? v.join(', ') : typeof v === 'string' ? v : JSON.stringify(v)}
          </dd>
        </div>
      ))}
    </dl>
  )
}
