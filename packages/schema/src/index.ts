// entities: schemas, inferred types, validating constructors
export {
  org,
  role,
  project,
  skill,
  education,
  capability,
  thread,
  orgSchema,
  roleSchema,
  projectSchema,
  skillSchema,
  educationSchema,
  capabilitySchema,
  threadSchema,
  THREAD_IDS,
  ROLE_KINDS,
  SKILL_CATEGORIES,
  SECTORS,
  PROJECT_KINDS,
} from './schemas'
export type {
  Org,
  Role,
  Project,
  Skill,
  Education,
  Capability,
  Thread,
  Metric,
  Location,
  EntityKind,
  ThreadId,
  RoleKind,
  SkillCategory,
  Sector,
  ProjectKind,
} from './schemas'

export type { Dataset } from './dataset'

// model-as-data (for the Architecture view)
export { entityTypes, relationships } from './registry'
export type { EntityTypeDef, RelationshipDef, EntityClass } from './registry'

// visual style (for the graph)
export { entityStyle, threadColor } from './visual-style'
export type { NodeStyle, NodeShape } from './visual-style'

// referential integrity
export { validateDataset } from './validate'
export type { RefError } from './validate'
