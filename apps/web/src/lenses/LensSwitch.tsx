import type { Lens } from '@noahclark/console'
import { cx } from '@noahclark/ui'
import { useStore } from '../store'

const ALL: { id: Lens; label: string }[] = [
  { id: 'graph', label: 'graph' },
  { id: 'timeline', label: 'timeline' },
  { id: 'capabilities', label: 'capabilities' },
]

export function LensSwitch({ available, current }: { available: Lens[]; current: Lens }) {
  const { dispatch } = useStore()
  return (
    <div className="inline-flex rounded-md border border-border bg-surface p-1 font-mono text-xs">
      {ALL.filter((l) => available.includes(l.id)).map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => dispatch({ type: 'setLens', lens: l.id })}
          className={cx('rounded px-3 py-1', current === l.id ? 'bg-surface-raised text-accent' : 'text-text-muted')}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
