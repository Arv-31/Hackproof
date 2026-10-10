import { useLab, type View } from '../store'
import type { Mode } from '../types'
import { Shield } from './ui'

const FLOW: Record<Mode, { view: View; label: string }[]> = {
  cyber: [{ view: 'home', label: 'Home' }, { view: 'targets', label: 'Target' }, { view: 'demo', label: 'Live attack' }, { view: 'report', label: 'Report' }],
  ethical: [{ view: 'home', label: 'Home' }, { view: 'console', label: 'Engagement' }, { view: 'report', label: 'Report' }],
}

export function ModeToggle({ big = false }: { big?: boolean }) {
  const { s, setMode, go } = useLab()
  const opts: [Mode, string, string][] = [['cyber', 'Cyber Security', 'attack · defend'], ['ethical', 'Ethical Hacking', 'assess · report']]
  return (
    <div role="radiogroup" aria-label="Mode" className={`relative grid grid-cols-2 rounded-xl border border-teal/40 bg-black/70 p-1 ${big ? 'w-full max-w-[640px]' : ''}`}>
      <span className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ${s.mode === 'cyber' ? 'left-1 bg-attack shadow-glow-red' : 'left-[calc(50%+3px)] bg-teal shadow-glow'}`} />
      {opts.map(([m, label, sub]) => (
        <button key={m} role="radio" aria-checked={s.mode === m} onClick={() => { setMode(m); if (s.view !== 'home') go('home') }}
          className={`relative z-10 rounded-lg font-mono uppercase tracking-widest transition ${big ? 'px-6 py-4 text-lg' : 'px-4 py-1.5 text-xs'} ${s.mode === m ? 'text-black' : 'text-ink-muted hover:text-ink'}`}>
          {label}
          {big && <span className={`block text-xs normal-case tracking-normal ${s.mode === m ? 'text-black/70' : 'text-ink-dim'}`}>{sub}</span>}
        </button>
      ))}
    </div>
  )
}

export function Rail() {
  const { s, go } = useLab()
  const flow = FLOW[s.mode]
  const at = flow.findIndex(f => f.view === s.view)
  return (
    <header className="sticky top-0 z-30 border-b border-navy-line bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-5 px-5 py-3">
        <button onClick={() => go('home')} className="flex items-center gap-2.5 font-display text-lg font-bold uppercase tracking-widest text-teal glow-text">
          <Shield className="h-7 w-7" /> HackProof
        </button>
        <nav aria-label="Progress" className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto font-mono text-xs uppercase tracking-widest">
          {flow.map((f, i) => (
            <button key={f.view} onClick={() => go(f.view)} className={`flex items-center gap-2 whitespace-nowrap rounded px-2 py-1 transition ${i === at ? 'bg-teal/15 text-teal' : i < at ? 'text-teal/70' : 'text-ink-dim hover:text-ink-muted'}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>{f.label}
              {i < flow.length - 1 && <span className="ml-2 text-ink-dim">/</span>}
            </button>
          ))}
        </nav>
        <ModeToggle />
        <span className="hidden rounded border border-dashed border-warn/60 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-warn lg:inline">Fictional lab · offline</span>
      </div>
    </header>
  )
}
