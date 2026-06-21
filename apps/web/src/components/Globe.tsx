import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'
import { useThemeMode } from '../graph/useThemeMode'

/** Lightweight WebGL globe (cobe). Eases rotation toward `target` and pins a marker there. */
export function Globe({ target }: { target: { lat: number; lng: number } | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mode = useThemeMode()
  const targetRef = useRef(target)
  targetRef.current = target

  // biome-ignore lint/correctness/useExhaustiveDependencies: recreate globe on theme change only
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let width = canvas.offsetWidth
    const onResize = () => {
      if (canvas) width = canvas.offsetWidth
    }
    window.addEventListener('resize', onResize)
    const dark = mode === 'dark'
    const cur = { phi: 0, theta: 0.2 }

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.2,
      dark: dark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: dark ? 6 : 3,
      baseColor: dark ? [0.32, 0.3, 0.27] : [0.85, 0.83, 0.78],
      markerColor: [0.88, 0.64, 0.23],
      glowColor: dark ? [0.16, 0.15, 0.12] : [0.96, 0.94, 0.89],
      markers: [],
      onRender: (state) => {
        const t = targetRef.current
        if (t) {
          const tp = -t.lng * (Math.PI / 180)
          let d = tp - cur.phi
          d = ((d + Math.PI) % (2 * Math.PI)) - Math.PI // shortest path on the circle
          cur.phi += d * 0.06
          const tt = Math.max(-0.5, Math.min(0.5, t.lat * (Math.PI / 180) * 0.5))
          cur.theta += (tt - cur.theta) * 0.06
          state.markers = [{ location: [t.lat, t.lng], size: 0.09 }]
        } else {
          cur.phi += 0.0015 // idle drift
        }
        state.phi = cur.phi
        state.theta = cur.theta
        state.width = width * 2
        state.height = width * 2
      },
    })
    return () => {
      globe.destroy()
      window.removeEventListener('resize', onResize)
    }
  }, [mode])

  return <canvas ref={canvasRef} className="aspect-square w-full max-w-[520px]" />
}
