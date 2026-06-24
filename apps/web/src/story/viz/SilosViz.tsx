import { motion } from 'motion/react'

// ICITE: separate agency IT silos consolidating into one glowing shared cloud. (Questor.)
const silos = [
  { l: 'CIA', c: '#2f7dc4' },
  { l: 'NSA', c: '#8157d6' },
  { l: 'DIA', c: '#c95f33' },
  { l: 'NGA', c: '#3a9663' },
  { l: 'FBI', c: '#e0a23b' },
]

export function SilosViz({ active }: { role: unknown; active: boolean }) {
  return (
    <div className="relative h-[360px] w-full max-w-[460px]">
      {/* shared cloud */}
      <motion.div
        className="-translate-x-1/2 absolute top-2 left-1/2 rounded-full border px-7 py-4 font-mono text-xs"
        style={{
          borderColor: 'var(--color-accent)',
          color: 'var(--color-accent)',
          background: 'radial-gradient(circle, rgba(224,162,59,0.18), transparent 70%)',
          boxShadow: '0 0 34px rgba(224,162,59,0.32)',
        }}
        initial={{ opacity: 0, y: -12, scale: 0.9 }}
        animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        ICITE shared cloud
      </motion.div>

      {/* silos rise, glow, and merge upward */}
      {silos.map((s, i) => (
        <motion.div
          key={s.l}
          className="absolute bottom-0 flex w-12 items-start justify-center rounded-t border pt-2 font-mono text-[9px]"
          style={{
            left: `${10 + i * 19}%`,
            height: '130px',
            borderColor: s.c,
            color: s.c,
            background: `color-mix(in oklab, ${s.c} 14%, transparent)`,
            boxShadow: `0 0 18px ${s.c}55`,
          }}
          initial={{ opacity: 0, y: 36 }}
          animate={active ? { opacity: [0, 1, 1, 0.12], y: [36, 0, 0, -58] } : { opacity: 0 }}
          transition={{ duration: 2.6, delay: 0.2 + i * 0.14, times: [0, 0.25, 0.6, 1] }}
        >
          {s.l}
        </motion.div>
      ))}
    </div>
  )
}
