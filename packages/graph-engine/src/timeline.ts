import type { Role } from '@noahclark/schema'

/** Parse 'YYYY-MM' (or 'present') to a sortable month-number. */
export function parseMonth(value: string): number {
  if (value === 'present') {
    const now = new Date()
    return now.getFullYear() * 12 + now.getMonth()
  }
  const [y, m] = value.split('-').map((n) => Number.parseInt(n, 10))
  return (y ?? 0) * 12 + ((m ?? 1) - 1)
}

export function yearOf(value: string): number {
  if (value === 'present') return new Date().getFullYear()
  return Number.parseInt(value.split('-')[0] ?? '0', 10)
}

/** Roles newest-first (for the timeline). */
export function rolesChronological(roles: Role[]): Role[] {
  return [...roles].sort((a, b) => parseMonth(b.start) - parseMonth(a.start))
}

/** Inclusive [startYear, endYear] across all roles. */
export function careerSpan(roles: Role[]): [number, number] {
  const years = roles.flatMap((r) => [yearOf(r.start), yearOf(r.end)])
  return [Math.min(...years), Math.max(...years)]
}
