import { NetworkCanvas } from '../components/NetworkCanvas'
import { Button, Shield } from '../components/ui'
import { useLab } from '../store'

const LOOP = ['Break it', 'See it', 'Fix it', 'Prove it']

export function StartScreen() {
  const { go } = useLab()
  return (
    <section className="relative -mb-16 -mt-7 ml-[calc(50%-50vw)] grid min-h-[calc(100vh-65px)] w-screen animate-rise place-items-center overflow-hidden bg-navy-deep text-center">
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_0%,rgba(20,184,166,.18),transparent_70%)]" />
      <NetworkCanvas />
      <div className="relative grid justify-items-center gap-6 px-5 py-16">
        <Shield className="h-24 w-24 drop-shadow-[0_0_40px_rgba(20,184,166,.55)]" />
        <h1 className="font-display text-[clamp(56px,9vw,116px)] font-extrabold leading-[.95] tracking-[-.03em]">
          Hack<span className="bg-gradient-to-r from-teal to-teal-2 bg-clip-text text-transparent">Proof</span>
        </h1>
        <p className="max-w-[40ch] text-[clamp(18px,2vw,24px)] text-ink-muted">
          Watch an attack hit a pretend website, see exactly what happened inside, then watch it get stopped.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {LOOP.map((w, i) => (
            <span key={w} className="flex items-center gap-2 text-ink-muted">
              <b className={i === 0 ? 'text-attack' : i === 3 ? 'text-defense' : 'text-ink'}>{w}</b>
              {i < LOOP.length - 1 && <span className="text-ink-dim">→</span>}
            </span>
          ))}
        </div>
        <Button onClick={() => go(1)} className="rounded-[18px] px-11 py-5 text-[22px]">Start Demo →</Button>
        <span className="rounded-full bg-warn/15 px-4 py-1.5 text-[13px] text-warn">
          Every website here is fictional and runs only on this computer
        </span>
      </div>
    </section>
  )
}
