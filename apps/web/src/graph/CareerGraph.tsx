import { toElements } from '@noahclark/graph-engine'
import { tokens } from '@noahclark/theme'
import cytoscape from 'cytoscape'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { dataset } from '../lib'
import { useStore } from '../store'

const els = toElements(dataset)
const elements = [...els.nodes, ...els.edges]

// ponytail: @types/cytoscape is strict about data() refs and layout fns; cast styles/layout.
const style = [
  {
    selector: 'node',
    style: {
      'background-color': 'data(color)',
      shape: 'data(shape)',
      width: 'data(size)',
      height: 'data(size)',
      label: 'data(label)',
      color: tokens.color.textMuted,
      'font-size': 8,
      'font-family': tokens.font.mono,
      'text-valign': 'bottom',
      'text-margin-y': 3,
      'min-zoomed-font-size': 7,
    },
  },
  {
    selector: 'edge',
    style: { 'line-color': tokens.color.border, width: 1, 'curve-style': 'bezier', opacity: 0.35 },
  },
  { selector: '.dim', style: { opacity: 0.08 } },
  {
    selector: '.hot',
    style: { 'border-width': 3, 'border-color': tokens.color.accent, color: tokens.color.text },
  },
  // biome-ignore lint/suspicious/noExplicitAny: cytoscape stylesheet typing
] as any

export function CareerGraph() {
  const ref = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const { state, dispatch } = useStore()

  useEffect(() => {
    if (!ref.current) return
    const cy = cytoscape({
      container: ref.current,
      elements,
      style,
      minZoom: 0.25,
      maxZoom: 2.5,
      // animate:false — avoids a StrictMode double-mount race where a queued cose
      // animation frame fires after the throwaway instance is destroyed.
      // biome-ignore lint/suspicious/noExplicitAny: cose layout option typing
      layout: { name: 'cose', animate: false, padding: 30, idealEdgeLength: () => 90, nodeRepulsion: () => 14000 } as any,
    })
    cy.on('tap', 'node', (e) => dispatch({ type: 'openEntity', id: e.target.id() }))
    cy.fit(undefined, 36)
    cyRef.current = cy
    return () => {
      cy.stop()
      cy.destroy()
      cyRef.current = null
    }
  }, [dispatch])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.elements().removeClass('dim hot')
    if (state.highlightThread) {
      const t = state.highlightThread
      const keep = cy.nodes().filter((n) => n.id() === t || (n.data('threads') as string[]).includes(t))
      const scope = keep.union(keep.connectedEdges())
      cy.elements().not(scope).addClass('dim')
      cy.getElementById(t).addClass('hot')
    } else if (state.highlightSkill) {
      const node = cy.getElementById(state.highlightSkill)
      const hood = node.closedNeighborhood()
      cy.elements().not(hood).addClass('dim')
      node.addClass('hot')
    }
  }, [state.highlightThread, state.highlightSkill])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-[62vh] min-h-[420px] w-full rounded-lg border border-border bg-surface"
    />
  )
}
