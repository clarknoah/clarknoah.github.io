/**
 * Referential-integrity gate. Fails the build if any edge points at a missing id or an
 * id is duplicated. Run: `bun run tools/validate/index.ts`.
 */
import { dataset } from '../../packages/architecture/src/index'
import { validateDataset } from '../../packages/schema/src/index'

const errors = validateDataset(dataset)

if (errors.length > 0) {
  console.error(`✗ ${errors.length} referential error(s):\n`)
  for (const e of errors) {
    console.error(`  ${e.entity}#${e.id} → ${e.field}: "${e.missing}"`)
  }
  process.exit(1)
}

const counts = {
  orgs: dataset.orgs.length,
  roles: dataset.roles.length,
  projects: dataset.projects.length,
  skills: dataset.skills.length,
  education: dataset.education.length,
  capabilities: dataset.capabilities.length,
  threads: dataset.threads.length,
}
const total = Object.values(counts).reduce((a, b) => a + b, 0)
console.log(`✓ dataset valid — ${total} entities`, counts)
