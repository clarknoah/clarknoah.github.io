import type { Lens } from '@noahclark/console'
import { EntityPanel } from '../components/EntityPanel'
import { Capabilities, Contact, Hero, SelectedWork, Services } from '../sections'
import { LensSwitch } from '../lenses/LensSwitch'
import { Projects } from '../lenses/Projects'
import { Timeline } from '../lenses/Timeline'
import { useStore } from '../store'

export function PortfolioView() {
  const { state } = useStore()
  const available: Lens[] = ['timeline', 'projects', 'capabilities']
  const lens: Lens = state.lens === 'graph' ? 'timeline' : state.lens

  return (
    <main>
      <Hero />
      <Services />
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-display text-base italic text-text-faint">Lens</p>
          <LensSwitch available={available} current={lens} />
        </div>
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
