import { createScope, type Scope } from 'animejs'
import { useEffect, useRef } from 'react'

export interface AnimeCtx {
  /** The scope root element (selectors inside setup are confined to it). */
  root: Element
  /** True when the visitor prefers reduced motion — set final states instantly. */
  reduceMotion: boolean
  scope: Scope
}

/**
 * Run an anime.js v4 scope inside a ref'd root, (re)running its setup whenever the
 * scene becomes `active`. Confines selectors to the root, wires prefers-reduced-motion
 * via the scope's mediaQueries, and reverts on unmount/scene-swap so off-screen viz
 * hold zero running animations.
 *
 * Render static SVG/DOM with class hooks (e.g. `.cat-tile`), then animate them in setup.
 */
export function useAnime<T extends Element = HTMLDivElement>(active: boolean, setup: (ctx: AnimeCtx) => void) {
  const ref = useRef<T | null>(null)
  const setupRef = useRef(setup)
  setupRef.current = setup

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run only on active flip
  useEffect(() => {
    const root = ref.current
    if (!active || !root) return
    const scope = createScope({
      root: root as unknown as HTMLElement,
      mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' },
    }).add((self) => {
      if (!self) return
      setupRef.current({ root, reduceMotion: Boolean(self.matches?.reduceMotion), scope: self })
    })
    return () => {
      scope.revert()
    }
  }, [active])

  return ref
}
