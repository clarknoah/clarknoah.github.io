export function Stat({ value, label, context }: { value: string; label: string; context?: string }) {
  return (
    <div className="border-l border-border-strong pl-4">
      <div className="font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-sm text-text-muted">{label}</div>
      {context && <div className="mt-0.5 font-mono text-xs text-text-faint">{context}</div>}
    </div>
  )
}
