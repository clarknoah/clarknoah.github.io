import { cx } from '@noahclark/ui'
import { useEffect, useState } from 'react'

export type ThemePref = 'light' | 'dark' | 'system'
const KEY = 'theme'

const systemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const resolve = (p: ThemePref): 'light' | 'dark' => (p === 'system' ? systemTheme() : p)

function apply(p: ThemePref) {
  document.documentElement.dataset.theme = resolve(p)
}

export function getPref(): ThemePref {
  const v = localStorage.getItem(KEY)
  return v === 'dark' || v === 'system' ? v : 'light'
}

/** Apply stored preference + keep 'system' in sync with OS changes. Call once at boot. */
export function initTheme() {
  apply(getPref())
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (getPref() === 'system') apply('system')
    })
}

const OPTIONS: { id: ThemePref; label: string }[] = [
  { id: 'light', label: 'light' },
  { id: 'dark', label: 'dark' },
  { id: 'system', label: 'auto' },
]

export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePref>(() => getPref())
  useEffect(() => {
    localStorage.setItem(KEY, pref)
    apply(pref)
  }, [pref])

  return (
    <div className="inline-flex rounded-full border border-border p-0.5 font-mono text-[11px]" role="group" aria-label="theme">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setPref(o.id)}
          aria-pressed={pref === o.id}
          className={cx('rounded-full px-1.5 py-0.5', pref === o.id ? 'bg-surface-raised text-accent' : 'text-text-faint hover:text-text-muted')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
