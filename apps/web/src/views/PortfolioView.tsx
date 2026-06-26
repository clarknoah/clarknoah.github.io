import type { Lens } from '@noahclark/console'
import { lazy, Suspense } from 'react'
import { EntityPanel } from '../components/EntityPanel'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Capabilities, Contact, Hero, SelectedWork, Services } from '../sections'
import { LensSwitch } from '../lenses/LensSwitch'
import { Projects } from '../lenses/Projects'
import { Timeline } from '../lenses/Timeline'
import { useStore } from '../store'

const CareerGraph = lazy(() => import('../graph/CareerGraph').then((m) => ({ default: m.CareerGraph })))

export function PortfolioView() {
  const { state, dispatch } = useStore()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const available: Lens[] = isMobile
    ? ['timeline', 'projects', 'capabilities']
    : ['graph', 'timeline', 'projects', 'capabilities']
  const lens: Lens = isMobile && state.lens === 'graph' ? 'timeline' : state.lens

  return (
    <main>
      <Hero />
      <Services />
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="max-w-2xl">
          <p className="font-display text-base italic text-text-muted">The work</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight text-text md:text-3xl">
            My career as a graph you can query
          </h2>
          <p className="mt-3 leading-relaxed text-text-muted">
            This site is the work pointed back at me: my career modelled as a typed, validated
            knowledge graph, rendered several ways. The same data drives the{' '}
            <button
              type="button"
              onClick={() => dispatch({ type: 'setView', view: 'repo' })}
              className="text-accent underline-offset-2 hover:underline"
            >
              repo view
            </button>
            . Every figure on this page is generated from that validated data.
          </p>
        </div>
        <div className="mt-8 mb-6 flex items-center justify-between">
          <p className="font-display text-base italic text-text-faint">Lens</p>
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
        {lens === 'projects' && <Projects />}
        {lens === 'capabilities' && <Capabilities />}
      </section>
      <SelectedWork />
      <Contact />
      <EntityPanel />
    </main>
  )
}
