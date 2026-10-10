import { useState } from 'react'
import { Button, Head, Icon, LabelBadge, sevColor } from '../components/ui'
import { DOMAINS, SCENARIOS } from '../data/catalog'
import { useLab } from '../store'

export function TargetScreen() {
  const { s, patch, go, openScenario } = useLab()
  const [msg, setMsg] = useState('')
  const domain = DOMAINS.find(d => d.id === s.domain)

  return (
    <section className="animate-rise">
      <Head eyebrow="Pick a target" title="Which kind of website?" lead="Every site below is made up. None of them are real companies." />

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))]">
        {DOMAINS.map(d => {
          const on = d.id === s.domain
          return (
            <button
              key={d.id}
              onClick={() => (d.ready ? (patch({ domain: d.id }), setMsg('')) : setMsg(`${d.site} is coming in a later build.`))}
              aria-pressed={on}
              className={`grid content-start gap-2 rounded-[18px] border p-5 text-left transition hover:-translate-y-0.5 ${on ? 'border-teal bg-navy-3 shadow-[0_0_0_4px_rgba(20,184,166,.15)]' : 'border-navy-line bg-navy-2 hover:border-teal'} ${d.ready ? '' : 'opacity-55'}`}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-navy-3 text-teal"><Icon d={d.icon} /></div>
              <h3 className="font-display text-xl font-bold">{d.name}</h3>
              <p className="text-sm text-ink-muted"><b className="text-ink">{d.site}</b>. {d.why}</p>
              <span className={`justify-self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${d.ready ? 'bg-teal/15 text-teal' : 'bg-navy-3 text-ink-dim'}`}>{d.ready ? 'Ready' : 'Coming soon'}</span>
            </button>
          )
        })}
      </div>
      {msg && <p role="status" className="mt-4 text-warn">{msg}</p>}

      {domain && (
        <div className="mt-10 animate-rise">
          <div className="mb-4 flex flex-wrap items-end gap-4">
            <h3 className="mr-auto font-display text-2xl font-bold">Attacks on {domain.site}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-ink-muted">
              <span className="flex items-center gap-2"><LabelBadge label="executed" /> really runs, inside the lab</span>
              <span className="flex items-center gap-2"><LabelBadge label="simulated" /> safe model</span>
              <span className="flex items-center gap-2"><LabelBadge label="explained" /> walkthrough</span>
            </div>
          </div>
          <div className="grid gap-3">
            {SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => (sc.ready ? openScenario(sc.id) : setMsg(`"${sc.title}" is planned for a later build.`))}
                className={`grid items-center gap-4 rounded-[18px] border border-navy-line bg-navy-2 px-6 py-5 text-left transition hover:border-teal sm:grid-cols-[1fr_auto] ${sc.ready ? '' : 'opacity-55'}`}
              >
                <div>
                  <h4 className="font-display text-xl font-semibold">{sc.title}</h4>
                  <p className="text-ink-muted">{sc.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {s.done[sc.id] && <span className="rounded-full bg-defense/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-green-300">Fixed</span>}
                  <span className={`text-xs font-bold uppercase tracking-wider ${sevColor(sc.severity)}`}>{sc.severity}</span>
                  {sc.ready ? <LabelBadge label={sc.label} /> : <span className="rounded-full bg-navy-3 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-dim">Later</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8"><Button tone="ghost" onClick={() => go(1)}>← Back</Button></div>
    </section>
  )
}
