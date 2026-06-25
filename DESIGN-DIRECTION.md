<!--
  Design-direction brief for noahclark.ing.
  Generated 2026-06-24 from a multi-agent web-research workflow:
  44 celebrated software-engineer portfolios discovered across 6 lenses,
  22 deep-read (WebFetch + commentary search), 3 design directors + 1 integrator.
  Source corpus + reasoning: workflow wf_c0a9e5f1-17e.
-->

# noahclark.ing · Design Direction

## 1. North-star design thesis

The site is an instance of what it sells: a career modelled as a typed, zod-validated knowledge graph, rendered several ways. So the redesign serves one idea: **the medium is the proof.** Every typographic, chromatic and motion decision must make the system feel like it is *running and governed by a system*, not decorated. The chrome recedes to near-silence so the only loud things on the page are the data and the structure that holds it, because for a McGill data-viz evaluator that restraint *is* the competence claim.

## 2. Top 10 prioritised moves

| # | Move | Why it matters | Inspired by | View | Effort |
|---|------|----------------|-------------|------|--------|
| 1 | **Collapse to one amber. Kill the five-thread rainbow.** Replace the five saturated thread hues with a single OKLCH amber ramp; threads distinguished by lightness + line-weight + dash, never hue. Amber reserved for signal only (active, hover, focus, cursor, the single most-important node). | The biggest single thing diluting the signal and the clearest violation of the amber-only rule. Converts "colourful" to "designed" in one `tokens.ts` edit that touches every view. | Lusion (two colours), Anthony Fu (opacity-as-hierarchy), The Pudding / Visual Cinnamon (only data is saturated) | Global | Low |
| 2 | **Tokenise a fluid type scale + tracking that tightens with size.** Add a `clamp()`-based modular scale (1.25), `leading`, `tracking` to `tokens.ts`; tracking `-0.022em` on display, `+0.08em` on uppercase mono micro-labels. | With only two families, the *scale* must carry the role separation a third typeface would. Hanken at 4.5rem with default tracking reads amateur; at `-0.022em` it reads cut. Everything else depends on this. | Brittany Chiang, Rauno Freiberg, Patrick Heng, The Pudding | Global | Low |
| 3 | **Enforce the two-family taxonomy as law: if a token is data, it renders mono.** Hanken = the human voice (prose, names, headings). IBM Plex Mono = every graph primitive (entity types, thread IDs, schema fields, ISO dates, counts, paths, terminal). | Makes the knowledge-graph framing visible *at the glyph level* with zero explanation. The cheapest way to look expensive, and on-concept because the site is literally about typed data. | Brittany Chiang (monospaced stack chips), Emil Kowalski, Paco Coursey | Global | Low |
| 4 | **Lead with a manifesto line, not a job title.** One declarative architectural position in large Hanken, `text-wrap: balance`, no buttons crowding it. Below it, one *real* number in mono tabular-nums. Home loads complete and still. | Primes the reviewer to read graph / repo / story as *proof of the claim* rather than decorative features. A true number out-persuades any adjective. | Rauno (manifesto-as-hero), van Schneider ("I create, therefore I am"), Lee Robinson (BLUF bio), Max Stoiber (real number) | Home | Low |
| 5 | **Replace card grids with Heng hairline rows.** Full-width rows: name + one-sentence description (what it *did*, never the stack) in Hanken left, year + thread-id in mono tabular-nums right, 1px rules, `translateX(8px)` + amber accent-bar on hover. | The house aesthetic already mandates definition lists over cards. A single confident list out-authorities a card grid at equal density, and the scan-path works for an evaluator who scans, not studies. | Patrick Heng (canonical rows), Anthony Fu (ecosystem-grouped lists), Paco / mxstbr (one sentence, no badges) | Home (Projects, Capabilities) | Low |
| 6 | **The terminal queries the live career graph.** Wire Cypher-like commands over the already-typed in-memory graph: `query roles where thread = consciousness`, `path "Air Force" -> "MOSAIC"`, `schema Role`, `count manifestations`, returning real numbers. | The recursive proof: a site about graph engineering contains a live query engine over its own content. The single most convincing thing the site can do for a technical evaluator, with zero WebGL. | Henry Heffernan (concept-demands-it easter egg), Samsy (be the product), mxstbr (real numbers) | Terminal | Medium |
| 7 | **Sliding amber indicator pill on the lens switcher + frequency-gated motion.** One `layoutId` underline (not a fill) slides between lenses; the content underneath swaps instantly (opacity-only, no translate). | The highest-traffic interaction on the site, currently reading as "buttons". The most-copied micro-interaction in the genre for maximum polish at near-zero cost. The still-chrome/animated-content contrast *is* the hierarchy. | Brittany Chiang (sliding indicator), Rauno + Emil (gate motion by frequency) | Home / Global | Low |
| 8 | **Make `/story` a true sticky split-step driven by one progress scalar, and unify the nine scenes into one grammar.** Pin the viz, scroll prose steps, lock each scene to a threshold so it is legible *at rest*. Drive each anime.js timeline off a single `0–1` `useScroll` progress via `.seek()`. One amber+neutral palette, shared stroke weights / easing / draw cadence across all nine scenes. | The move that most directly wins the data-viz sale. Turns "nine clever experiments stapled together" into "one engineer's system". | The Pudding (trigger-hold-trigger), Visual Cinnamon (step-based, no drift), Lusion (one progress uniform), Bruno Simon (one palette = one world) | Story | High |
| 9 | **Circular View-Transitions theme toggle.** `document.startViewTransition()` + a `clip-path` circle expanding from the click coordinates (`Math.hypot` radius). Tuned as *warmth spreading*, since light is default. Reuse the same API for `/` ↔ `/repo` ↔ `/story` route crossfades. | The one piece of showmanship that stays fully inside the editorial aesthetic. ~20 lines, the interaction people screenshot, progressive-enhancement-safe. | Anthony Fu (signature toggle), Lee Robinson (native route crossfade) | Global | Low |
| 10 | **Weave methodology prose into `/repo`, and animate the tree's V-shape.** A short mono "how this works" passage (zod validation, typed graph, static-only Cloudflare build) woven into the source view, with amber-accented snippets. The Nx tree expands as a V as it opens. | `/repo` is the strongest non-fakeability signal (you cannot fake the source). Converts "architecture-as-data" from tagline to demonstrated claim, which is exactly the rigour a data-standardisation lab evaluates for. | Ciechanowski (depth as credential), Robb Owen (constraint as craft signal), The Pudding (data-shape = layout-shape) | Repo | Medium |

Global one-liners that ride alongside (each near-free, do them in the move-2/3 commits): amber `::selection` tint, `font-variant-numeric: tabular-nums` everywhere a number lives, `-webkit-font-smoothing: antialiased`, `text-wrap: balance` on headings / `pretty` on body, a 2px amber `focus-visible` ring (cleared for mouse via `:focus:not(:focus-visible)`), an `active:scale-[0.985]` press state, and a thin amber scrollbar confined to the mono panels (`/repo`, terminal).

## 3. Per-view recommendations

### Home / lenses
- **Asymmetric hero**, never a centred lockup with two buttons (the banned AI default). Statement in a left ~7–8 columns of a 12-col grid; the lens switcher and a small mono "system status" readout in the right ~4. On wide screens the graph canvas can hold the right while the statement holds the left. Cap editorial chrome at ~1200px even when a canvas goes full-bleed inside it (van Schneider: refuse to stretch to fill a 27-inch display).
- **Numbered lens labels** via CSS counters: `01 · Career graph`, `02 · Timeline`. Number in mono+amber (signal), title in Hanken. Zero markup (Brittany Chiang).
- **Lens switcher**: the sliding pill (move 7). Labels in mono, uppercase, `tracking.wide`, `fontSize.micro`.
- **Projects / Capabilities**: Heng hairline rows (move 5); Capabilities grouped as an ecosystem definition list (Anthony Fu), term in Hanken, evidence in mono. No identical cards.
- **Timeline**: hairline rows, role/company in Hanken, year-range + thread-tag in mono tabular-nums. Small deterministic per-era `padding-left` (`calc(var(--era-index) * 6px)`, capped ~24px) so the stack reads composed, not templated (Aristide Benoist / Heng). Rhythm, not chaos.
- **Graph lens**: keep it the loudest thing on the page; nav and section labels must be quieter than the graph (Ciechanowski's neutral-substrate rule). Resting nodes use the warmed amber-ramp thread values; true amber reserved for the selected/hovered node only. Detail expands *at the node* (a small connected panel), not a sidebar slide-in (Rauno: feedback local to its trigger). Optional cursor-as-force: feed pointer position into the d3-force sim as a gentle 40–60px repulsion so nodes drift and resettle (Bruno Simon's "systems that behave"). Pauses under reduced-motion. Keep the graph/timeline canvases flat: no parallax on a surface you are trying to read.

### Story (scrollytelling)
- **Architecture**: `position: sticky; top: 0; height: 100vh` on the graphic, prose steps scrolling beside it, IntersectionObserver / `useInView` thresholds for between-state transitions. **Trigger, hold, trigger** (The Pudding / Visual Cinnamon): each scene fully legible at rest. Add `scroll-snap-type: y proximity` (not `mandatory`, so it never fights the user) for a discrete dwell per scene.
- **One progress scalar** per scene (Lusion): `useScroll({ offset: ["start end","end start"] })` → `useMotionValueEvent` → `timeline.seek(timeline.duration * easeInOutQuad(p))`. Within-scene continuous motion (sparks flickering, brain pulsing) rides this uniform; between-state jumps ride the thresholds.
- **One visual grammar across all nine scenes** (forge / silos / catalog / brain / globe / tree / growth / thought-stream / swarm): finish `story/viz/palette.ts` so every scene shares one amber+neutral palette, the same stroke weights, easing tokens, draw-in cadence and label type. This is what turns nine toys into one system.
- **Draw-in as the reveal verb** (anime.js v4 `svg.createDrawable` / stroke-dashoffset): each scene's primary structure *constructs itself* rather than fading in. Draw says "this system is being built". For graph/swarm scenes pair with `motionPath` so a token visibly travels an edge: the literal "data flowing" proof.
- **Per-scene environment shift**: crossfade the page background within the warm-neutral family only (cream → warm sand → deep warm charcoal → back), amber constant throughout (Patrick Heng's full-environment change, done with a Framer background tween, no WebGL, no banned hues).
- **Pedagogical rhythm inside each scene** (Ciechanowski): 2–3 sentences of factual copy about what was built, *then* the viz reacts. The viz is evidence, not illustration.
- **Deep-linkable scenes** (`/story/brain`, `/story/forge`) so the strongest state is a single shareable link that works without explanation (Paco's `/craft`, Sonner's one-click demo). This is how the site travels in a DM to a researcher.
- Very shallow (2–4px max) Tornis-style SVG parallax on pointer-move for depth (Robb Owen), `(hover: hover)`-gated, collapsed under reduced-motion.

### Repo
This surface is where the mono/Hanken taxonomy pays off hardest; the typography *is* the concept.
- All file-tree labels, line numbers, paths, type signatures in Plex Mono. Tree depth shown with a 1px `--color-border` guide rule per indent level (Heng's hairline applied to a tree). Animate the natural V-expansion as nodes open (move 10).
- **Syntax stays inside the warm palette**: keywords/types in `--color-text`, strings in a desaturated warm tone derived from a single thread value, comments in `--color-text-faint`, amber only on the active line gutter. No rainbow syntax theme; that would shatter the discipline.
- **Methodology woven in** (move 10): a short mono "how this works" note (zod validation, static-only build, typed schema) is a trust marker for McGill (Robb Owen / Stoiber: constraint as credential).
- Reading-column contract: prose annotation at `68ch`, source pane wider. The contrast is the editorial rhythm.
- Branded mono scrollbar.

### Terminal
- The recursive query engine (move 6): Cypher-like commands over the in-memory typed graph returning real graph data and real counts. This is the closest the site gets to "be the product" with zero WebGL.
- Inline feedback at the prompt (command accepted, copied), never an edge toast (Rauno).
- Mono everywhere, tabular-nums on every count, branded amber scrollbar, the amber block cursor as one of the few licensed uses of true amber.

### Global (nav, theme toggle, footer, loading)
- **Near-invisible header** (Aristide Benoist / van Schneider): name + lens nav + toggle, no background fill or border until scrolled. Optional scroll-hide-on-down / reveal-on-up (`useScrollDirection`, ~20 lines) to keep long story/repo scrolls clean (Brittany Chiang).
- **Theme toggle**: the circular View Transition (move 9).
- **Footer**: one line, real links, no contact-form bloat. A single mono build-stamp (`static · zod-validated · N entities`) doubles as a quiet credential (Stoiber / van Schneider).
- **Loading**: the loader is the opening act, not a spinner hiding latency (Bruno Simon / Jordan Breton). Warm cream background, real bundle-chunk percentage in mono tabular-nums, the first story scene's SVG beginning to draw behind it. On complete, it *resolves into* the first view rather than disappearing. Reduced-motion: static percentage, instant resolve.
- **First-paint stagger**: name, manifesto line, lens switcher, then the active viz cascade in from `translateY(10px)`, opacity 0→1, `calc(var(--enter-stage) * 90ms)` delay, via Anthony Fu's zero-JS `nth-child` keyframes. First paint only, never on subsequent lens switches.

## 4. Motion language

The governing thesis: **motion proves the positioning, it never dresses it.** When the graph settles, an edge fires, a scene resolves or a lens switches, the visitor should feel a system running, not a designer performing. Six rules make the whole site move as one:

1. **One source of truth for motion.** Create `packages/theme/src/motion.ts` (the motion equivalent of `tokens.ts`): `ease.standard [0.4,0,0.2,1]`, `ease.enter [0.16,1,0.3,1]` (expo-out, content arriving), `ease.exit [0.4,0,1,1]`; durations `micro 120 / ui 200 / enter 320 / scene 480`; `stagger 60`. anime.js timelines and Framer `transition` props both read these. One change propagates everywhere.
2. **Gate motion by frequency and novelty** (Rauno / Emil). High-frequency chrome (lens tabs, nav, terminal input, theme label) gets *zero* motion beyond the indicator pill and the press state. Rare, high-stakes moments (story scenes, first graph settle, the theme toggle) get considered motion. The contrast between still chrome and animated content is itself the hierarchy, and it is what reads as senior.
3. **Asymmetric timing: entrances slower than exits** (Emil Kowalski). Incoming content uses `dur.enter` (320ms) + `ease.enter`; outgoing uses `dur.ui` (200ms) + `ease.exit`. New content *arrives* rather than old content merely *leaving*. This single rule makes every crossfade feel intentional.
4. **Follow-through / overlapping action** (Rauno / Disney). Secondary elements trail the primary by ~120ms: in a story scene the background tint shifts first, the SVG draws second, the caption rises last. Responsible for most of the perceived-quality gap over a template, and it costs nothing.
5. **Draw, don't fade, for anything structural** (anime.js v4). Technical diagrams and the repo tree construct themselves via stroke-dashoffset / `createDrawable`. Construction is on-message for an architecture site; a fade is just a picture.
6. **`prefers-reduced-motion` is a branch, not a kill switch** (Rauno). It removes *looping and translation* (scroll choreography, SVG draws, particle loops, parallax collapse to end-state), but *keeps* opacity/colour state feedback (hover, press, inline-confirm). Implement once as `useMotionConfig()`.

**anime.js v4 / Framer Motion tactics, concretely.** Use Framer's `useScroll` + `useMotionValueEvent` to feed a single eased `0–1` into each anime.js timeline via `.seek()` (no per-property scroll listeners, no jank). Use `animatable` for the within-scene live motion, `svg.createDrawable` for construction reveals, `motionPath` for tokens travelling edges. Use Framer `layoutId` for the lens pill and `useInView` for step thresholds. Route and theme transitions go through the browser-native View Transitions API at zero library cost. Keep Framer for crossfades/reveals and anime.js for the scene internals; the shared `motion.ts` tokens keep them in lockstep.

## 5. Typography & colour refinements

**Type.**
- **Fluid modular scale** (move 2): `micro 11→12 / small 13→14 / body 16→17 / lead 18→22 / h3 / h2 / h1 2.5→4.5rem / display (story titles only)`. Tracking tightens as size grows (`-0.022em` display, `0` body, `+0.08em` uppercase mono labels). `leading` from `1.05` tight to `1.7` loose.
- **Two-family taxonomy as taxonomy, not decoration** (move 3): in `EntityPanel`, the title is Hanken; every property key, type tag and date is Plex Mono `fontSize.micro`, `tracking.wide`, uppercased, in `--color-text-muted`. In Timeline / Projects, role/company is Hanken, the year-range and thread-tag are mono.
- **Optical detail** (the Paco tier): `tabular-nums` + `lining-nums` everywhere a number lives so `2013–2015` locks instead of wobbling; `text-wrap: balance` on headings + hero, `pretty` on body, to kill widows; `font-optical-sizing: auto` so the display cut is used at display sizes and the text cut for body; `-webkit-font-smoothing: antialiased` globally so Hanken's thin strokes stay crisp on the warm ivory.

**Colour.** The `tokens.ts` foundation is already correct (warm ivory `#f6f3ec`, single AA-safe amber `#ad6a14`, three-step muted ramp). The work is *deployment discipline*.
- **Amber is signal, never decoration.** Permitted on: active lens indicator, focus rings, link hover, terminal cursor, numbered-section prefix, row-hover accent bar, and *inside data visualisations*. Forbidden as: background fill, resting-card border, decorative underline, gradient. Audit `LensSwitch`, `Nav`, `EntityPanel` for any resting amber and demote it to `--color-border` / `--color-text-muted` (Lusion, Samsy, Brittany Chiang: the accent never fills a background, so it always reads as signal).
- **Opacity / tint as hierarchy, one mid-grey for all secondary** (Anthony Fu / Paco): every date, count, type-label and caption is `--color-text-muted`; tertiary is `--color-text-faint`; never a fourth value, never random opacity.
- **OKLCH amber ramp** for the accent so hover/active/focus/dim are perceptually even, not hand-picked: `accent oklch(0.55 0.12 62)`, `accentHover oklch(0.50 0.13 62)`, `accentDim oklch(0.74 0.07 65)`, `accentTint color-mix(in oklch, var(--color-accent) 12%, transparent)`. Selection highlight, focus-ring background and row-hover bar all derive from the one token via `color-mix`, so they stay coherent if the hue is ever tuned.
- **The thread hues: warm them, normalise them in OKLCH, quarantine them to data.** The five-thread rainbow becomes a single amber lightness ramp (move 1). If edge *type* genuinely must be legible at a glance in the graph (Ciechanowski's semantic colour-coding, learned once and reused across graph + timeline + story), keep a *maximum of three* amber-ramp values with a printed legend. That is a deliberate data-encoding decision, not a palette. The current `consciousness #8157d6` (violet) and `graph #2f7dc4` (cool blue) directly violate the no-teal / no-indigo rule and must go regardless. Whatever survives lives only on data surfaces (graph edges/nodes, thread chips, `story/viz/palette.ts`) and never touches chrome.
- **Per-lens accent temperature, within amber.** Shift only the accent's lightness/chroma per lens via one custom property on the lens root (graph at base, timeline slightly dimmer, repo slightly deeper to match the mono register, story warmer per scene). One variable, swapped on lens change: navigation feels architecturally intentional without ever introducing a second hue.
- **Contrast, stated in a comment in `tokens.ts` so future edits don't quietly break it**: body on surface ~14:1; muted on ivory ~5:1 (AA for metadata); amber on ivory ~4.6:1, which is exactly why amber is reserved for heading-scale and UI signals, not body-size link text. If amber must ever sit on body-size text, darken to `oklch(0.50 …)` to clear 4.5:1.

## 6. Signature moments

1. **The terminal answers questions about itself.** A visitor types `path "Air Force" -> "MOSAIC"` or `count manifestations` and the in-browser terminal returns real graph data about the site they are standing on. A site about graph engineering, running a live query engine over its own content. This is the screenshot that lands the engagement (Heffernan, Samsy).
2. **The circular warmth-spread theme toggle.** Click the toggle and warmth wipes across the viewport from the exact click point via View Transitions + `clip-path`. The one bit of showmanship that stays fully inside the editorial aesthetic: no glow, no gradient, just a clean expanding circle (Anthony Fu).
3. **The story scenes construct themselves.** Each `/story` scene's structure *draws in* on entry (forge frame, tree branches, graph edges) and a token visibly travels an edge, so the page reads as a system being built rather than pictures being shown. Each scene is a shareable deep-link (`/story/brain`) that works without explanation (anime.js `createDrawable` + `motionPath`; Paco's `/craft`).
4. **The mono build-stamp in the footer.** `static · zod-validated · N entities`, where N is rendered from the actual validated graph. A single quiet line that is simultaneously a footer and a credential (Stoiber).
5. **The sliding amber pill that proves the discipline.** The lens indicator glides between lenses while the content underneath swaps instantly. The deliberate contrast (one thing moves, everything else snaps) is the senior-engineer tell that the McGill reviewer registers without naming (Brittany Chiang + Rauno's frequency rule).

## 7. Anti-patterns

- **Do not keep the five-thread rainbow** "because it's already built". It is the single biggest signal-diluter and a direct violation of the amber-only rule. The cool-blue and violet threads in particular break the no-teal / no-indigo non-negotiable.
- **Do not build the WebGL-spectacle portfolio.** Bruno Simon's driving game, Samsy's and Jordan Breton's dark-first cyberpunk glow, Heffernan's OS conceit are wrong register for researchers evaluating a data-standardisation engagement. Borrow their *discipline* (one palette = one world, the loader as opening act), not their spectacle. Nicky Case's warning is the binding constraint: for someone selling "I build things that work", every animation that exists for its own sake undermines the signal.
- **No custom cursor follower or trailing element.** Reads as creative-dev flex, the wrong register. Make the *existing* pointer a quiet input to the data (the graph repulsion force) instead.
- **No scroll-jacking on the home lenses or `/repo`.** Scroll choreography lives *only* in `/story`, which is opt-in. Parallax on a data canvas you are trying to read is hostile (Aristide Benoist: never paralyse user control).
- **No glow, no bloom, no indigo/violet gradient, no particle storm.** Every "alive" effect here is achieved with opacity, transform, draw and gentle force, never with light bleed. This is the explicit opposite of the corpus's dark-first sites.
- **No motion on high-frequency chrome.** Lens tabs, nav links, terminal input and the theme label get zero transition beyond the indicator pill and the press state. Animating everything reads as junior.
- **No rainbow syntax theme in `/repo`.** Syntax tokens stay inside the warm palette with amber only on the active gutter. A standard editor colour scheme would shatter the whole discipline at the exact surface where discipline is the point.
- **No centred hero with two buttons, no identical card grid, no tech-stack badges, no em dashes.** These are the AI-default tells the house rules already ban; the asymmetric hero, the Heng hairline rows and one-sentence "what it did" copy are the replacements.
- **Do not let `/story`'s nine scenes stay nine experiments.** Unshared palettes, stroke weights and easing read as "six clever toys"; the entire payoff of the view is that they become one engineer's system. If the ambient-idle home graph (a tempting addition) cannot be made to feel like the system rather than decoration, cut it.

---

## Source corpus (rated 4+/5 for inspiration)

- [Bartosz Ciechanowski · ciechanow.ski](https://ciechanow.ski) · 5/5
- [Bruno Simon (folio-2025)](https://bruno-simon.com) · 4/5
- [Aristide Benoist](https://aristidebenoist.com) · 4/5
- [Henry Heffernan Portfolio (henryheffernan.com)](https://henryheffernan.com) · 4/5
- [Lusion (lusion.co)](https://lusion.co) · 4/5
- [SMSY-Gen02 (samsy.ninja)](https://samsy.ninja) · 4/5
- [Patrick Heng Portfolio (patrickheng.com)](https://patrickheng.com) · 4/5
- [Robb Owen (robbowen.digital)](https://robbowen.digital) · 4/5
- [Jordan Breton Portfolio](https://jordan-breton.com) · 4/5
- [Rauno Freiberg (rauno.me)](https://rauno.me) · 4/5
- [Emil Kowalski (emilkowal.ski)](https://emilkowal.ski) · 4/5
- [Paco Coursey · paco.me](https://paco.me) · 4/5
- [Brittany Chiang (brittanychiang.com)](https://brittanychiang.com) · 4/5
- [Lee Robinson · leerob.com](https://leerob.com) · 4/5
- [Anthony Fu (antfu.me)](https://antfu.me) · 4/5
- [Max Stoiber (mxstbr.com)](https://mxstbr.com) · 4/5
- [Visual Cinnamon (Nadieh Bremer)](https://www.visualcinnamon.com) · 4/5
- [The Pudding](https://pudding.cool) · 4/5
