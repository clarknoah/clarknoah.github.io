import dagre from '@dagrejs/dagre'
import type { GraphElements } from '@noahclark/graph-engine'
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force'

export type LayoutKind = 'force' | 'hier-tb' | 'hier-lr' | 'circular' | 'grid'

export const LAYOUTS: { id: LayoutKind; label: string }[] = [
  { id: 'force', label: 'force' },
  { id: 'hier-tb', label: 'tree ↓' },
  { id: 'hier-lr', label: 'tree →' },
  { id: 'circular', label: 'circular' },
  { id: 'grid', label: 'grid' },
]

export type Positions = Map<string, { x: number; y: number }>

function forceLayout(els: GraphElements): Positions {
  const sim = els.nodes.map((n, i) => {
    const a = i * 2.39996
    const r = 8 * Math.sqrt(i)
    return { id: n.data.id, size: n.data.size, x: r * Math.cos(a), y: r * Math.sin(a) }
  })
  const links = els.edges.map((e) => ({ source: e.data.source, target: e.data.target }))
  const s = forceSimulation(sim as never)
    .force('charge', forceManyBody().strength(-130))
    // biome-ignore lint/suspicious/noExplicitAny: d3-force id accessor
    .force('link', forceLink(links as never).id((d: any) => d.id).distance(58).strength(0.7))
    .force('x', forceX(0).strength(0.08))
    .force('y', forceY(0).strength(0.08))
    // biome-ignore lint/suspicious/noExplicitAny: d3 node datum
    .force('collide', forceCollide().radius((d: any) => d.size / 2 + 12))
    .stop()
  for (let i = 0; i < 420; i++) s.tick()
  return new Map(sim.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]))
}

function dagreLayout(els: GraphElements, rankdir: 'TB' | 'LR'): Positions {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir, nodesep: 28, ranksep: 90, marginx: 20, marginy: 20 })
  g.setDefaultEdgeLabel(() => ({}))
  for (const n of els.nodes) g.setNode(n.data.id, { width: n.data.size + 44, height: n.data.size + 18 })
  for (const e of els.edges) g.setEdge(e.data.source, e.data.target)
  dagre.layout(g)
  const pos: Positions = new Map()
  for (const n of els.nodes) {
    const gn = g.node(n.data.id)
    if (gn) pos.set(n.data.id, { x: gn.x, y: gn.y })
  }
  return pos
}

function circularLayout(els: GraphElements): Positions {
  const n = els.nodes.length
  const radius = Math.max(220, n * 9)
  const pos: Positions = new Map()
  els.nodes.forEach((node, i) => {
    const a = (i / n) * Math.PI * 2
    pos.set(node.data.id, { x: radius * Math.cos(a), y: radius * Math.sin(a) })
  })
  return pos
}

function gridLayout(els: GraphElements): Positions {
  const cols = Math.ceil(Math.sqrt(els.nodes.length))
  const gap = 96
  const pos: Positions = new Map()
  els.nodes.forEach((node, i) => {
    pos.set(node.data.id, { x: (i % cols) * gap, y: Math.floor(i / cols) * gap })
  })
  return pos
}

export function computeLayout(kind: LayoutKind, els: GraphElements): Positions {
  switch (kind) {
    case 'hier-tb':
      return dagreLayout(els, 'TB')
    case 'hier-lr':
      return dagreLayout(els, 'LR')
    case 'circular':
      return circularLayout(els)
    case 'grid':
      return gridLayout(els)
    default:
      return forceLayout(els)
  }
}
