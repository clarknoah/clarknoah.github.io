import { parseMonth } from '@noahclark/graph-engine'
import { dataset } from '../lib'

export type VizKind = 'radar' | 'graph' | 'signal' | 'globe' | 'growth' | 'swarm'

export interface Scene {
  roleId: string
  viz: VizKind
}

// One bespoke visualization per era. Some (graph) intentionally recur and grow.
const vizByRole: Record<string, VizKind> = {
  'usaf-analyst': 'radar',
  questor: 'radar',
  'dia-architect': 'graph',
  cmu: 'signal',
  'thermopylae-geo': 'globe',
  'ga-instructor': 'graph',
  nderf: 'signal',
  sei: 'growth',
  'iam-founder': 'graph',
  quatt: 'swarm',
}

export const scenes: Scene[] = [...dataset.roles]
  .sort((a, b) => parseMonth(a.start) - parseMonth(b.start))
  .map((r) => ({ roleId: r.id, viz: vizByRole[r.id] ?? 'globe' }))
