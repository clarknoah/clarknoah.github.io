import { cx } from '@noahclark/ui'
import { profile } from '../lib'
import { useStore } from '../store'
import { ThemeToggle } from '../theme'

export function Nav() {
  const { state, dispatch } = useStore()
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 md:px-6">
        <button
          type="button"
          onClick={() => dispatch({ type: 'setView', view: 'portfolio' })}
          className="whitespace-nowrap font-display text-sm font-semibold text-text"
        >
          {profile.name}
          <span className="hidden text-text-faint sm:inline"> · {profile.title}</span>
        </button>
        <nav className="flex items-center gap-0.5 font-mono text-xs md:gap-1">
          <button
            type="button"
            onClick={() => dispatch({ type: 'setView', view: 'portfolio' })}
            className={cx('rounded px-1.5 py-1 md:px-2', state.view === 'portfolio' ? 'text-accent' : 'text-text-muted')}
          >
            portfolio
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'setView', view: 'story' })}
            className={cx('rounded px-1.5 py-1 md:px-2', state.view === 'story' ? 'text-accent' : 'text-text-muted')}
          >
            story
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'setView', view: 'repo' })}
            className={cx('rounded px-1.5 py-1 md:px-2', state.view === 'repo' ? 'text-accent' : 'text-text-muted')}
          >
            repo
          </button>
          <span className="mx-3 hidden text-text-faint lg:inline">
            press <kbd className="rounded border border-border px-1">`</kbd> for terminal
          </span>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
