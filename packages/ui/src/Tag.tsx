import { cx } from './cx'

export function Tag({
  children,
  color,
  onClick,
  active,
}: {
  children: string
  color?: string
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      style={color ? { color, borderColor: color } : undefined}
      className={cx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs',
        !color && 'border-border text-text-muted',
        onClick && 'cursor-pointer transition-opacity hover:opacity-80',
        active && 'bg-surface-raised',
        !onClick && 'cursor-default',
      )}
    >
      {children}
    </button>
  )
}
