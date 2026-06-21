import type { Capability, Education, Org, Project, Role, Skill, Thread } from './schemas'

/** The complete career dataset — one bundle the graph-engine and validators operate on. */
export interface Dataset {
  orgs: Org[]
  roles: Role[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  capabilities: Capability[]
  threads: Thread[]
}
