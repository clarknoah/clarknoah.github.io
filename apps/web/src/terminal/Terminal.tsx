import { commandNames, type Intent, type Line, run } from '@noahclark/console'
import { cx } from '@noahclark/ui'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { index, profile } from '../lib'
import { useStore } from '../store'

const ctx = { index, profile }
const intro: Line[] = [{ text: `noah@${profile.domain} · type 'help'`, tone: 'muted' }]

const toneClass = (t?: Line['tone']) =>
  t === 'accent' ? 'text-accent' : t === 'error' ? 'text-danger' : t === 'muted' ? 'text-text-faint' : 'text-text-muted'

export function Terminal() {
  const { dispatch } = useStore()
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>(intro)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === '`' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new lines/open
  useEffect(() => {
    endRef.current?.scrollIntoView()
  }, [lines, open])

  const submit = () => {
    const cmd = input.trim()
    if (!cmd) return
    const res = run(cmd, ctx)
    for (const it of res.intents as Intent[]) {
      if (it.type === 'clear') {
        setLines(intro)
        setInput('')
        return
      }
      dispatch(it)
    }
    setLines((prev) => [...prev, { text: `› ${cmd}`, tone: 'accent' }, ...res.output])
    setHistory((h) => [cmd, ...h])
    setHIdx(-1)
    setInput('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const i = Math.min(hIdx + 1, history.length - 1)
      if (history[i] !== undefined) {
        setHIdx(i)
        setInput(history[i] ?? '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = Math.max(hIdx - 1, -1)
      setHIdx(i)
      setInput(i === -1 ? '' : (history[i] ?? ''))
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const m = commandNames.find((n) => n.startsWith(input))
      if (m) setInput(`${m} `)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-50 rounded-full border border-border bg-surface px-3 py-2 font-mono text-xs text-text-muted hover:text-accent"
      >
        › terminal
      </button>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 h-72 border-t border-border-strong bg-ink/95 font-mono text-sm backdrop-blur">
      <div className="mx-auto flex h-full max-w-4xl flex-col px-4 py-3">
        <div className="mb-2 flex items-center justify-between text-xs text-text-faint">
          <span>terminal</span>
          <button type="button" onClick={() => setOpen(false)} className="hover:text-text">
            esc ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          {lines.map((l, i) => (
            <div key={`${i}-${l.text}`} className={cx('whitespace-pre-wrap', toneClass(l.tone))}>
              {l.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="mt-2 flex items-center gap-2 border-t border-border pt-2">
          <span className="text-accent">›</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            placeholder="help"
            className="flex-1 bg-transparent text-text placeholder:text-text-faint focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
