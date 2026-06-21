/**
 * Per-entity-type visual style — the single source for how each node renders in the
 * career graph. Cytoscape reads these values directly; the schema owns them so the
 * model and its appearance never drift apart.
 */
import { tokens } from '@noahclark/theme'
import type { EntityKind, ThreadId } from './schemas'

export type NodeShape =
  | 'ellipse'
  | 'round-rectangle'
  | 'hexagon'
  | 'diamond'
  | 'round-tag'
  | 'octagon'

export interface NodeStyle {
  shape: NodeShape
  color: string
  /** Base diameter in px (graph layout scales from here). */
  size: number
}

export const entityStyle: Record<EntityKind, NodeStyle> = {
  org: { shape: 'round-rectangle', color: tokens.color.textMuted, size: 46 },
  role: { shape: 'ellipse', color: tokens.color.accent, size: 54 },
  project: { shape: 'hexagon', color: tokens.color.text, size: 42 },
  skill: { shape: 'round-tag', color: tokens.color.textFaint, size: 26 },
  education: { shape: 'diamond', color: tokens.color.textMuted, size: 38 },
  capability: { shape: 'octagon', color: tokens.color.accentDim, size: 40 },
  thread: { shape: 'ellipse', color: tokens.color.text, size: 60 },
}

/** Thread hues, keyed by ThreadId — sourced from theme so colors live in one place. */
export const threadColor: Record<ThreadId, string> = tokens.thread
