import { lazy, Suspense } from 'react'
import { Nav } from './components/Nav'
import { Terminal } from './terminal/Terminal'
import { PortfolioView } from './views/PortfolioView'
import { useStore } from './store'

const RepoView = lazy(() => import('./views/RepoView').then((m) => ({ default: m.RepoView })))
const StoryView = lazy(() => import('./views/StoryView').then((m) => ({ default: m.StoryView })))

const Loading = () => <div className="p-10 font-mono text-text-muted">loading…</div>

export function App() {
  const { state } = useStore()
  return (
    <div className="min-h-screen">
      <Nav />
      {state.view === 'repo' ? (
        <Suspense fallback={<Loading />}>
          <RepoView />
        </Suspense>
      ) : state.view === 'story' ? (
        <Suspense fallback={<Loading />}>
          <StoryView />
        </Suspense>
      ) : (
        <PortfolioView />
      )}
      <Terminal />
    </div>
  )
}
