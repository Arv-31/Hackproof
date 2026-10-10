import { MatrixRain } from '../components/MatrixRain'
import { RiskMatrix, ScanConsole, type RiskItem, type ScanLine } from '../components/LabVisuals'
import { Button, LabelBadge } from '../components/ui'
import { DOMAINS, scenariosFor } from '../data/catalog'
import { useLab } from '../store'

const PHASES = [
  ['Brief', 'Scope and permission'],
  ['Scan', 'Map the target'],
  ['Assess', 'Rate the risks'],
  ['Validate', 'Prove each finding'],
  ['Fix & retest', 'Close the gaps'],
  ['Report', 'Write it up'],
] as const

const SCANS: Record<string, ScanLine[]> = {
  shop: [
    ['scan › target shopshield.lab (authorised · local only)', 'info'],
    ['found › web shop           public    pages anyone can visit', 'ok'],
    ['found › shop API           public    login, orders, reviews', 'ok'],
    ['found › admin page         exposed   should be hidden from outside', 'warn'],
    ['found › database           private   not reachable from outside', 'safe'],
    ['scan › done · 4 services · 1 needs attention', 'info'],
  ],
  mail: [
    ['scan › target posthaven.lab (authorised · local only)', 'info'],
    ['found › webmail            public    inbox for customers', 'ok'],
    ['found › mail gateway       public    accepts messages from anywhere', 'ok'],
    ['found › sender check       off       messages are not verified', 'warn'],
    ['found › mailbox storage    private   not reachable from outside', 'safe'],
    ['scan › done · 4 services · 1 needs attention', 'info'],
  ],
  tickets: [
    ['scan › target triptide.lab (authorised · local only)', 'info'],
    ['found › booking site       public    seat maps and checkout', 'ok'],
    ['found › seat API           public    answers every request', 'ok'],
    ['found › request limits     none      no cap per visitor', 'warn'],
    ['found › bookings database  private   not reachable from outside', 'safe'],
    ['scan › done · 4 services · 1 needs attention', 'info'],
  ],
}

/** Ethical Hacking mode: an operator console. Phases on the left, workspace on the right. */
export function ConsoleScreen() {
  const { s, patch, act, go, openScenario } = useLab()
  const domain = DOMAINS.find(d => d.id === s.domain)!
  const findings = scenariosFor(domain.id)
  const phase = s.labPhase
  const setPhase = (n: number) => patch({ labPhase: n })
  const risks: RiskItem[] = findings.map((f, i) => ({ id: f.id, title: f.title, severity: f.severity, impact: f.severity === 'high' ? 3 : 2, ease: 3 - (i % 2) }))
  const verified = findings.filter(f => s.broken[f.id]).length
  const closed = findings.filter(f => s.done[f.id]).length

  return (
    <section className="animate-rise font-mono">
      <MatrixRain intensity={0.1} className="fixed inset-0 -z-10" />
      <div className="mb-5 flex flex-wrap items-end gap-4">
        <div className="mr-auto">
          <span className="text-sm uppercase tracking-[.3em] text-teal">&gt; engagement · {domain.host}</span>
          <h2 className="glow-text font-display text-[clamp(26px,3vw,40px)] font-bold uppercase tracking-wide">{domain.client}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-widest">
          <span className="rounded border border-defense/60 px-3 py-1.5 text-defense">✓ written permission</span>
          <span className="rounded border border-teal/40 px-3 py-1.5 text-teal">verified {verified}/{findings.length}</span>
          <span className="rounded border border-teal/40 px-3 py-1.5 text-teal">closed {closed}/{findings.length}</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <ol className="panel grid content-start gap-1 p-3">
          {PHASES.map(([name, sub], i) => (
            <li key={name}>
              <button onClick={() => setPhase(i)} aria-current={i === phase ? 'step' : undefined}
                className={`grid w-full grid-cols-[34px_1fr] items-center gap-2 rounded-lg px-3 py-3 text-left transition ${i === phase ? 'bg-teal/15 text-teal shadow-glow' : 'text-ink-muted hover:bg-white/5'}`}>
                <span className={`text-sm ${i < phase ? 'text-defense' : ''}`}>{i < phase ? '[✓]' : `[${i + 1}]`}</span>
                <span><span className="block uppercase tracking-widest">{name}</span><span className="block text-xs text-ink-dim">{sub}</span></span>
              </button>
            </li>
          ))}
        </ol>

        <div key={phase} className="panel min-w-0 animate-rise p-6">
          {phase === 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              <Block title="Scope">
                <Row k="client" v={domain.client} />
                <Row k="in scope" v={`${domain.host} and its services`} />
                <Row k="out of scope" v="everything else · every real website" />
                <Row k="test type" v="grey-box · one demo account" />
                <Row k="rules" v="limited attempts · fake data · stop if anything breaks" />
              </Block>
              <Block title="Permission">
                <p className="text-ink-muted">Ethical hackers only test with written permission, inside an agreed scope. Without it, the same actions are illegal.</p>
                <div className="rounded-lg border border-defense/50 bg-defense/10 px-4 py-3 text-defense">Signed by {domain.client} · valid for this lab session</div>
              </Block>
            </div>
          )}

          {phase === 1 && <ScanConsole key={domain.id} lines={SCANS[domain.id]} />}

          {phase === 2 && (
            <>
              <p className="mb-4 text-ink-muted">Risk = impact × how easy it is for an attacker. Top-right is the most urgent.</p>
              <RiskMatrix items={risks} />
            </>
          )}

          {(phase === 3 || phase === 4) && (
            <div className="grid gap-3">
              <p className="text-ink-muted">{phase === 3 ? 'A finding only counts once you prove it works, on the lab copy, with permission.' : 'Switch the defense on for each finding, then run the same test again.'}</p>
              {findings.map(f => {
                const on = !!s.defenseOn[f.id]
                const last = s.runs.find(r => r.scenarioId === f.id)
                const running = s.busy && s.scenarioId === f.id
                return (
                  <div key={f.id} className="grid gap-3 rounded-xl border border-navy-line bg-black/50 p-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><b className="text-lg text-ink">{f.title}</b><LabelBadge label={f.label} /></div>
                      <p className="text-sm text-ink-muted">{phase === 3 ? f.summary : `Fix: ${f.fix}`}</p>
                      <p className={`mt-1 text-sm ${!last ? 'text-ink-dim' : last.outcome === 'attack' ? 'text-attack' : last.outcome === 'retest' ? 'text-defense' : 'text-teal'}`}>
                        {running ? '› running…' : !last ? '› not tested' : last.outcome === 'attack' ? '› verified: weakness is real' : last.outcome === 'retest' ? '› retest: blocked' : last.outcome === 'defend' ? '› defense on, retest needed' : '› normal behaviour checked'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase === 4 && (
                        <Button tone={on ? 'green' : 'ghost'} disabled={s.busy} onClick={() => act('defenseOn', f.id)} className="px-4 py-2.5 text-sm">🛡 {on ? 'Defense on' : 'Defense off'}</Button>
                      )}
                      <Button tone="red" disabled={s.busy} onClick={() => act('attack', f.id)} className="px-4 py-2.5 text-sm">{phase === 3 ? '▶ Validate' : '▶ Retest'}</Button>
                      <Button tone="ghost" onClick={() => openScenario(f.id)} className="px-4 py-2.5 text-sm">View live</Button>
                    </div>
                  </div>
                )
              })}
              <Terminal />
            </div>
          )}

          {phase === 5 && (
            <div className="grid gap-4">
              <p className="text-lg text-ink-muted">Your report lists each finding, its severity, the evidence, the fix and the retest result.</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <Stat k="findings" v={findings.length} />
                <Stat k="verified" v={verified} />
                <Stat k="closed" v={closed} />
              </div>
              <Button className="justify-self-start" onClick={() => go('report')}>Open report →</Button>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-navy-line bg-black/85 p-4 backdrop-blur-md">
        {phase < PHASES.length - 1
          ? <Button onClick={() => setPhase(phase + 1)} className="px-8 py-4 text-lg">Next: {PHASES[phase + 1][0]} →</Button>
          : <Button onClick={() => go('report')} className="px-8 py-4 text-lg">Open report →</Button>}
        <span className="flex-1 text-sm uppercase tracking-widest text-ink-dim">phase {phase + 1}/{PHASES.length} · {PHASES[phase][1]}</span>
        <Button tone="ghost" onClick={() => (phase ? setPhase(phase - 1) : go('home'))} className="px-4 py-2.5 text-sm">← {phase ? PHASES[phase - 1][0] : 'Engagements'}</Button>
      </div>
    </section>
  )
}

/** Live output of the current run, terminal style. */
function Terminal() {
  const { s } = useLab()
  const tone = { ok: 'text-teal', unsafe: 'text-attack', fix: 'text-warn', safe: 'text-defense' }
  return (
    <div className="rounded-xl border border-navy-line bg-black p-4 text-[13.5px] leading-7">
      <div className="mb-1 text-xs uppercase tracking-widest text-ink-dim">operator console</div>
      {s.events.length === 0 && <div className="text-ink-dim">$ waiting for a test…</div>}
      {s.events.map(e => (
        <div key={e.run_id + e.step} className={`animate-rise ${tone[e.status]}`}>
          <span className="text-ink-dim">[{e.run_id}:{e.step}]</span> {e.layer.padEnd(11, ' ')} › {e.title} <span className="text-ink-dim">· {e.detail}</span>
        </div>
      ))}
      {s.busy && <span className="inline-block h-4 w-2 animate-blink bg-teal align-middle" />}
    </div>
  )
}

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="grid content-start gap-3 rounded-xl border border-navy-line bg-black/50 p-5">
    <h3 className="text-sm uppercase tracking-[.3em] text-teal">{title}</h3>{children}
  </div>
)
const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="grid grid-cols-[120px_1fr] gap-3 text-[15px]"><span className="text-ink-dim">{k}</span><span className="text-ink">{v}</span></div>
)
const Stat = ({ k, v }: { k: string; v: number }) => (
  <div className="rounded-xl border border-navy-line bg-black/50 p-4"><div className="text-xs uppercase tracking-widest text-ink-dim">{k}</div><div className="font-display text-4xl text-teal glow-text">{v}</div></div>
)
