# noahclark.ing — working rules

Noah Clark's personal site. A Bun + Nx + TypeScript monorepo that models his career as a
typed, validated knowledge graph and renders it. Full design in `ARCHITECTURE.md`.

## Voice & copy (non-negotiable)

- **No em dashes (`—`). Ever.** Not in page copy, comments, or commit messages. They are the
  single biggest tell of AI-written text. Use a full stop, a comma, a colon, or rewrite.
  En dashes (`–`) for numeric ranges are fine (`2013–2015`).
- **No AI-slop phrasing.** Banned: "your journey", "unlock", "elevate", "seamless",
  "empower", "effortless", "passionate", "it's not just X, it's Y", tidy rule-of-three lists.
- **Epistemic-mode for all rendered copy.** Every factual claim traces to a résumé fact. No
  invented metrics, no hype. See `.claude/skills/epistemic-mode`.

## Aesthetic

- Direction: **refined-technical, warm**. Not the dark + teal dev-template look.
- Light is the default theme; dark + system available via the toggle.
- Type: **Hanken Grotesk** (display + body), **IBM Plex Mono** (mono/terminal). Never Inter,
  Space Grotesk, or the other AI-default families.
- Accent: amber (`--color-accent`). No teal, no indigo/violet gradients, no glow shadows.
- Layout: editorial. Asymmetric grids, definition lists over identical card grids, generous
  whitespace. Gentle motion only (fade/rise), `prefers-reduced-motion` honoured.

## Single sources of truth

- Design tokens: `packages/theme/src/tokens.ts` (run `tools/gen-theme` to regenerate CSS).
- Career data: `packages/architecture` (validated by `tools/validate`).
- Entity model + visual style: `packages/schema`.
- Personal facts (name, domain, links): `packages/architecture/src/profile.ts`.
- Never hardcode a value that already lives in one of these.

## Build

- `bun install`; `bunx nx dev web` (local); `bunx nx build web` (→ `apps/web/dist`).
- Deploys to Cloudflare Pages (`noahclark` project) on the `revamp` branch.
