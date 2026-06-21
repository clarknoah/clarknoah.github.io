/**
 * The model, described as data — so the site's "Architecture" view can render the
 * schema that generates it. Entity types are split factual vs curatorial; relationships
 * describe the legal edges between them.
 */
import type { EntityKind } from './schemas'

export type EntityClass = 'factual' | 'curatorial'

export interface EntityTypeDef {
  kind: EntityKind
  label: string
  class: EntityClass
  description: string
}

export const entityTypes: EntityTypeDef[] = [
  { kind: 'org', label: 'Organization', class: 'factual', description: 'An employer, school, client, or venture.' },
  { kind: 'role', label: 'Role', class: 'factual', description: 'A time-bounded engagement. Polymorphic by kind: employment, military, founding, instruction, research.' },
  { kind: 'project', label: 'Project', class: 'factual', description: 'A discrete thing built. Often produced during a role; some outlive it.' },
  { kind: 'skill', label: 'Skill', class: 'factual', description: 'A technology or practice, categorized.' },
  { kind: 'education', label: 'Education', class: 'factual', description: 'A degree, credential, or course.' },
  { kind: 'capability', label: 'Capability', class: 'curatorial', description: 'A present-tense competency. Interpretation backed by evidence.' },
  { kind: 'thread', label: 'Thread', class: 'curatorial', description: 'A theme recurring across the career. Interpretation backed by evidence.' },
]

export interface RelationshipDef {
  from: EntityKind | EntityKind[]
  verb: string
  to: EntityKind
  description: string
}

export const relationships: RelationshipDef[] = [
  { from: 'role', verb: 'AT', to: 'org', description: 'A role is held at an organization.' },
  { from: 'role', verb: 'PRODUCED', to: 'project', description: 'A role produced a project.' },
  { from: ['role', 'project'], verb: 'USES', to: 'skill', description: 'Uses a skill.' },
  { from: ['role', 'project'], verb: 'EXHIBITS', to: 'capability', description: 'Demonstrates a capability.' },
  { from: ['role', 'project'], verb: 'IN', to: 'thread', description: 'Belongs to a narrative thread.' },
]
