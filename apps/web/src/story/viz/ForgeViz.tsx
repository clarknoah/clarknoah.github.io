import { motion } from 'motion/react'

// Social engineering + document forging: a holographic credential assembles, then
// ACCESS GRANTED. (USAF.)
const fields = ['NAME ████████', 'CLEARANCE ██', 'BADGE #4471-A']

export function ForgeViz({ active }: { role: unknown; active: boolean }) {
  return (
    <div className="relative w-full max-w-[400px]">
      {/* holographic halo */}
      <motion.div
        className="absolute inset-0 rounded-xl blur-xl"
        style={{ background: 'linear-gradient(120deg, #2f7dc4, #8157d6, #c95f33, #e0a23b)' }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 0.4 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.div
        className="relative overflow-hidden rounded-xl border border-border bg-surface-raised p-5 font-mono"
        initial={{ opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* shimmer sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)' }}
          initial={{ x: '-130%' }}
          animate={active ? { x: '130%' } : {}}
          transition={{ duration: 1.4, delay: 0.9, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2.6 }}
        />
        <div className="flex gap-4">
          <motion.div
            className="h-20 w-16 rounded"
            style={{ background: 'linear-gradient(135deg, #8157d6, #2f7dc4)' }}
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
          className="mt-5 inline-block rounded border px-2.5 py-1 text-xs"
          style={{ borderColor: '#3a9663', color: '#3a9663', boxShadow: '0 0 14px rgba(58,150,99,0.5)' }}
          initial={{ opacity: 0, scale: 1.6 }}
          animate={active ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.6, type: 'spring', stiffness: 260, damping: 16 }}
        >
          ACCESS GRANTED
        </motion.div>
      </motion.div>
    </div>
  )
}
