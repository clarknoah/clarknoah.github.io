import { Suspense, lazy } from 'react'
import { Nav } from './components/Nav'
import { useStore } from './store'
import { Terminal } from './terminal/Terminal'
import { PortfolioView } from './views/PortfolioView'

const RepoView = lazy(() => import('./views/RepoView').then((m) => ({ default: m.RepoView })))
const StoryView = lazy(() => import('./views/StoryView').then((m) => ({ default: m.StoryView })))
const ReshapePage = lazy(() =>
  import('./reshape/ReshapePage').then((m) => ({ default: m.ReshapePage })),
)

const Loading = () => <div className="p-10 font-mono text-text-muted">loading…</div>

export function App() {
  const { state } = useStore()
  // Unlisted page: reachable only by URL, deliberately outside the nav and the store.
  if (window.location.pathname.startsWith('/reshape')) {
    return (
      <Suspense fallback={<Loading />}>
        <ReshapePage />
      </Suspense>
    )
  }
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
