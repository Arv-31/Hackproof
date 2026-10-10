import { RiskMatrix, ScanConsole, type RiskItem } from '../components/LabVisuals'
import { Button, Card, LabelBadge } from '../components/ui'
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

const RISKS: RiskItem[] = [
  { id: 'login', title: 'Login weakness', severity: 'high', impact: 3, ease: 3 },
  { id: 'orders', title: 'Order privacy weakness', severity: 'high', impact: 3, ease: 2 },
  { id: 'reviews', title: 'Review weakness', severity: 'medium', impact: 2, ease: 2 },
  { id: 'admin', title: 'Admin page reachable', severity: 'medium', impact: 2, ease: 1 },
]

export function EthicalLabScreen() {
  const { s, patch, openScenario, go } = useLab()
  const phase = s.labPhase
  const setPhase = (n: number) => patch({ labPhase: n })
  const findings = SCENARIOS.filter(x => x.ready)
  const P = PHASES[phase]

  return (
    <section className="animate-rise">
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="mr-auto">
          <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-teal">Ethical Hacking Lab · ShopShield</span>
          <h2 className="font-display text-[clamp(28px,3vw,40px)] font-bold tracking-tight">Assess the target like a professional</h2>
        </div>
        <span className="rounded-full border border-defense/50 bg-defense/10 px-3 py-1.5 text-xs font-semibold text-green-300">✓ Written permission · this site only</span>
      </div>

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
              <h3 className="mr-auto font-display text-xl font-bold">Mapping the lab target</h3>
              <span className="rounded-full border border-dashed border-warn/60 px-3 py-1 text-xs font-semibold text-warn">Scans the local lab only</span>
            </div>
            <ScanConsole />
          </Card>
        )}

        {P.id === 'assess' && (
          <Card>
            <h3 className="font-display text-xl font-bold">Rate each weakness</h3>
            <p className="text-ink-muted">Risk = how bad it would be × how easy it is for an attacker. Top right is the most urgent.</p>
            <RiskMatrix items={RISKS} />
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

      <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center gap-4 rounded-[24px] border border-navy-line bg-[#091a31]/90 p-4 backdrop-blur-xl">
        {phase < PHASES.length - 1 ? (
          <button onClick={() => setPhase(phase + 1)}
            className="rounded-2xl bg-gradient-to-b from-teal-2 to-teal px-9 py-4 font-display text-[22px] font-bold text-[#04201d] shadow-[0_10px_40px_-8px_rgba(20,184,166,.9)] transition hover:-translate-y-0.5">
            Next: {PHASES[phase + 1].name} →
          </button>
        ) : (
          <Button onClick={() => go(4)} className="px-9 py-4 font-display text-[22px]">Open report →</Button>
        )}
        <p className="min-w-[200px] flex-1 text-[15px] text-ink-muted">Phase {phase + 1} of {PHASES.length} · {P.short}</p>
        <Button tone="ghost" onClick={() => (phase ? setPhase(phase - 1) : go(2))} className="px-4 py-2.5 text-[15px]">← {phase ? PHASES[phase - 1].name : 'Targets'}</Button>
      </div>
    </section>
  )
}
