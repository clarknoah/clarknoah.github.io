import { lazy, Suspense } from 'react'
import { Nav } from './components/Nav'
import { Terminal } from './terminal/Terminal'
import { PortfolioView } from './views/PortfolioView'
import { useStore } from './store'

const RepoView = lazy(() => import('./views/RepoView').then((m) => ({ default: m.RepoView })))

export function App() {
  const { state } = useStore()
  return (
    <div className="min-h-screen pb-16">
      <Nav />
      {state.view === 'repo' ? (
        <Suspense fallback={<div className="p-10 font-mono text-text-muted">loading repo…</div>}>
          <RepoView />
        </Suspense>
      ) : (
        <PortfolioView />
      )}
      <Terminal />
    </div>
  )
}
