import { toElements } from '@noahclark/graph-engine'
import {
  Background,
  Controls,
  type Edge,
  Handle,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force'
import { useMemo } from 'react'
import { dataset } from '../lib'
import { useStore } from '../store'
import { useThemeMode } from './useThemeMode'

type NodeData = {
  label: string
  kind: string
  color: string
  size: number
  threads: string[]
  dimmed: boolean
}

const els = toElements(dataset)

// Static d3-force layout, computed once. No animation frames => no remount races.
const positions = (() => {
  const sim = els.nodes.map((n, i) => {
    const a = i * 2.39996 // golden angle, deterministic seed
    const r = 8 * Math.sqrt(i)
    return { id: n.data.id, size: n.data.size, x: r * Math.cos(a), y: r * Math.sin(a) }
  })
  const links = els.edges.map((e) => ({ source: e.data.source, target: e.data.target }))
  const s = forceSimulation(sim as never)
    .force('charge', forceManyBody().strength(-130))
    // biome-ignore lint/suspicious/noExplicitAny: d3-force generic id accessor
    .force('link', forceLink(links as never).id((d: any) => d.id).distance(58).strength(0.7))
    // pull toward centre so the graph stays cohesive (no flung outliers)
    .force('x', forceX(0).strength(0.08))
    .force('y', forceY(0).strength(0.08))
    // biome-ignore lint/suspicious/noExplicitAny: d3 node datum
    .force('collide', forceCollide().radius((d: any) => d.size / 2 + 12))
    .stop()
  for (let i = 0; i < 420; i++) s.tick()
  return new Map(sim.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]))
})()

function EntityNode({ data, selected }: NodeProps<Node<NodeData>>) {
  const showLabel = data.kind !== 'skill'
  return (
    <div style={{ opacity: data.dimmed ? 0.12 : 1 }} className="relative flex flex-col items-center transition-opacity">
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <div
        title={data.label}
        style={{
          width: data.size,
          height: data.size,
          backgroundColor: `color-mix(in oklab, ${data.color} 22%, transparent)`,
          borderColor: data.color,
          boxShadow: selected ? `0 0 0 2px ${data.color}` : undefined,
        }}
        className="rounded-full border"
      />
      {showLabel && (
        <span className="pointer-events-none mt-1 max-w-[120px] truncate font-mono text-[9px] text-text-muted">
          {data.label}
        </span>
      )}
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  )
}

const nodeTypes = { entity: EntityNode }

export function CareerGraph() {
  const { state, dispatch } = useStore()
  const mode = useThemeMode()

  const active = useMemo(() => {
    if (state.highlightThread) {
      const t = state.highlightThread
      const ids = new Set<string>([t])
      for (const n of els.nodes) if ((n.data.threads as string[]).includes(t)) ids.add(n.data.id)
      return ids
    }
    if (state.highlightSkill) {
      const ids = new Set<string>([state.highlightSkill])
      for (const e of els.edges) {
        if (e.data.source === state.highlightSkill) ids.add(e.data.target)
        if (e.data.target === state.highlightSkill) ids.add(e.data.source)
      }
      return ids
    }
    return null
  }, [state.highlightThread, state.highlightSkill])

  const nodes: Node<NodeData>[] = useMemo(
    () =>
      els.nodes.map((n) => ({
        id: n.data.id,
        type: 'entity',
        position: positions.get(n.data.id) ?? { x: 0, y: 0 },
        data: {
          label: n.data.label,
          kind: n.data.kind,
          color: n.data.color,
          size: n.data.size,
          threads: n.data.threads,
          dimmed: active ? !active.has(n.data.id) : false,
        },
      })),
    [active],
  )

  const edges: Edge[] = useMemo(
    () =>
      els.edges.map((e) => {
        const dim = active ? !(active.has(e.data.source) && active.has(e.data.target)) : false
        return {
          id: e.data.id,
          source: e.data.source,
          target: e.data.target,
          style: { stroke: 'var(--color-border-strong)', strokeWidth: 1, opacity: dim ? 0.04 : 0.35 },
        }
      }),
    [active],
  )

  return (
    <div className="h-[62vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        colorMode={mode}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_e, n) => dispatch({ type: 'openEntity', id: n.id })}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <Background gap={22} size={1} color="var(--color-border)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
