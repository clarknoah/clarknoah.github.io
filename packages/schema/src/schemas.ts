/**
 * The career DSL. Each entity is a zod schema (single source for both the TypeScript
 * type and runtime validation) plus a constructor that validates at authoring time.
 *
 * Authoring an instance with a malformed shape fails the build (the constructor parses
 * on module load). Cross-entity referential integrity is checked separately — see
 * `validate.ts` — because it needs the whole dataset.
 */
import { z } from 'zod'

export const THREAD_IDS = ['graph', 'consciousness', 'intelligence', 'scale', 'ai-native'] as const
export const ROLE_KINDS = ['employment', 'military', 'founding', 'instruction', 'research'] as const
export const SKILL_CATEGORIES = ['lang', 'db', 'infra', 'frontend', 'data', 'ai', 'practice'] as const
export const SECTORS = ['defense', 'gov', 'academia', 'research', 'edtech', 'iot', 'own'] as const

const threadId = z.enum(THREAD_IDS)
const metric = z.object({
  label: z.string(),
  value: z.string(),
  context: z.string().optional(),
})

// --- factual entities (verifiable from the CV) ---

export const orgSchema = z.object({
  id: z.string(),
  name: z.string(),
  sector: z.enum(SECTORS),
  url: z.string().optional(),
})

export const roleSchema = z.object({
  id: z.string(),
  kind: z.enum(ROLE_KINDS), // polymorphic discriminant; drives visual-style
  org: z.string(),
  title: z.string(),
  start: z.string(), // 'YYYY-MM'
  end: z.string(), // 'YYYY-MM' | 'present'
  location: z.string().optional(),
  summary: z.string(),
  highlights: z.array(z.string()).default([]),
  metrics: z.array(metric).default([]),
  threads: z.array(threadId).default([]),
  projects: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
})

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  summary: z.string(),
  url: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  threads: z.array(threadId).default([]),
  skills: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).default([]),
})

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(SKILL_CATEGORIES),
})

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  credential: z.string(),
  field: z.string().optional(),
  honors: z.string().optional(),
  start: z.string(),
  end: z.string(),
})

// --- curatorial entities (interpretation layered on facts; each carries receipts) ---

export const capabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  blurb: z.string(),
  threads: z.array(threadId).default([]),
  evidence: z.array(z.string()).default([]), // role/project ids
})

export const threadSchema = z.object({
  id: threadId,
  label: z.string(),
  blurb: z.string(),
  evidence: z.array(z.string()).default([]), // role/project ids (color lives in @noahclark/theme)
})

// --- inferred types (zod is the single source) ---

export type EntityKind =
  | 'org'
  | 'role'
  | 'project'
  | 'skill'
  | 'education'
  | 'capability'
  | 'thread'

export type ThreadId = (typeof THREAD_IDS)[number]
export type RoleKind = (typeof ROLE_KINDS)[number]
export type SkillCategory = (typeof SKILL_CATEGORIES)[number]
export type Sector = (typeof SECTORS)[number]

export type Org = z.infer<typeof orgSchema>
export type Role = z.infer<typeof roleSchema>
export type Project = z.infer<typeof projectSchema>
export type Skill = z.infer<typeof skillSchema>
export type Education = z.infer<typeof educationSchema>
export type Capability = z.infer<typeof capabilitySchema>
export type Thread = z.infer<typeof threadSchema>
export type Metric = z.infer<typeof metric>

// --- constructors: validate on author, return the typed entity ---

export const org = (i: z.input<typeof orgSchema>): Org => orgSchema.parse(i)
export const role = (i: z.input<typeof roleSchema>): Role => roleSchema.parse(i)
export const project = (i: z.input<typeof projectSchema>): Project => projectSchema.parse(i)
export const skill = (i: z.input<typeof skillSchema>): Skill => skillSchema.parse(i)
export const education = (i: z.input<typeof educationSchema>): Education => educationSchema.parse(i)
export const capability = (i: z.input<typeof capabilitySchema>): Capability => capabilitySchema.parse(i)
export const thread = (i: z.input<typeof threadSchema>): Thread => threadSchema.parse(i)
