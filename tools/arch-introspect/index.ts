/**
 * Walks the actual workspace and emits public/repo.json — the package dependency graph,
 * generated from the real package.json files. The repo view renders this, so the site's
 * architecture is described by the site itself and can never drift. Build prestep.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const repoRoot = join(import.meta.dir, '../..')
const out = join(repoRoot, 'public/repo.json')

interface Pkg {
  name: string
  dir: string
  type: 'app' | 'lib'
  dependsOn: string[]
}

function readGroup(group: string, type: Pkg['type']): Pkg[] {
  const base = join(repoRoot, group)
  if (!existsSync(base)) return []
  return readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const pjPath = join(base, d.name, 'package.json')
      if (!existsSync(pjPath)) return undefined
      const pj = JSON.parse(readFileSync(pjPath, 'utf8'))
      const deps = { ...(pj.dependencies ?? {}), ...(pj.peerDependencies ?? {}) }
      const dependsOn = Object.keys(deps).filter((n) => n.startsWith('@noahclark/'))
      return { name: pj.name as string, dir: `${group}/${d.name}`, type, dependsOn }
    })
    .filter((p): p is Pkg => p !== undefined)
}

const packages = [...readGroup('packages', 'lib'), ...readGroup('apps', 'app')]
writeFileSync(out, `${JSON.stringify({ packages }, null, 2)}\n`)
console.log(`arch-introspect: wrote ${packages.length} packages → ${out}`)
