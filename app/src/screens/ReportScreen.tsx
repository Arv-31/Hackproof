import { useEffect, useState } from 'react'
import { Button, Head, LabelBadge, sevColor } from '../components/ui'
import { DOMAINS, scenariosFor, weightFor } from '../data/catalog'
import { downloadReport } from '../report/pdf'
import { useLab } from '../store'

export function ReportScreen() {
  const { s, go } = useLab()
  const domain = DOMAINS.find(d => d.id === s.domain)!
  const tested = scenariosFor(domain.id)
  const total = weightFor(domain.id)
  const blocked = tested.filter(x => s.done[x.id]).reduce((n, x) => n + x.weight, 0)
  const after = Math.round((blocked / total) * 100)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let v = 0
    const t = window.setInterval(() => { v = Math.min(after, v + 2); setShown(v); if (v >= after) clearInterval(t) }, 18)
    return () => clearInterval(t)
  }, [after])

  return (
    <section className="animate-rise">
      <Head eyebrow={`Report · ${domain.host}`} title={s.mode === 'ethical' ? `Assessment · ${domain.client}` : `Security report · ${domain.site}`}
        lead={after < 100 ? 'Show each attack working, then blocked, to reach 100%.' : 'Every tested weakness is now blocked.'} />

      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <Score label="Before" value={0} sub={`0 of ${total} weighted tests blocked`} red />
        <Score label="After" value={shown} sub={`${blocked} of ${total} weighted tests blocked`} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel grid content-start gap-1 p-6">
          <h3 className="mb-2 font-mono text-sm uppercase tracking-[.3em] text-teal">Findings</h3>
          {tested.map(x => (
            <div key={x.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-navy-line py-4 last:border-0">
              <span className={`w-1.5 self-stretch rounded-full ${x.severity === 'high' ? 'bg-attack' : 'bg-warn'}`} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-semibold text-ink">{x.title}</h4>
                  <span className={`font-mono text-xs uppercase tracking-widest ${sevColor(x.severity)}`}>{x.severity} · w{x.weight}</span>
                  <LabelBadge label={x.label} />
                </div>
                <p className="text-ink-muted">{x.summary}</p>
                <p className="mt-1 font-mono text-xs text-ink-dim">{s.done[x.id] ? 'evidence: attack succeeded → defense on → retest blocked' : s.broken[x.id] ? 'evidence: attack succeeded · not yet fixed' : 'not tested yet'}</p>
              </div>
              <span className={`font-mono text-sm uppercase tracking-widest ${s.done[x.id] ? 'text-defense' : 'text-attack'}`}>{s.done[x.id] ? 'Fixed' : 'Open'}</span>
            </div>
          ))}
        </div>
        <div className="panel grid content-start gap-4 p-6">
          <h3 className="font-mono text-sm uppercase tracking-[.3em] text-teal">Fixes applied</h3>
          {tested.some(x => s.done[x.id]) ? (
            <ul className="grid gap-2">
              {tested.filter(x => s.done[x.id]).map(x => <li key={x.id} className="flex gap-2.5 text-ink-muted"><span className="text-defense">✓</span>{x.fix}</li>)}
            </ul>
          ) : <p className="text-ink-muted">None yet. Run an attack, switch the defense on, then run it again.</p>}
          <Button className="justify-self-start" onClick={() => downloadReport(tested.map(x => ({ ...x, fixed: !!s.done[x.id] })), after, domain.site)}>⤓ Download PDF</Button>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button tone="ghost" onClick={() => go(s.mode === 'ethical' ? 'console' : 'targets')}>← Back</Button>
        <Button tone="ghost" onClick={() => go('home')}>Finish</Button>
      </div>
    </section>
  )
}

function Score({ label, value, sub, red }: { label: string; value: number; sub: string; red?: boolean }) {
  return (
    <div className={`panel brackets grid gap-3 p-6 ${red ? '' : 'shadow-glow'}`}>
      <span className={`font-mono text-sm uppercase tracking-[.3em] ${red ? 'text-attack' : 'text-defense'}`}>{label}</span>
      <div className={`font-display text-7xl font-black tabular-nums ${red ? 'glow-red text-attack' : 'glow-text text-defense'}`}>{value}%</div>
      <div className="h-3 overflow-hidden rounded-full bg-navy-3">
        <i className={`block h-full rounded-full transition-all duration-1000 ${red ? 'bg-attack' : 'bg-defense'}`} style={{ width: `${value}%` }} />
      </div>
      <p className="font-mono text-sm text-ink-muted">{sub}</p>
    </div>
  )
}
