/**
 * Cross-entity referential integrity. Per-entity shape is already guaranteed by the
 * zod constructors; this catches the thing types can't: an edge pointing at an id that
 * doesn't exist. Run by `tools/validate` — a dangling reference fails the build.
 */
import type { Dataset } from './dataset'

export interface RefError {
  entity: string
  id: string
  field: string
  missing: string
}

export function validateDataset(d: Dataset): RefError[] {
  const errors: RefError[] = []
  const orgIds = new Set(d.orgs.map((o) => o.id))
  const roleIds = new Set(d.roles.map((r) => r.id))
  const projectIds = new Set(d.projects.map((p) => p.id))
  const skillIds = new Set(d.skills.map((s) => s.id))
  const capabilityIds = new Set(d.capabilities.map((c) => c.id))
  const threadIds = new Set(d.threads.map((t) => t.id))
  const evidenceIds = new Set([...roleIds, ...projectIds]) // roles + projects can be evidence

  const check = (
    entity: string,
    id: string,
    field: string,
    refs: string[],
    pool: Set<string>,
  ) => {
    for (const ref of refs) {
      if (!pool.has(ref)) errors.push({ entity, id, field, missing: ref })
    }
  }

  for (const r of d.roles) {
    check('role', r.id, 'org', [r.org], orgIds)
    check('role', r.id, 'projects', r.projects, projectIds)
    check('role', r.id, 'skills', r.skills, skillIds)
    check('role', r.id, 'threads', r.threads, threadIds)
  }
  for (const p of d.projects) {
    if (p.role) check('project', p.id, 'role', [p.role], roleIds)
    check('project', p.id, 'skills', p.skills, skillIds)
    check('project', p.id, 'threads', p.threads, threadIds)
    check('project', p.id, 'capabilities', p.capabilities, capabilityIds)
  }
  for (const c of d.capabilities) {
    check('capability', c.id, 'threads', c.threads, threadIds)
    check('capability', c.id, 'evidence', c.evidence, evidenceIds)
  }
  for (const t of d.threads) {
    check('thread', t.id, 'evidence', t.evidence, evidenceIds)
  }

  // Duplicate-id guard within each type.
  const dupCheck = (entity: string, items: { id: string }[]) => {
    const seen = new Set<string>()
    for (const it of items) {
      if (seen.has(it.id)) errors.push({ entity, id: it.id, field: 'id', missing: 'duplicate' })
      seen.add(it.id)
    }
  }
  dupCheck('org', d.orgs)
  dupCheck('role', d.roles)
  dupCheck('project', d.projects)
  dupCheck('skill', d.skills)
  dupCheck('capability', d.capabilities)
  dupCheck('thread', d.threads)

  return errors
}
