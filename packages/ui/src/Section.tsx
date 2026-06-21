import type { ReactNode } from 'react'
import { cx } from './cx'

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string
  eyebrow?: string
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cx('mx-auto w-full max-w-5xl px-6 py-20 md:py-28', className)}>
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      )}
      {title && (
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text md:text-4xl">
          {title}
        </h2>
      )}
      <div className={cx(eyebrow || title ? 'mt-10' : '')}>{children}</div>
    </section>
  )
}
