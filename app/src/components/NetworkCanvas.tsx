import { useEffect, useRef } from 'react'

/** Ambient background: a slow network of nodes. Now and then a link flashes red, then turns green. */
export function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const nodes = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0006, vy: (Math.random() - .5) * .0006 }))
    let pulse = { a: 0, b: 1, t: 0 }

    const size = () => {
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    window.addEventListener('resize', size)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > 1) n.vx *= -1
        if (n.y < 0 || n.y > 1) n.vy *= -1
      }
      const max = Math.min(w, h) * .22
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h)
        if (d > max) continue
        const isPulse = (i === pulse.a && j === pulse.b)
        const color = isPulse ? (pulse.t < .5 ? '239,68,68' : '34,197,94') : '20,184,166'
        ctx.strokeStyle = `rgba(${color},${isPulse ? .9 : (1 - d / max) * .22})`
        ctx.lineWidth = isPulse ? 2 : 1
        ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke()
      }
      for (const n of nodes) {
        ctx.fillStyle = 'rgba(45,212,191,.55)'
        ctx.beginPath(); ctx.arc(n.x * w, n.y * h, 1.8, 0, Math.PI * 2); ctx.fill()
      }
      pulse.t += .006
      if (pulse.t > 1) {
        const a = Math.floor(Math.random() * nodes.length)
        let b = 0, best = Infinity
        nodes.forEach((n, k) => { const d = Math.hypot(n.x - nodes[a].x, n.y - nodes[a].y); if (k !== a && d < best) { best = d; b = k } })
        pulse = { a: Math.min(a, b), b: Math.max(a, b), t: 0 }
      }
      if (!still) raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size) }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
}
