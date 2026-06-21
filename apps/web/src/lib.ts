import { dataset, profile } from '@noahclark/architecture'
import { buildIndex } from '@noahclark/graph-engine'
import type { ThreadId } from '@noahclark/schema'
import { tokens } from '@noahclark/theme'

export const index = buildIndex(dataset)
export { dataset, profile }

export const threadColor = tokens.thread as Record<ThreadId, string>
