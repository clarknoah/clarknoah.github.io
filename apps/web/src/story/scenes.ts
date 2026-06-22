import { parseMonth } from '@noahclark/graph-engine'
import { dataset } from '../lib'

export type VizKind =
  | 'forge'
  | 'silos'
  | 'catalog'
  | 'brain'
  | 'globe'
  | 'tree'
  | 'growth'
  | 'thoughtstream'
  | 'swarm'

export interface Scene {
  roleId: string
  viz: VizKind
}

// One bespoke visualization per era (designed with Noah).
const vizByRole: Record<string, VizKind> = {
  'usaf-analyst': 'forge', // social engineering + document forging
  questor: 'silos', // ICITE: agency silos -> shared cloud
  'dia-architect': 'catalog', // Book of Apps: catalog -> dependency graph
  cmu: 'brain', // fMRI activation
  'thermopylae-geo': 'globe',
  'ga-instructor': 'tree', // curriculum tree
  nderf: 'brain',
  sei: 'growth',
  'iam-founder': 'thoughtstream', // live thought-stream graph
  quatt: 'swarm', // telemetry swarm -> Atlas graph
}

export const scenes: Scene[] = [...dataset.roles]
  .sort((a, b) => parseMonth(a.start) - parseMonth(b.start))
  .map((r) => ({ roleId: r.id, viz: vizByRole[r.id] ?? 'globe' }))
