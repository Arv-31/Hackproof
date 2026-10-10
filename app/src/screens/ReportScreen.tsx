import { useEffect, useState } from 'react'
import { Button, Card, Head, sevColor } from '../components/ui'
import { READY_WEIGHT, SCENARIOS } from '../data/catalog'
import { downloadReport } from '../report/pdf'
import { useLab } from '../store'

export function ReportScreen() {
  const { s, go } = useLab()
  const tested = SCENARIOS.filter(x => x.ready)
  const blocked = tested.filter(x => s.done[x.id]).reduce((n, x) => n + x.weight, 0)
  const after = Math.round((blocked / READY_WEIGHT) * 100)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let v = 0
    const t = window.setInterval(() => { v = Math.min(after, v + 2); setShown(v); if (v >= after) clearInterval(t) }, 18)
    return () => clearInterval(t)
  }, [after])

  return (
    <section className="animate-rise">
      <Head eyebrow="Report · ShopShield" title="What we found, and what we fixed"
        lead={after < 100 ? 'Finish the other ready scenarios to reach 100%.' : 'Every tested weakness is now blocked.'} />

      <div className="mb-6 grid gap-5 md:grid-cols-2">
        <Card>
          <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-attack">Before</span>
          <div className="font-display text-7xl font-extrabold tabular-nums text-red-300">0%</div>
          <div className="h-3.5 overflow-hidden rounded-full bg-navy-3"><i className="block h-full w-0 bg-attack" /></div>
          <p className="text-ink-muted">0 of {READY_WEIGHT} weighted tests blocked</p>
        </Card>
        <Card>
          <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-defense">After</span>
          <div className="font-display text-7xl font-extrabold tabular-nums text-green-300">{shown}%</div>
          <div className="h-3.5 overflow-hidden rounded-full bg-navy-3"><i className="block h-full rounded-full bg-defense transition-all duration-1000" style={{ width: `${shown}%` }} /></div>
          <p className="text-ink-muted">{blocked} of {READY_WEIGHT} weighted tests blocked</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <h3 className="font-display text-xl font-bold">Findings</h3>
          {tested.map(x => (
            <div key={x.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-navy-line py-3 last:border-0">
              <span className={`w-2.5 self-stretch rounded-full ${x.severity === 'high' ? 'bg-attack' : 'bg-warn'}`} />
              <div>
                <h4 className="text-[17px] font-semibold">{x.title} <span className={`ml-1 text-xs font-bold uppercase ${sevColor(x.severity)}`}>{x.severity} · weight {x.weight}</span></h4>
                <p className="text-[14.5px] text-ink-muted">{x.summary}</p>
                <p className="mt-1 font-mono text-xs text-ink-dim">{s.done[x.id] ? 'attack succeeded → defense applied → retest blocked' : 'not tested yet'}</p>
              </div>
              <span className={`text-sm font-semibold ${s.done[x.id] ? 'text-defense' : 'text-ink-dim'}`}>{s.done[x.id] ? 'Fixed' : 'Open'}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h3 className="font-display text-xl font-bold">Fixes applied</h3>
          {tested.some(x => s.done[x.id]) ? (
            <ul className="grid gap-2">
              {tested.filter(x => s.done[x.id]).map(x => <li key={x.id} className="flex gap-2.5 text-ink-muted"><span className="font-bold text-defense">✓</span>{x.fix}</li>)}
            </ul>
          ) : <p className="text-ink-muted">None yet. Finish a demo to apply a fix.</p>}
          <Button className="mt-2 justify-self-start" onClick={() => downloadReport(tested.map(x => ({ ...x, fixed: !!s.done[x.id] })), after)}>Download PDF</Button>
        </Card>
      </div>
      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button tone="ghost" onClick={() => go(2)}>← Try another attack</Button>
        <Button tone="ghost" onClick={() => go(0)}>Finish</Button>
      </div>
    </section>
  )
}
