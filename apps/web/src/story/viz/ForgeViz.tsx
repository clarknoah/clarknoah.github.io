import { motion } from 'motion/react'

// Social engineering + document forging: a credential assembles, then ACCESS GRANTED. (USAF.)
const fields = ['NAME ████████', 'CLEARANCE ██', 'BADGE #4471-A']

export function ForgeViz({ active }: { role: unknown; active: boolean }) {
  return (
    <motion.div
      className="w-full max-w-[380px] rounded-lg border border-border bg-surface-raised p-5 font-mono"
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={active ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex gap-4">
        <motion.div
          className="h-20 w-16 rounded bg-border"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        />
        <div className="flex-1 space-y-3 pt-1">
          {fields.map((t, i) => (
            <div key={t} className="overflow-hidden whitespace-nowrap text-[10px] text-text-muted">
              <motion.span
                className="inline-block"
                initial={{ width: 0, opacity: 0 }}
                animate={active ? { width: 'auto', opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.35, duration: 0.4 }}
              >
                {t}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        className="mt-5 inline-block rounded border border-accent px-2.5 py-1 text-accent text-xs"
        initial={{ opacity: 0, scale: 1.6 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1.6, type: 'spring', stiffness: 260, damping: 16 }}
      >
        ACCESS GRANTED
      </motion.div>
    </motion.div>
  )
}
