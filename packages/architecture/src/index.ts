import type { Dataset } from '@noahclark/schema'
import { capabilities } from './capabilities'
import { educationList } from './education'
import { orgs } from './orgs'
import { projects } from './projects'
import { roles } from './roles'
import { skills } from './skills'
import { threads } from './threads'

/** The complete career dataset. Validated for referential integrity by tools/validate. */
export const dataset: Dataset = {
  orgs,
  roles,
  projects,
  skills,
  education: educationList,
  capabilities,
  threads,
}

export { orgs, roles, projects, skills, educationList, capabilities, threads }
export { profile } from './profile'
export type { Profile } from './profile'
export { services } from './services'
export type { Service, ServiceId } from './services'
