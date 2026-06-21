# noahclark.ing — Architecture

> A portfolio that is an *instance* of the thing it's selling: architecture-as-data,
> applied to one career. The site reads a validated, typed knowledge graph of Noah
> Clark's work and projects it four ways — timeline, capabilities, graph, and the
> schema itself. You can drive it by clicking, or by typing into an in-page terminal.

## The core idea

Most portfolios *describe* engineering skill. This one *demonstrates* it: the career
is modelled as a typed, compile-time-enforced knowledge graph (schema + instances),
validated at build, and rendered by the same machinery that defines it. The medium is
the proof.

Inspiration: the Atlas pattern (typed entities → registry → validators → visual-style →
projections), scaled *proportionally* to a single static site.

## Stack

- **Bun** — package manager + runtime.
- **Nx** — monorepo orchestration (chosen deliberately; see "Why Nx here").
- **TypeScript**, strict, everywhere.
- **React + Vite** — the web runtime (no Next; static output only).
- **Tailwind v4** — styling, CSS-first theme.
- **Motion** (Framer Motion) — animation. Lazy-loaded.
- **Cytoscape.js** — the graph. Lazy-loaded.
- **zod** — runtime validation of the entity model.

No backend. No router. No state library. Static build → Cloudflare Pages.

### Why Nx here

Nx is overkill for a 5-package static site, and that's acknowledged. It's used because
the repo is itself a portfolio artifact and consistency with the production monorepo
pattern is a goal. The judgement signal is proportional scope *inside* Nx: only the
layers with real content are instantiated — no empty `workers/`/`repository/` folders.

## Monorepo layout

```
noahclark.ing/
├── nx.json, package.json (bun workspaces), tsconfig.base.json, biome.json, bunfig.toml
├── apps/
│   └── web/           # Nx React+Vite app: composes packages → dist → Cloudflare Pages
├── packages/
│   ├── schema/        # the DSL: entity/edge types, builders, validators, visual-style, registry
│   ├── architecture/  # the INSTANCES: Noah's career, authored via schema builders (own package boundary)
│   │   └── src/{orgs,roles,projects,skills,education,capabilities,threads}/
│   ├── graph-engine/  # derive + traverse + layout from instances (framework-agnostic, tested)
│   ├── console/       # in-browser CLI: command registry → intents (pure, testable, UI-agnostic)
│   ├── ui/            # reusable React primitives (Section, Card, Tag, Stat, ThreadChip, Terminal)
│   └── theme/         # global design tokens + motion presets
├── tools/             # build scripts: validate (referential integrity), arch-introspect
└── public/            # resume.pdf, active-inference/, images (preserved sub-pages)
```

Package scope: `@noahclark/*` (trivially renamable).

> **`architecture` is a package, not a top-level folder** (a deliberate correction of
> the Atlas layout, where data living outside the package system caused pathing and
> tooling friction). It gets a real export boundary and is imported like any other lib.

## Schema / instance split (the load-bearing decision)

- **`packages/schema`** defines *what an entity is*. Builders (`defineEntityType`,
  `defineRelationship`) produce compile-time-enforced types + zod validators + a
  per-type `visual-style` (color/shape) and a `registry` of all types.
- **`packages/architecture`** holds *the instances* — Noah's actual roles/projects/skills,
  authored through the builders. Won't compile if malformed; won't build if a
  reference dangles. Build-time validation over runtime hope, demonstrated on himself.

### Entity model

```ts
type ThreadId = 'graph' | 'consciousness' | 'intelligence' | 'scale' | 'ai-native'

// --- factual (verifiable from the CV) ---
Org        { id; name; sector }
Role       { id; org; title; start; end: string|'present'; location?;
             kind: 'employment'|'military'|'founding'|'instruction'|'research';  // polymorphic; drives visual-style
             summary; highlights[]; metrics: Metric[]; threads: ThreadId[];
             projects: string[]; skills: string[] }
Project    { id; name; role?; summary; url?; highlights[]; threads[]; skills[]; capabilities[] }
Skill      { id; name; category: 'lang'|'db'|'infra'|'frontend'|'data'|'ai'|'practice' }
Education  { id; institution; credential; field?; honors?; start; end }
Metric     { label; value: string; context? }

// --- curatorial (interpretation layered on facts — each carries receipts) ---
Capability { id; name; blurb; threads[]; evidence: string[] }   // role/project ids that justify the claim
Thread     { id: ThreadId; label; color; blurb; evidence: string[] }
```

The payoff edge: a single `Skill` (e.g. Neo4j) connects to 5 roles across 13 years.
Selecting it lights up the whole timeline — conviction made visible.

## Four projections, one validated source

1. **Timeline** — career chronologically.
2. **Capabilities** — the "platform capability portfolio": what Noah can do for you,
   each backed by evidence across the career (consulting-facing).
3. **Career graph** — the network, thread-coloured (Cytoscape, timeline-anchored layout).
4. **Architecture** — the schema + package dependency graph, generated from the repo
   itself (`arch-introspect`), never stale. The site shows the model that makes the site.

Plus the **in-browser terminal** (`packages/console`): a 5th way to drive all four
lenses. `query skill neo4j`, `view timeline`, `open project iam`, `ls roles`, `help`.
Same `graph-engine` calls as the visual UI — no duplicated logic. Hotkey to open,
in-session history, command-name autocomplete. Ceiling: `verb noun [args]` only, no
piping/persistence in v1.

## Information architecture (the scroll)

1. Hero (instant) — name · "Agentic Systems Architect" · subhead · CTA · résumé.
2. Career graph (lazy centerpiece).
3. Capabilities.
4. Selected work — iAm, Atlas, WorkforceEdge (1.2M users), DIA.
5. By the numbers — animated stat wall.
6. Now / available for.
7. Contact / links.

**Mobile:** the desktop graph becomes a vertical scrollytelling timeline from the same
data; sections reflow to one column. One dataset, two presentations.

## Loading strategy

- `index.html` ships inline critical CSS + a static hero skeleton → first paint before JS.
- Eager bundle = hero + nav only. Everything heavy (graph, Cytoscape, Motion-heavy
  sections, terminal) is code-split and lazy via dynamic `import()` on view/scroll.
- Images: responsive `srcset`, `loading="lazy"`, modern formats.

## Single sources of truth

| Concern | One place |
|---|---|
| Design tokens (color, type, spacing, motion timing) | `packages/theme` — TS, injected to `:root` as CSS vars; Tailwind `@theme` + Cytoscape read the same values |
| Per-entity visual style | `packages/schema/visual-style` |
| Entity/edge definitions | `packages/schema` |
| Career data | `packages/architecture` instances |
| Derived indexes (skill→roles, thread membership, capability evidence) | `packages/graph-engine` |
| Commands | `packages/console` |
| UI primitives | `packages/ui` |

## Animation

Motion variants centralized in `packages/theme/motion`. Scroll-reveal + stagger (once),
spring hover, hero graph-settle on load, thread-highlight tweens, stat count-up.
`prefers-reduced-motion` honoured globally. Motion serves comprehension, not decoration.

## Aesthetic

Dark, technical, data-console. Monospace for data labels, single accent, intelligence-
dashboard feel. (Fits the defense + data lineage and the terminal.)

## Deploy (Cloudflare Pages)

- Cloudflare Pages settings: build command `bunx nx build web`, output dir `apps/web/dist`.
- `public/_redirects` (`/* /index.html 200`) gives SPA fallback so `/repo` deep-links resolve.
- Custom domain `noahclark.ing` set in the Cloudflare dashboard (no CNAME file).
- Static, zero runtime; `.ing` HTTPS automatic.

## v1 scope boundaries (YAGNI)

**In:** schema + instances + validation, 4 lenses, terminal, animation, responsive, deploy.
**Out (earn later):** real CLI binary, live Neo4j backend, blog, light/dark toggle
(dark only v1), graph↔constellation toggle, terminal piping/persistent history,
fuzzy command search.
```
