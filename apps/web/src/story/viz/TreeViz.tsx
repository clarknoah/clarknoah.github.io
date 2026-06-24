import { animate, createTimeline, spring, stagger, svg } from 'animejs'
import { useRef } from 'react'
import { useAnime } from '../anime'
import { at } from './palette'

// General Assembly curriculum tree. A trunk rises, then coloured branches draw outward
// as curved bezier strokes, each child gated to start only once its parent has finished.
// Leaf modules spring-pop as each branch tip is reached; hovering a branch sends a
// travelling spark from the root along that branch and reveals the module label.

const ROOT = { x: 54, y: 92 }

// Three discipline branches off the trunk crown, each with two module leaves.
interface Leaf {
  id: string
  x: number
  y: number
  label: string
}
interface Branch {
  id: string
  // control points for a quadratic-ish cubic from a start to the fork point
  fork: { x: number; y: number }
  c1: { x: number; y: number }
  c2: { x: number; y: number }
  colour: string
  label: string
  leaves: Leaf[]
}

// Trunk: root -> crown
const CROWN = { x: 54, y: 50 }

const BRANCHES: Branch[] = [
  {
    id: 'eng',
    colour: at(0), // blue
    label: 'Software engineering',
    fork: { x: 18, y: 30 },
    c1: { x: 50, y: 44 },
    c2: { x: 24, y: 38 },
    leaves: [
      { id: 'eng-a', x: 6, y: 14, label: 'JavaScript' },
      { id: 'eng-b', x: 22, y: 9, label: 'React' },
    ],
  },
  {
    id: 'dat',
    colour: at(3), // green
    label: 'Data science',
    fork: { x: 54, y: 22 },
    c1: { x: 54, y: 42 },
    c2: { x: 50, y: 30 },
    leaves: [
      { id: 'dat-a', x: 44, y: 5, label: 'Python' },
      { id: 'dat-b', x: 64, y: 5, label: 'Modelling' },
    ],
  },
  {
    id: 'des',
    colour: at(1), // violet
    label: 'Product design',
    fork: { x: 90, y: 30 },
    c1: { x: 58, y: 44 },
    c2: { x: 84, y: 38 },
    leaves: [
      { id: 'des-a', x: 86, y: 9, label: 'UX research' },
      { id: 'des-b', x: 102, y: 14, label: 'Prototyping' },
    ],
  },
]

// Bezier path for the trunk (root -> crown), gently curved.
const TRUNK_D = `M ${ROOT.x} ${ROOT.y} C ${ROOT.x - 3} ${ROOT.y - 18} ${CROWN.x + 3} ${CROWN.y + 18} ${CROWN.x} ${CROWN.y}`

// Bezier path for a branch from crown to its fork point.
const branchD = (b: Branch) =>
  `M ${CROWN.x} ${CROWN.y} C ${b.c1.x} ${b.c1.y} ${b.c2.x} ${b.c2.y} ${b.fork.x} ${b.fork.y}`

// Bezier path for a twig from a branch fork to a leaf.
const twigD = (b: Branch, leaf: Leaf) => {
  const mx = (b.fork.x + leaf.x) / 2
  const my = b.fork.y - 8
  return `M ${b.fork.x} ${b.fork.y} Q ${mx} ${my} ${leaf.x} ${leaf.y}`
}

// Full spark path: trunk + branch + twig concatenated so a spark can travel root->leaf.
const sparkD = (b: Branch, leaf: Leaf) => {
  const trunk = `M ${ROOT.x} ${ROOT.y} C ${ROOT.x - 3} ${ROOT.y - 18} ${CROWN.x + 3} ${CROWN.y + 18} ${CROWN.x} ${CROWN.y}`
  const branch = `C ${b.c1.x} ${b.c1.y} ${b.c2.x} ${b.c2.y} ${b.fork.x} ${b.fork.y}`
  const mx = (b.fork.x + leaf.x) / 2
  const my = b.fork.y - 8
  const twig = `Q ${mx} ${my} ${leaf.x} ${leaf.y}`
  return `${trunk} ${branch} ${twig}`
}

interface Setter {
  opacity: (v: number) => void
}

export function TreeViz({ active }: { role: unknown; active: boolean }) {
  // per-leaf label animatables, keyed by leaf id
  const labelAnims = useRef<Map<string, Setter>>(new Map())

  const ref = useAnime<SVGSVGElement>(active, ({ root, reduceMotion }) => {
    const d = (full: number) => (reduceMotion ? 0 : full)

    // Hide the moving sparks until a hover triggers them.
    for (const el of root.querySelectorAll<SVGCircleElement>('.tree-spark')) {
      el.style.opacity = '0'
    }

    if (reduceMotion) {
      // Present the final composed state instantly.
      for (const el of root.querySelectorAll<SVGPathElement>('.tree-stroke')) {
        el.style.opacity = '1'
        el.style.strokeDasharray = 'none'
      }
      for (const el of root.querySelectorAll<SVGGElement>('.tree-leaf')) {
        el.style.opacity = '1'
        el.style.transform = 'none'
      }
    } else {
      const tl = createTimeline({ defaults: { ease: 'inOutQuad' } })

      // 1. Trunk draws upward from the root.
      const trunk = svg.createDrawable('.tree-trunk')
      tl.add(trunk, { draw: ['0 0', '0 1'], opacity: [1, 1], duration: 560, ease: 'inOut(2)' }, 0)

      // 2. Each branch draws outward from the crown. They begin only once the trunk
      //    has finished, then fan out together.
      for (let i = 0; i < BRANCHES.length; i++) {
        const b = BRANCHES[i]
        if (!b) continue
        const branchDraw = svg.createDrawable(`.tree-branch-${b.id}`)
        // First branch starts at the trunk's END ('<'); the rest align to that first
        // branch's START ('<<') so the three disciplines fan out at once.
        tl.add(
          branchDraw,
          { draw: ['0 0', '0 1'], opacity: [1, 1], duration: 520, ease: 'out(2)' },
          i === 0 ? '<' : '<<',
        )
      }

      // 3. Twigs (children) are gated to start only after their parent branches finish.
      //    The first twig group starts at the branches' END ('<'); the rest align to
      //    that group's START ('<<') so all twigs draw together, each set staggered.
      for (let i = 0; i < BRANCHES.length; i++) {
        const b = BRANCHES[i]
        if (!b) continue
        const twigDraw = svg.createDrawable(`.tree-twig-${b.id}`)
        tl.add(
          twigDraw,
          {
            draw: ['0 0', '0 1'],
            opacity: [1, 1],
            duration: 360,
            delay: stagger(90),
            ease: 'out(2)',
          },
          i === 0 ? '<' : '<<',
        )
      }

      // 4. As each branch tip is reached, its leaf modules spring-pop into place.
      //    '-=120' places the pop 120ms before the twigs finish, so leaves appear
      //    just as their tips are drawn.
      tl.add(
        '.tree-leaf',
        {
          opacity: [0, 1],
          scale: [0, 1],
          ease: spring({ stiffness: 120, damping: 9, mass: 1 }),
          delay: stagger(70),
        },
        '-=120',
      )
    }

    // Per-leaf label setters for crisp reveal on hover.
    labelAnims.current = new Map()
    for (const b of BRANCHES) {
      for (const leaf of b.leaves) {
        const el = root.querySelector<SVGGElement>(`.tree-label-${leaf.id}`)
        if (el) {
          labelAnims.current.set(leaf.id, {
            opacity: (v: number) => {
              el.style.opacity = String(v)
            },
          })
        }
      }
    }
  })

  // Hover: send a travelling spark from the root along the full branch path to the
  // hovered leaf, and reveal the module label.
  const onEnter = (b: Branch, leaf: Leaf) => {
    const root = ref.current
    if (!root) return
    const pathEl = root.querySelector<SVGPathElement>(`#spark-path-${leaf.id}`)
    const sparkEl = root.querySelector<SVGCircleElement>(`#spark-${leaf.id}`)
    labelAnims.current.get(leaf.id)?.opacity(1)
    if (!pathEl || !sparkEl) return
    sparkEl.style.opacity = '1'
    animate(sparkEl, {
      ...svg.createMotionPath(pathEl),
      duration: 900,
      ease: 'inOut(2)',
      onComplete: () => {
        sparkEl.style.opacity = '0'
      },
    })
    // brighten the leaf node itself
    const node = root.querySelector<SVGCircleElement>(`#leaf-node-${leaf.id}`)
    if (node) {
      animate(node, { scale: [1, 1.5, 1], duration: 700, ease: 'inOut(2)' })
    }
  }

  const onLeave = (leaf: Leaf) => {
    labelAnims.current.get(leaf.id)?.opacity(0)
  }

  return (
    <svg ref={ref} viewBox="0 0 108 100" className="w-full max-w-[460px]" aria-hidden>
      <title>General Assembly curriculum tree</title>

      {/* Hidden motion-path definitions: full root-to-leaf curves for the travelling spark. */}
      <defs>
        {BRANCHES.flatMap((b) =>
          b.leaves.map((leaf) => (
            <path
              key={`sp-${leaf.id}`}
              id={`spark-path-${leaf.id}`}
              d={sparkD(b, leaf)}
              fill="none"
              stroke="none"
            />
          )),
        )}
      </defs>

      {/* Trunk */}
      <path
        className="tree-trunk tree-stroke"
        d={TRUNK_D}
        fill="none"
        stroke={at(4) /* amber accent */}
        strokeWidth={1.4}
        strokeLinecap="round"
      />

      {/* Branches and their twigs */}
      {BRANCHES.map((b) => (
        <g key={b.id}>
          <path
            className={`tree-branch-${b.id} tree-stroke`}
            d={branchD(b)}
            fill="none"
            stroke={b.colour}
            strokeWidth={1.1}
            strokeLinecap="round"
          />
          {b.leaves.map((leaf) => (
            <path
              key={`twig-${leaf.id}`}
              className={`tree-twig-${b.id} tree-stroke`}
              d={twigD(b, leaf)}
              fill="none"
              stroke={b.colour}
              strokeWidth={0.8}
              strokeLinecap="round"
              opacity={0.92}
            />
          ))}
        </g>
      ))}

      {/* Root node */}
      <circle cx={ROOT.x} cy={ROOT.y} r={2.6} fill={at(4)} />

      {/* Leaf module nodes + labels (interactive) */}
      {BRANCHES.map((b) =>
        b.leaves.map((leaf) => {
          const labelRight = leaf.x < 54
          return (
            <g key={`leaf-grp-${leaf.id}`}>
              {/* spring-pop node */}
              <g
                className="tree-leaf"
                style={{ opacity: 0, transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                <circle
                  id={`leaf-node-${leaf.id}`}
                  cx={leaf.x}
                  cy={leaf.y}
                  r={2.2}
                  fill={`color-mix(in oklab, ${b.colour} 30%, transparent)`}
                  stroke={b.colour}
                  strokeWidth={0.9}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              </g>

              {/* travelling spark (hidden until hover). cx/cy are 0 because
                  createMotionPath drives it via an absolute translate(x, y); a
                  non-zero base position would double-offset it off-canvas. */}
              <circle
                id={`spark-${leaf.id}`}
                className="tree-spark"
                cx={0}
                cy={0}
                r={1.5}
                fill={b.colour}
                style={{ opacity: 0 }}
              />

              {/* module label, revealed on hover */}
              <g
                className={`tree-label-${leaf.id}`}
                style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
              >
                <text
                  x={labelRight ? leaf.x - 4 : leaf.x + 4}
                  y={leaf.y + 1}
                  textAnchor={labelRight ? 'end' : 'start'}
                  fontSize={3.4}
                  fill={b.colour}
                  className="font-mono"
                >
                  {leaf.label}
                </text>
              </g>

              {/* generous invisible hover target over node + twig */}
              <circle
                cx={leaf.x}
                cy={leaf.y}
                r={6}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onPointerEnter={() => onEnter(b, leaf)}
                onPointerLeave={() => onLeave(leaf)}
              />
            </g>
          )
        }),
      )}
    </svg>
  )
}
