import { type Dataset, entityStyle, type ThreadId } from '@noahclark/schema'
import { parseMonth } from './timeline'

export interface GraphNodeData {
  id: string
  label: string
  kind: string
  threads: ThreadId[]
  shape: string
  color: string
  size: number
  /** sortable month, for timeline-anchored layout (roles/projects only) */
  t?: number
}
export interface GraphEdgeData {
  id: string
  source: string
  target: string
  verb: string
}
export interface GraphElements {
  nodes: { data: GraphNodeData }[]
  edges: { data: GraphEdgeData }[]
}

/**
 * Project the dataset into Cytoscape elements. Core graph = roles, projects, skills,
 * threads, orgs and the edges between them. Capabilities live in their own section.
 */
export function toElements(d: Dataset): GraphElements {
  const nodes: { data: GraphNodeData }[] = []
  const edges: { data: GraphEdgeData }[] = []
  const node = (data: GraphNodeData) => nodes.push({ data })
  const edge = (id: string, source: string, target: string, verb: string) =>
    edges.push({ data: { id, source, target, verb } })

  const style = (kind: keyof typeof entityStyle) => entityStyle[kind]

  for (const t of d.threads) {
    const s = style('thread')
    node({ id: t.id, label: t.label, kind: 'thread', threads: [t.id], shape: s.shape, color: s.color, size: s.size })
  }
  for (const o of d.orgs) {
    const s = style('org')
    node({ id: o.id, label: o.name, kind: 'org', threads: [], shape: s.shape, color: s.color, size: s.size })
  }
  for (const sk of d.skills) {
    const s = style('skill')
    node({ id: sk.id, label: sk.name, kind: 'skill', threads: [], shape: s.shape, color: s.color, size: s.size })
  }
  for (const r of d.roles) {
    const s = style('role')
    node({ id: r.id, label: r.title, kind: 'role', threads: r.threads, shape: s.shape, color: s.color, size: s.size, t: parseMonth(r.start) })
    edge(`${r.id}~at~${r.org}`, r.id, r.org, 'AT')
    for (const p of r.projects) edge(`${r.id}~made~${p}`, r.id, p, 'PRODUCED')
    for (const sk of r.skills) edge(`${r.id}~uses~${sk}`, r.id, sk, 'USES')
    for (const th of r.threads) edge(`${r.id}~in~${th}`, r.id, th, 'IN')
  }
  for (const p of d.projects) {
    const s = style('project')
    node({ id: p.id, label: p.name, kind: 'project', threads: p.threads, shape: s.shape, color: s.color, size: s.size })
    for (const sk of p.skills) edge(`${p.id}~uses~${sk}`, p.id, sk, 'USES')
    for (const th of p.threads) edge(`${p.id}~in~${th}`, p.id, th, 'IN')
  }

  return { nodes, edges }
}
