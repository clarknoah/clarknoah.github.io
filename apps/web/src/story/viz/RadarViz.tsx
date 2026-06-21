// Intelligence era: a recon radar sweep over concentric rings with blips.
const blips = [
  [32, 38],
  [62, 52],
  [44, 70],
  [70, 34],
  [26, 58],
]

export function RadarViz({ active }: { role: unknown; active: boolean }) {
  return (
    <div className="relative aspect-square w-full max-w-[420px]">
      {[1, 0.66, 0.33].map((s) => (
        <div
          key={s}
          className="absolute inset-0 m-auto rounded-full border border-border"
          style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
        />
      ))}
      <div className="absolute inset-0 m-auto h-px w-full bg-border" />
      <div className="absolute inset-0 m-auto h-full w-px bg-border" />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--color-accent) 28%, transparent) 50deg, transparent 70deg)',
          animation: active ? 'spin 3.5s linear infinite' : 'none',
        }}
      />
      {blips.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  )
}
