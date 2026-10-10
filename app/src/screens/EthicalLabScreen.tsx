import { Button, Card, Head, LabelBadge, sevColor } from '../components/ui'
import { SCENARIOS } from '../data/catalog'
import { useLab } from '../store'

const PHASES = [
  { id: 'recon', name: 'Reconnaissance', short: 'Read the brief' },
  { id: 'scan', name: 'Scanning', short: 'Map the target' },
  { id: 'assess', name: 'Assessment', short: 'Rate the risks' },
  { id: 'validate', name: 'Validation', short: 'Prove it' },
  { id: 'fix', name: 'Fix & retest', short: 'Close the gaps' },
  { id: 'report', name: 'Reporting', short: 'Write it up' },
]

const SERVICES = [
  { name: 'Web shop', where: 'shopshield.lab', state: 'Public', note: 'Pages anyone can visit' },
  { name: 'Shop API', where: 'shopshield.lab/api', state: 'Public', note: 'Login, orders, reviews' },
  { name: 'Admin page', where: 'shopshield.lab/admin', state: 'Should be hidden', note: 'Reachable from outside' },
  { name: 'Database', where: 'internal only', state: 'Private', note: 'Not reachable from outside' },
]

export function EthicalLabScreen() {
  const { s, patch, openScenario, go } = useLab()
  const phase = s.labPhase
  const setPhase = (n: number) => patch({ labPhase: n })
  const findings = SCENARIOS.filter(x => x.ready)
  const P = PHASES[phase]

  return (
    <section className="animate-rise">
      <Head eyebrow="Ethical Hacking Lab · ShopShield" title="Assess the target like a professional"
        lead="You have written permission to test this one fictional site, and nothing else. Work through the six phases." />

      <ol className="mb-6 grid grid-cols-3 gap-2 md:grid-cols-6">
        {PHASES.map((p, i) => (
          <li key={p.id}>
            <button onClick={() => setPhase(i)} aria-current={i === phase ? 'step' : undefined}
              className={`w-full rounded-xl border p-3 text-left transition ${i === phase ? 'border-teal bg-navy-3' : 'border-navy-line bg-navy-2 hover:border-teal/60'}`}>
              <span className={`font-mono text-xs ${i < phase ? 'text-teal' : 'text-ink-dim'}`}>{i < phase ? '✓' : `0${i + 1}`}</span>
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-ink-dim">{p.short}</div>
            </button>
          </li>
        ))}
      </ol>

      <div key={P.id} className="animate-rise">
        {P.id === 'recon' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <h3 className="font-display text-xl font-bold">Target brief</h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[15px]">
                <dt className="text-ink-dim">Client</dt><dd>ShopShield Store (fictional)</dd>
                <dt className="text-ink-dim">In scope</dt><dd className="font-mono text-sm">shopshield.lab and its API</dd>
                <dt className="text-ink-dim">Out of scope</dt><dd>Everything else. Every real website.</dd>
                <dt className="text-ink-dim">Test type</dt><dd>Grey-box: you get one demo customer account</dd>
                <dt className="text-ink-dim">Rules</dt><dd>Limited attempts, no real data, stop if anything breaks</dd>
              </dl>
            </Card>
            <Card>
              <h3 className="font-display text-xl font-bold">What the public pages reveal</h3>
              <ul className="grid gap-2 text-ink-muted">
                <li>• The login page shows different messages for "wrong email" and "wrong password".</li>
                <li>• Order links contain a plain order number.</li>
                <li>• Reviews from anyone appear on product pages.</li>
                <li>• The page footer mentions an admin area.</li>
              </ul>
              <p className="text-sm text-ink-dim">Each of these is a clue worth checking in the next phases.</p>
            </Card>
          </div>
        )}

        {P.id === 'scan' && (
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="mr-auto font-display text-xl font-bold">Lab target map</h3>
              <span className="rounded-full border border-dashed border-warn/60 px-3 py-1 text-xs font-semibold text-warn">Scans the local lab only</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[15px]">
                <thead><tr className="text-xs uppercase tracking-wider text-ink-dim"><th className="py-2">Service</th><th>Address</th><th>Exposure</th><th>Note</th></tr></thead>
                <tbody>
                  {SERVICES.map(x => (
                    <tr key={x.name} className="border-t border-navy-line">
                      <td className="py-3 font-semibold">{x.name}</td>
                      <td className="font-mono text-sm text-ink-muted">{x.where}</td>
                      <td className={x.state === 'Should be hidden' ? 'text-warn' : x.state === 'Private' ? 'text-defense' : 'text-ink-muted'}>{x.state}</td>
                      <td className="text-ink-muted">{x.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {P.id === 'assess' && (
          <Card>
            <h3 className="font-display text-xl font-bold">Possible weaknesses, rated</h3>
            <p className="text-sm text-ink-dim">Severity = how bad it would be × how easy it is to reach.</p>
            {findings.map(f => (
              <div key={f.id} className="flex flex-wrap items-center gap-3 border-t border-navy-line py-3">
                <span className={`w-20 text-xs font-bold uppercase ${sevColor(f.severity)}`}>{f.severity}</span>
                <div className="min-w-0 flex-1"><b>{f.title}</b><p className="text-sm text-ink-muted">{f.summary}</p></div>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 border-t border-navy-line py-3">
              <span className="w-20 text-xs font-bold uppercase text-warn">medium</span>
              <div className="min-w-0 flex-1"><b>Admin page reachable</b><p className="text-sm text-ink-muted">Should only be reachable from inside the company.</p></div>
            </div>
          </Card>
        )}

        {P.id === 'validate' && (
          <Card>
            <h3 className="font-display text-xl font-bold">Prove each finding is real</h3>
            <p className="text-ink-muted">A finding only counts once it is shown to work, on the lab copy, with permission. Open one to run it.</p>
            {findings.map(f => (
              <div key={f.id} className="flex flex-wrap items-center gap-3 border-t border-navy-line py-3">
                <div className="min-w-0 flex-1"><b>{f.title}</b><p className="text-sm text-ink-muted">{s.done[f.id] ? 'Validated and fixed' : 'Not validated yet'}</p></div>
                <LabelBadge label={f.label} />
                <Button tone={s.done[f.id] ? 'ghost' : 'red'} onClick={() => { patch({ returnToLab: true }); openScenario(f.id) }}>{s.done[f.id] ? 'Run again' : 'Validate'}</Button>
              </div>
            ))}
          </Card>
        )}

        {P.id === 'fix' && (
          <Card>
            <h3 className="font-display text-xl font-bold">Fix and retest</h3>
            {findings.map(f => (
              <div key={f.id} className="grid gap-1 border-t border-navy-line py-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-4">
                <b>{f.title}</b>
                <span className="text-ink-muted">{f.fix}</span>
                <span className={`text-sm font-semibold ${s.done[f.id] ? 'text-defense' : 'text-ink-dim'}`}>{s.done[f.id] ? 'Retest: blocked' : 'Not retested'}</span>
              </div>
            ))}
          </Card>
        )}

        {P.id === 'report' && (
          <Card>
            <h3 className="font-display text-xl font-bold">Your assessment report</h3>
            <p className="text-ink-muted">The report lists what you found, how serious it is, the evidence, the fix and the retest result.</p>
            <Button className="justify-self-start" onClick={() => go(4)}>Open report →</Button>
          </Card>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button tone="ghost" onClick={() => (phase ? setPhase(phase - 1) : go(2))}>← Back</Button>
        {phase < PHASES.length - 1 && <Button onClick={() => setPhase(phase + 1)}>Next: {PHASES[phase + 1].name} →</Button>}
      </div>
    </section>
  )
}
