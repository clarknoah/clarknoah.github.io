import { dataset, profile, services } from '@noahclark/architecture'
import { buildIndex } from '@noahclark/graph-engine'
import type { ThreadId } from '@noahclark/schema'
import { tokens } from '@noahclark/theme'

export const index = buildIndex(dataset)
export { dataset, profile, services }

export const threadColor = tokens.thread as Record<ThreadId, string>
