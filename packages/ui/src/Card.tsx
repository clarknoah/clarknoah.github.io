import type { ReactNode } from 'react'
import { cx } from './cx'

export function Card({
  children,
  className,
  interactive,
  accent,
  onClick,
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
  accent?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={accent ? { borderTopColor: accent } : undefined}
      className={cx(
        'rounded-lg border border-border bg-surface p-5',
        accent && 'border-t-2',
        interactive && 'cursor-pointer transition-colors hover:border-border-strong hover:bg-surface-raised',
        className,
      )}
    >
      {children}
    </div>
  )
}
