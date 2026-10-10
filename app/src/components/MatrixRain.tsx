import { useEffect, useRef } from 'react'

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789HACKPROOF<>/{}=+*'

/** Falling-glyph background. `intensity` 0–1 controls opacity and speed. */
export function MatrixRain({ intensity = 0.35, className = 'fixed inset-0 -z-10' }: { intensity?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const size = 16
    let cols = 0, drops: number[] = [], raf = 0, last = 0

    const resize = () => {
      c.width = c.clientWidth; c.height = c.clientHeight
      cols = Math.ceil(c.width / size)
      drops = Array.from({ length: cols }, () => Math.random() * -60)
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (t - last < 55 - intensity * 20) return
      last = t
      ctx.fillStyle = 'rgba(0,0,0,0.08)'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.font = `${size}px "Share Tech Mono", monospace`
      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]
        const y = drops[i] * size
        ctx.fillStyle = '#c8ffd4'
        ctx.fillText(ch, i * size, y)
        ctx.fillStyle = 'rgba(0,255,65,.75)'
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * size, y - size)
        if (y > c.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 1
      }
    }
    if (still) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height) } else raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [intensity])

  return <canvas ref={ref} aria-hidden className={`pointer-events-none h-full w-full ${className}`} style={{ opacity: intensity }} />
}
