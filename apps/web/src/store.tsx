import type { Intent, Lens, View } from '@noahclark/console'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'

interface State {
  view: View
  lens: Lens
  highlightSkill?: string
  highlightThread?: string
  selectedId?: string
}

type Action = Intent | { type: 'closePanel' } | { type: 'syncView'; view: View }

const pathToView = (path: string): View => (path.startsWith('/repo') ? 'repo' : 'portfolio')

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'setView':
    case 'syncView':
      return { ...s, view: a.view }
    case 'setLens':
      return { ...s, lens: a.lens, highlightSkill: undefined, highlightThread: undefined }
    case 'highlightSkill':
      return { ...s, lens: 'graph', highlightSkill: a.id, highlightThread: undefined }
    case 'highlightThread':
      return { ...s, lens: 'graph', highlightThread: a.id, highlightSkill: undefined }
    case 'openEntity':
      return { ...s, selectedId: a.id }
    case 'closePanel':
      return { ...s, selectedId: undefined }
    default:
      return s
  }
}

const Ctx = createContext<{ state: State; dispatch: (a: Action) => void } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, raw] = useReducer(reducer, {
    view: pathToView(window.location.pathname),
    lens: 'graph',
  })

  const dispatch = useCallback((a: Action) => {
    if (a.type === 'setView') {
      window.history.pushState({}, '', a.view === 'repo' ? '/repo' : '/')
    }
    if (a.type === 'downloadResume') {
      window.open('/resume.pdf', '_blank')
      return
    }
    raw(a)
  }, [])

  useEffect(() => {
    const onPop = () => raw({ type: 'syncView', view: pathToView(window.location.pathname) })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStore must be used within StoreProvider')
  return c
}
