import type {
  Capability,
  Dataset,
  EntityKind,
  Project,
  Role,
  Skill,
  Thread,
  ThreadId,
} from '@noahclark/schema'

export type AnyEntity = Role | Project | Skill | Capability | Thread | Dataset['orgs'][number] | Dataset['education'][number]

export interface ResolvedEntity {
  kind: EntityKind
  id: string
  label: string
  entity: AnyEntity
}

/** Derived lookups over the dataset. Pure — the UI and the terminal both call these. */
export class CareerIndex {
  constructor(private readonly d: Dataset) {}

  get dataset(): Dataset {
    return this.d
  }

  /** Resolve any entity id to a typed, labelled record. */
  entity(id: string): ResolvedEntity | undefined {
    const find = <T extends { id: string }>(kind: EntityKind, items: T[], label: (t: T) => string) => {
      const e = items.find((i) => i.id === id)
      return e ? { kind, id, label: label(e), entity: e as unknown as AnyEntity } : undefined
    }
    return (
      find('role', this.d.roles, (r) => r.title) ??
      find('project', this.d.projects, (p) => p.name) ??
      find('skill', this.d.skills, (s) => s.name) ??
      find('org', this.d.orgs, (o) => o.name) ??
      find('capability', this.d.capabilities, (c) => c.name) ??
      find('thread', this.d.threads, (t) => t.label) ??
      find('education', this.d.education, (e) => e.credential)
    )
  }

  skill(id: string): Skill | undefined {
    return this.d.skills.find((s) => s.id === id)
  }

  thread(id: string): Thread | undefined {
    return this.d.threads.find((t) => t.id === id)
  }

  /** Roles + projects that use a given skill — the "Neo4j across 13 years" query. */
  usingSkill(skillId: string): { roles: Role[]; projects: Project[] } {
    return {
      roles: this.d.roles.filter((r) => r.skills.includes(skillId)),
      projects: this.d.projects.filter((p) => p.skills.includes(skillId)),
    }
  }

  /** Everything tagged with a thread. */
  inThread(threadId: ThreadId): { roles: Role[]; projects: Project[]; capabilities: Capability[] } {
    return {
      roles: this.d.roles.filter((r) => r.threads.includes(threadId)),
      projects: this.d.projects.filter((p) => p.threads.includes(threadId)),
      capabilities: this.d.capabilities.filter((c) => c.threads.includes(threadId)),
    }
  }

  /** The roles/projects backing a curatorial claim. */
  evidenceFor(ids: string[]): ResolvedEntity[] {
    return ids.map((id) => this.entity(id)).filter((e): e is ResolvedEntity => e !== undefined)
  }
}

export function buildIndex(d: Dataset): CareerIndex {
  return new CareerIndex(d)
}
