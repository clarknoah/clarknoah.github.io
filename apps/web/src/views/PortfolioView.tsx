import type { Lens } from '@noahclark/console'
import { lazy, Suspense } from 'react'
import { EntityPanel } from '../components/EntityPanel'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Capabilities, Contact, Hero, Now, SelectedWork, StatWall } from '../sections'
import { Timeline } from '../lenses/Timeline'
import { LensSwitch } from '../lenses/LensSwitch'
import { useStore } from '../store'

const CareerGraph = lazy(() => import('../graph/CareerGraph').then((m) => ({ default: m.CareerGraph })))

export function PortfolioView() {
  const { state } = useStore()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const available: Lens[] = isMobile ? ['timeline', 'capabilities'] : ['graph', 'timeline', 'capabilities']
  const lens: Lens = isMobile && state.lens === 'graph' ? 'timeline' : state.lens

  return (
    <main>
      <Hero />
      <section className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">career</p>
          <LensSwitch available={available} current={lens} />
        </div>
        {lens === 'graph' && (
          <Suspense
            fallback={
              <div className="flex h-[62vh] items-center justify-center font-mono text-text-faint">
                loading graph…
              </div>
            }
          >
            <CareerGraph />
          </Suspense>
        )}
        {lens === 'timeline' && <Timeline />}
        {lens === 'capabilities' && <Capabilities />}
      </section>
      <SelectedWork />
      <StatWall />
      <Now />
      <Contact />
      <EntityPanel />
    </main>
  )
}
