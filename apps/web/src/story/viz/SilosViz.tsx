import { motion } from 'motion/react'

// ICITE: separate agency IT silos consolidating into one shared cloud. (Questor.)
const silos = ['CIA', 'NSA', 'DIA', 'NGA', 'FBI']

export function SilosViz({ active }: { role: unknown; active: boolean }) {
  return (
    <div className="relative h-[360px] w-full max-w-[460px]">
      {/* shared cloud */}
      <motion.div
        className="-translate-x-1/2 absolute top-2 left-1/2 rounded-full border border-accent bg-accent/10 px-7 py-4 font-mono text-xs text-accent"
        initial={{ opacity: 0, y: -12, scale: 0.9 }}
        animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        ICITE shared cloud
      </motion.div>

      {/* silos rise and merge upward */}
      {silos.map((label, i) => (
        <motion.div
          key={label}
          className="absolute bottom-0 flex w-12 items-start justify-center rounded-t border border-border bg-surface-raised pt-2 font-mono text-[9px] text-text-muted"
          style={{ left: `${10 + i * 19}%`, height: '130px' }}
          initial={{ opacity: 0, y: 36 }}
          animate={active ? { opacity: [0, 1, 1, 0.15], y: [36, 0, 0, -56] } : { opacity: 0 }}
          transition={{ duration: 2.6, delay: 0.2 + i * 0.14, times: [0, 0.25, 0.6, 1] }}
        >
          {label}
        </motion.div>
      ))}
    </div>
  )
}
