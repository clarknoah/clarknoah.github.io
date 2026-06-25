# noahclark.ing — working rules

Noah Clark's personal site. A Bun + Nx + TypeScript monorepo that models his career as a
typed, validated knowledge graph and renders it. Full design in `ARCHITECTURE.md`.

Positioned as an **independent AI & systems engineering consulting page**, not a résumé: the
home leads with the offer (`profile.positioning`) and the engagement list (`services.ts`); the
career graph, repo, story, and timeline are demoted to evidence. Offer copy lives in
`profile.ts` + `services.ts`.

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
- Type: two voices. **Newsreader** (warm editorial serif) is the human voice for all prose,
  headings, and small labels. **IBM Plex Mono** is the system voice, used ONLY for real data:
  figures, IDs, file paths, tags/skills, terminal, code. Never Inter, Hanken Grotesk, Space
  Grotesk, or any neutral grotesk (a grotesk-as-default is itself the AI tell here).
- **No ALL-CAPS tracked mono kickers.** Uppercase, letter-spaced micro-labels in a different
  font (`SERVICES`, `AVAILABLE`) read as a template tell. Section eyebrows and small labels are
  small serif italic in sentence case (`font-display text-base italic`). The one exception is
  diagrammatic content inside a story viz (e.g. the ForgeViz blueprint annotations).
- Accent: amber (`--color-accent`), used as signal only (active, hover, focus, CTA, terminal
  cursor), never as decoration or a section-label colour. No teal, no indigo/violet gradients,
  no glow shadows.
- Layout: editorial. Asymmetric grids, hairline definition-list rows over identical card grids,
  generous whitespace. One amber CTA + a quiet text link, never twin buttons. Gentle motion
  only (fade/rise), `prefers-reduced-motion` honoured.

## Single sources of truth

- Design tokens: `packages/theme/src/tokens.ts` (run `tools/gen-theme` to regenerate CSS).
- Career data: `packages/architecture` (validated by `tools/validate`).
- Entity model + visual style: `packages/schema`.
- Personal facts + positioning copy: `packages/architecture/src/profile.ts`.
- Consulting engagements: `packages/architecture/src/services.ts` (each with a proof link).
- Never hardcode a value that already lives in one of these.

## Build

- `bun install`; `bunx nx dev web` (local); `bunx nx build web` (→ `apps/web/dist`).
- Deploys to Cloudflare Pages (`noahclark` project) on the `revamp` branch.
