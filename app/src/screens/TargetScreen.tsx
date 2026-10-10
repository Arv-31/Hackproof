import { Button, Head, Icon, LabelBadge, sevColor } from '../components/ui'
import { DOMAINS, scenariosFor } from '../data/catalog'
import { useLab } from '../store'

/** Cyber Security mode: pick which attack to watch on the chosen site. */
export function TargetScreen() {
  const { s, go, openScenario } = useLab()
  const domain = DOMAINS.find(d => d.id === s.domain)!
  const list = scenariosFor(domain.id)

  return (
    <section className="animate-rise">
      <Head eyebrow={`Target · ${domain.host}`} title={domain.site} lead={domain.why} />

      <div className="mb-5 flex flex-wrap gap-5 font-mono text-sm text-ink-muted">
        <span className="flex items-center gap-2"><LabelBadge label="executed" /> really runs inside the lab</span>
        <span className="flex items-center gap-2"><LabelBadge label="simulated" /> safe model with dummy data</span>
        <span className="flex items-center gap-2"><LabelBadge label="explained" /> guided walkthrough</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((sc, i) => (
          <button key={sc.id} onClick={() => openScenario(sc.id)}
            className="brackets group panel grid content-start gap-3 p-6 text-left transition hover:-translate-y-0.5 hover:border-attack/70 hover:shadow-glow-red">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-ink-dim">ATK-{String(i + 1).padStart(2, '0')}</span>
              <span className={`font-mono text-xs uppercase tracking-widest ${sevColor(sc.severity)}`}>● {sc.severity}</span>
              <span className="flex-1" />
              {s.done[sc.id] && <span className="rounded border border-defense/60 px-2 py-1 font-mono text-xs uppercase tracking-widest text-defense">Fixed</span>}
              <LabelBadge label={sc.label} />
            </div>
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">{sc.title}</h3>
            <p className="text-lg text-ink-muted">{sc.summary}</p>
            <div className="flex items-center gap-2 font-mono text-sm text-ink-dim">
              <Icon d="M12 3 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" className="h-4 w-4 text-defense" /> Defense: {sc.fix}
            </div>
            <span className="font-mono text-sm uppercase tracking-widest text-attack opacity-70 transition group-hover:opacity-100">▶ Run this attack</span>
          </button>
        ))}
      </div>
      <div className="mt-8"><Button tone="ghost" onClick={() => go('home')}>← All targets</Button></div>
    </section>
  )
}
