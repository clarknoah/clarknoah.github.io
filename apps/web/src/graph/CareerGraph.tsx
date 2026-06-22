import { toElements } from '@noahclark/graph-engine'
import {
  BaseEdge,
  Background,
  Controls,
  type Edge,
  type EdgeProps,
  getStraightPath,
  Handle,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
  useInternalNode,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { cx } from '@noahclark/ui'
import { useEffect, useMemo, useState } from 'react'
import { dataset } from '../lib'
import { useStore } from '../store'
import { computeLayout, LAYOUTS, type LayoutKind } from './layouts'
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

// Floating edge: draws between node centres, so it looks right in every layout.
function FloatingEdge({ id, source, target, style }: EdgeProps) {
  const s = useInternalNode(source)
  const t = useInternalNode(target)
  if (!s || !t) return null
  const sx = s.internals.positionAbsolute.x + (s.measured.width ?? 0) / 2
  const sy = s.internals.positionAbsolute.y + (s.measured.height ?? 0) / 2
  const tx = t.internals.positionAbsolute.x + (t.measured.width ?? 0) / 2
  const ty = t.internals.positionAbsolute.y + (t.measured.height ?? 0) / 2
  const [path] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty })
  return <BaseEdge id={id} path={path} style={style} />
}

function EntityNode({ data, selected }: NodeProps<Node<NodeData>>) {
  const showLabel = data.kind !== 'skill'
  return (
    <div style={{ opacity: data.dimmed ? 0.1 : 1 }} className="relative flex flex-col items-center transition-opacity">
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <div
        title={data.label}
        style={{
          width: data.size,
          height: data.size,
          backgroundColor: `color-mix(in oklab, ${data.color} 24%, transparent)`,
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
const edgeTypes = { floating: FloatingEdge }

export function CareerGraph() {
  const { state, dispatch } = useStore()
  const mode = useThemeMode()
  const [layout, setLayout] = useState<LayoutKind>('force')
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const positions = useMemo(() => computeLayout(layout, els), [layout])

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
    [positions, active],
  )

  const edges: Edge[] = useMemo(
    () =>
      els.edges.map((e) => {
        const dim = active ? !(active.has(e.data.source) && active.has(e.data.target)) : false
        return {
          id: e.data.id,
          source: e.data.source,
          target: e.data.target,
          type: 'floating',
          style: { stroke: 'var(--color-border-strong)', strokeWidth: 1, opacity: dim ? 0.04 : 0.32 },
        }
      }),
    [active],
  )

  return (
    <div
      className={cx(
        'relative w-full overflow-hidden border border-border bg-surface',
        fullscreen ? 'fixed inset-0 z-[80] rounded-none' : 'h-[62vh] min-h-[420px] rounded-lg',
      )}
    >
      {/* control bar */}
      <div className="pointer-events-none absolute top-2 right-2 z-10 flex items-center gap-2">
        <div className="pointer-events-auto flex rounded-md border border-border bg-ink/85 p-0.5 font-mono text-[11px] backdrop-blur">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLayout(l.id)}
              className={cx('rounded px-2 py-1', layout === l.id ? 'bg-surface-raised text-accent' : 'text-text-muted hover:text-text')}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFullscreen((f) => !f)}
          className="pointer-events-auto rounded-md border border-border bg-ink/85 px-2 py-1.5 font-mono text-[11px] text-text-muted backdrop-blur hover:text-accent"
          title={fullscreen ? 'exit full screen (esc)' : 'full screen'}
        >
          {fullscreen ? '✕ exit' : '⤢ full'}
        </button>
      </div>

      <ReactFlow
        key={`${layout}-${fullscreen}`}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode={mode}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.1}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_e, n) => dispatch({ type: 'openEntity', id: n.id })}
        nodesDraggable={!fullscreen ? false : true}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <Background gap={22} size={1} color="var(--color-border)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
