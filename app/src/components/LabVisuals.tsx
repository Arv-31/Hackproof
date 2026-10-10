import { useEffect, useState } from 'react'
import type { Severity } from '../types'

export type ScanLine = [string, 'info' | 'ok' | 'warn' | 'safe']
const LINE_TONE = { info: 'text-teal', ok: 'text-ink', warn: 'text-warn', safe: 'text-defense' }

/** Fictional scan of the local lab target, typed out line by line. */
export function ScanConsole({ lines: SCAN_LINES }: { lines: ScanLine[] }) {
  const [n, setN] = useState(0)
  const [sweep, setSweep] = useState(true)
  useEffect(() => {
    if (n >= SCAN_LINES.length) { setSweep(false); return }
    const t = window.setTimeout(() => setN(n + 1), n === 0 ? 300 : 650)
    return () => clearTimeout(t)
  }, [n, SCAN_LINES.length])

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="relative grid aspect-square max-w-[260px] place-items-center overflow-hidden rounded-full border border-teal/40 bg-navy-deep">
        {[1, 0.72, 0.44].map(r => <span key={r} className="absolute rounded-full border border-teal/20" style={{ width: `${r * 100}%`, height: `${r * 100}%` }} />)}
        <span className="absolute h-px w-full bg-teal/15" /><span className="absolute h-full w-px bg-teal/15" />
        {sweep && <span className="absolute inset-0 animate-[spin_2.4s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,rgba(20,184,166,.45),transparent_25%)]" />}
        {[[30, 32, 'bg-teal'], [68, 40, 'bg-teal'], [62, 72, 'bg-warn'], [36, 66, 'bg-defense']].slice(0, Math.max(0, n - 2)).map(([x, y, c]) => (
          <span key={`${x}`} className={`absolute h-3 w-3 animate-pop rounded-full ${c} shadow-[0_0_14px_currentColor]`} style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
        <span className="relative font-mono text-xs text-teal">{sweep ? 'scanning…' : 'complete'}</span>
      </div>
      <div className="min-w-0 rounded-2xl border border-navy-line bg-[#040d1b] p-4 font-mono text-[13.5px] leading-7">
        <div className="mb-2 flex gap-1.5">{['bg-attack', 'bg-warn', 'bg-defense'].map(c => <i key={c} className={`h-3 w-3 rounded-full ${c} opacity-70`} />)}</div>
        <div className="overflow-x-auto">
          {SCAN_LINES.slice(0, n).map(([t, tone]) => <div key={t} className={`animate-rise whitespace-pre ${LINE_TONE[tone]}`}>{t}</div>)}
          {sweep && <span className="inline-block h-4 w-2 animate-pulse bg-teal align-middle" />}
        </div>
      </div>
    </div>
  )
}

export interface RiskItem { id: string; title: string; severity: Severity; impact: number; ease: number }

/** Impact × ease grid. Top-right is the most urgent. */
export function RiskMatrix({ items }: { items: RiskItem[] }) {
  const cellTone = (x: number, y: number) => {
    const score = x + y
    return score >= 5 ? 'bg-attack/35' : score >= 4 ? 'bg-attack/15' : score >= 3 ? 'bg-navy-3' : 'bg-navy-2'
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <div className="grid grid-cols-[28px_1fr] gap-2">
        <span className="grid place-items-center text-xs uppercase tracking-widest text-ink-dim [writing-mode:vertical-rl] rotate-180">Impact →</span>
        <div>
          <div className="grid aspect-square grid-cols-3 grid-rows-3 gap-1.5">
            {[3, 2, 1].map(y => [1, 2, 3].map(x => (
              <div key={`${x}${y}`} className={`relative grid place-items-center rounded-lg ${cellTone(x, y)}`}>
                <div className="flex flex-wrap justify-center gap-1 p-1">
                  {items.filter(i => i.impact === y && i.ease === x).map(i => (
                    <span key={i.id} title={i.title} className={`grid h-9 w-9 animate-pop place-items-center rounded-full font-display text-sm font-bold ${i.severity === 'high' ? 'bg-attack text-white' : 'bg-warn text-[#2b1a00]'}`}>
                      {items.indexOf(i) + 1}
                    </span>
                  ))}
                </div>
              </div>
            )))}
          </div>
          <div className="mt-2 text-center text-xs uppercase tracking-widest text-ink-dim">Ease for an attacker →</div>
        </div>
      </div>
      <ol className="grid content-start gap-3">
        {items.map((i, k) => (
          <li key={i.id} className="flex items-center gap-3 rounded-xl border border-navy-line bg-navy-2 px-4 py-3">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${i.severity === 'high' ? 'bg-attack text-white' : 'bg-warn text-[#2b1a00]'}`}>{k + 1}</span>
            <b className="mr-auto">{i.title}</b>
            <span className={`text-xs font-bold uppercase tracking-wider ${i.severity === 'high' ? 'text-attack' : 'text-warn'}`}>{i.severity}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
