import { useEffect, useState } from 'react'
import { MatrixRain } from '../components/MatrixRain'
import { ModeToggle } from '../components/Rail'
import { Icon, Shield } from '../components/ui'
import { DOMAINS, scenariosFor } from '../data/catalog'
import { useLab } from '../store'

const TAGLINE: Record<'cyber' | 'ethical', string> = {
  cyber: 'Watch a real attack hit a fictional website. See what happens inside. Switch on the defense. Prove it works.',
  ethical: 'Work like a professional tester: get permission, map the target, rate the risks, prove them, fix them and report.',
}

function useTyped(text: string) {
  const [n, setN] = useState(0)
  useEffect(() => { setN(0) }, [text])
  useEffect(() => {
    if (n >= text.length) return
    const t = window.setTimeout(() => setN(n + 1), 18)
    return () => clearTimeout(t)
  }, [n, text])
  return text.slice(0, n)
}

export function HomeScreen() {
  const { s, openDomain } = useLab()
  const typed = useTyped(TAGLINE[s.mode])
  const cyber = s.mode === 'cyber'

  return (
    <section className="relative">
      <MatrixRain intensity={0.45} className="fixed inset-0 -z-10" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.2),rgba(0,0,0,.92)_75%)]" />

      <div className="grid justify-items-center gap-6 pb-10 pt-8 text-center">
        <Shield className="h-16 w-16 animate-flicker drop-shadow-[0_0_24px_rgba(0,255,65,.8)]" />
        <h1 className="glow-text animate-flicker font-display text-[clamp(52px,9vw,120px)] font-black uppercase leading-none tracking-[.08em] text-teal">HackProof</h1>
        <p className="min-h-[3.5em] max-w-[56ch] font-mono text-[clamp(16px,1.6vw,21px)] text-ink">
          {typed}<span className="ml-0.5 inline-block h-5 w-2.5 animate-blink bg-teal align-middle" />
        </p>
        <ModeToggle big />
      </div>

      {cyber ? (
        <div key="cyber" className="animate-rise">
          <h2 className="mb-4 font-mono text-sm uppercase tracking-[.3em] text-attack">&gt; Choose a target</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {DOMAINS.map(d => {
              const list = scenariosFor(d.id)
              const fixed = list.filter(x => s.done[x.id]).length
              return (
                <button key={d.id} onClick={() => openDomain(d.id)}
                  className="brackets group panel grid content-start gap-4 p-6 text-left transition hover:-translate-y-1 hover:border-attack/70 hover:shadow-glow-red">
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-xl border border-attack/40 bg-attack/10 text-attack"><Icon d={d.icon} className="h-7 w-7" /></span>
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-dim">{d.host}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">{d.site}</h3>
                    <p className="text-ink-muted">{d.why}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-widest">
                    <span className="rounded border border-attack/50 px-2 py-1 text-attack">{list.length} attack{list.length > 1 ? 's' : ''}</span>
                    {fixed > 0 && <span className="rounded border border-defense/50 px-2 py-1 text-defense">{fixed} fixed</span>}
                  </div>
                  <span className="font-mono text-sm uppercase tracking-widest text-teal opacity-70 transition group-hover:opacity-100">Launch →</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div key="ethical" className="animate-rise">
          <h2 className="mb-4 font-mono text-sm uppercase tracking-[.3em] text-teal">&gt; Open an engagement</h2>
          <div className="panel overflow-hidden font-mono">
            <div className="grid grid-cols-[1.4fr_1fr_.8fr_.8fr_auto] gap-4 border-b border-navy-line px-5 py-3 text-xs uppercase tracking-widest text-ink-dim max-md:hidden">
              <span>Client</span><span>Scope</span><span>Findings</span><span>Permission</span><span />
            </div>
            {DOMAINS.map((d, i) => {
              const list = scenariosFor(d.id)
              return (
                <button key={d.id} onClick={() => openDomain(d.id)}
                  className="grid w-full items-center gap-2 border-b border-navy-line/60 px-5 py-5 text-left transition last:border-0 hover:bg-teal/[.06] md:grid-cols-[1.4fr_1fr_.8fr_.8fr_auto] md:gap-4">
                  <span className="flex items-center gap-3 text-lg text-ink"><span className="text-ink-dim">ENG-0{i + 1}</span>{d.client}</span>
                  <span className="text-teal">{d.host}</span>
                  <span className="text-ink-muted">{list.length} to verify</span>
                  <span className="text-defense">✓ signed</span>
                  <span className="rounded border border-teal/60 px-3 py-1.5 text-sm uppercase tracking-widest text-teal">Open ›</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <p className="mt-10 text-center font-mono text-xs uppercase tracking-[.3em] text-ink-dim">All websites are fictional · runs only on this computer · presenter: ctrl + shift + p</p>
    </section>
  )
}
