import { useEffect, useRef, useState } from 'react'
import { BehindTheScenes } from '../components/BehindTheScenes'
import { ShopShield } from '../components/ShopShield'
import { MatrixRain } from '../components/MatrixRain'
import { ChatStage } from '../components/stages/ChatStage'
import { InboxStage } from '../components/stages/InboxStage'
import { TrafficStage } from '../components/stages/TrafficStage'
import { Button, LabelBadge } from '../components/ui'
import { DOMAINS, SCENARIOS } from '../data/catalog'
import { useLab, type RunRecord } from '../store'
import type { Phase, SitePage } from '../types'

const STATUS: Record<Phase, { cls: string; title: string; text: string }> = {
  normal: { cls: 'border-teal/60 bg-teal/10 text-teal-2', title: 'Normal use', text: 'This is how the site should work.' },
  attack: { cls: 'border-attack/70 bg-attack/10 text-red-200', title: 'Attack succeeded · in the lab', text: 'The weakness is real. Nothing left this computer.' },
  defend: { cls: 'border-warn/70 bg-warn/10 text-amber-200', title: 'Defense switched on', text: 'Now run the same attack again.' },
  retest: { cls: 'border-defense/70 bg-defense/10 text-green-200', title: 'Attack blocked', text: 'Same attack, different result. The defense works.' },
}

const RUN_LABEL: Record<Phase, [string, string]> = {
  normal: ['Normal use', 'text-teal'],
  attack: ['Attack · succeeded', 'text-red-300'],
  defend: ['Defense switched on', 'text-amber-300'],
  retest: ['Attack · blocked', 'text-green-300'],
}

export function DemoScreen() {
  const { s, patch, go, act, resetScenario } = useLab()
  const scenario = SCENARIOS.find(x => x.id === s.scenarioId)!
  const domain = DOMAINS.find(d => d.id === scenario.domainId)!
  const defenseOn = !!s.defenseOn[scenario.id]
  const runs = s.runs.filter(r => r.scenarioId === scenario.id)
  const [page, setPage] = useState<SitePage>(scenario.page)
  const [moment, setMoment] = useState<'attack' | 'retest' | null>(null)
  const lastRun = useRef<string | undefined>(runs[0]?.id)

  useEffect(() => setPage(scenario.page), [scenario.page, s.phase])
  useEffect(() => {
    const r = runs[0]
    if (!r || r.id === lastRun.current) return
    lastRun.current = r.id
    if (r.outcome === 'attack' || r.outcome === 'retest') {
      setMoment(r.outcome)
      const t = window.setTimeout(() => setMoment(null), 2200)
      return () => clearTimeout(t)
    }
  }, [runs])

  const status = s.phase && !s.busy ? STATUS[s.phase] : null
  const glow = s.busy ? '' : s.phase === 'attack' ? 'shadow-[0_0_0_2px_rgba(239,68,68,.8),0_0_60px_-10px_rgba(239,68,68,.7)]' : s.phase === 'retest' ? 'shadow-[0_0_0_2px_rgba(34,197,94,.8),0_0_60px_-10px_rgba(34,197,94,.7)]' : ''
  const hint = s.busy ? 'Running… watch Behind the Scenes.'
    : defenseOn ? 'Defense is ON. Run the attack again and see if it still works.'
    : s.broken[scenario.id] ? 'The attack worked. Switch the defense on, then attack again.'
    : 'Try the site normally, or run the attack straight away.'

  return (
    <section className="animate-rise">
      <MatrixRain intensity={0.12} className="fixed inset-0 -z-10" />
      {/* header */}
      <div className="mb-5 flex flex-wrap items-end gap-4">
        <div className="mr-auto">
          <span className="font-mono text-sm uppercase tracking-[.3em] text-attack">&gt; Live attack · {domain.host} · {scenario.severity} severity</span>
          <h2 className="glow-text font-display text-[clamp(26px,3vw,40px)] font-bold uppercase tracking-wide">{scenario.title}</h2>
          <p className="max-w-[60ch] text-ink-muted">{scenario.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${defenseOn ? 'border-defense/60 bg-defense/15 text-green-300' : 'border-attack/50 bg-attack/10 text-red-300'}`}>
            <span className={`h-2 w-2 rounded-full ${defenseOn ? 'bg-defense' : 'bg-attack'}`} />Defense {defenseOn ? 'on' : 'off'}
          </span>
          <LabelBadge label={scenario.label} />
          <span className="rounded-full border border-dashed border-warn/60 px-3 py-1.5 text-xs font-semibold text-warn">Preview data</span>
        </div>
      </div>

      {/* stage */}
      <div className={`grid items-start gap-5 ${s.showPanel ? 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]' : ''}`}>
        <div className="grid gap-3">
          <div className={`rounded-[22px] transition-shadow duration-700 ${glow}`}>
            {scenario.stage === 'shop' && <ShopShield page={page} onPage={setPage} scenario={scenario.id} phase={s.busy ? null : s.phase} />}
            {scenario.stage === 'inbox' && <InboxStage phase={s.busy ? null : s.phase} />}
            {scenario.stage === 'traffic' && <TrafficStage phase={s.phase} busy={s.busy} />}
            {scenario.stage === 'chat' && <ChatStage phase={s.busy ? null : s.phase} />}
          </div>
          {status && (
            <div className={`flex animate-pop flex-wrap items-baseline gap-x-3 rounded-2xl border px-5 py-3 ${status.cls}`}>
              <b className="font-display text-lg font-bold uppercase tracking-wide">{status.title}</b>
              <span className="text-[15px] opacity-90">{status.text}</span>
            </div>
          )}
        </div>
        <div className="grid gap-3">
          {s.showPanel && (
            <BehindTheScenes events={s.events} busy={s.busy} technical={s.technical} onTechnical={v => patch({ technical: v })}
              scenario={scenario} phase={s.phase} />
          )}
          <RunLog runs={runs} />
        </div>
      </div>

      {/* controls: every button works at any time */}
      <div className="sticky bottom-4 z-10 mt-6 grid gap-3 rounded-[24px] border border-navy-line bg-black/85 p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <BigButton tone="blue" disabled={s.busy} onClick={() => act('normal')} icon="▶">Normal Use</BigButton>
          <BigButton tone="red" disabled={s.busy} onClick={() => act('attack')} icon="⚡">Run Attack</BigButton>

          <button onClick={() => act('defenseOn')} disabled={s.busy} aria-pressed={defenseOn}
            className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-3 transition disabled:opacity-40 ${defenseOn ? 'border-defense bg-defense/15' : 'border-navy-line bg-navy-2 hover:border-defense/60'}`}>
            <span className={`relative h-8 w-14 rounded-full transition ${defenseOn ? 'bg-defense' : 'bg-navy-3'}`}>
              <span className={`absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-white text-xs transition-all ${defenseOn ? 'left-7' : 'left-1'}`}>🛡</span>
            </span>
            <span className="text-left">
              <span className="block font-display text-lg font-bold leading-tight">Defense {defenseOn ? 'ON' : 'OFF'}</span>
              <span className="block text-xs text-ink-muted">{scenario.fix}</span>
            </span>
          </button>

          <Button tone="ghost" disabled={s.busy} onClick={resetScenario} className="px-5 py-3.5">↺ Reset</Button>
          <span className="flex-1" />
          {s.done[scenario.id] && !s.busy && <Button onClick={() => go('report')} className="px-6 py-3.5">See the Report →</Button>}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-navy-line pt-3 text-sm">
          <p className="mr-auto flex items-center gap-2 text-ink-muted">
            {s.busy && <span className="h-2.5 w-2.5 animate-ping rounded-full bg-teal" />}{hint}
          </p>
          <button onClick={() => patch({ showPanel: !s.showPanel })} aria-pressed={s.showPanel} className="flex items-center gap-2 text-ink-muted hover:text-ink">
            <span className={`relative h-5 w-9 rounded-full transition ${s.showPanel ? 'bg-teal' : 'bg-navy-3'}`}>
              <span className={`absolute top-[3px] h-[14px] w-[14px] rounded-full bg-ink transition-all ${s.showPanel ? 'left-[19px]' : 'left-[3px]'}`} />
            </span>
            Behind the Scenes
          </button>
          <button onClick={() => go(s.mode === 'ethical' ? 'console' : 'targets')} className="font-mono uppercase tracking-widest text-ink-muted hover:text-ink">
            {s.mode === 'ethical' ? '← Back to engagement' : '← Other attacks'}
          </button>
        </div>
      </div>

      {moment && <Moment kind={moment} />}
    </section>
  )
}

const BIG: Record<'blue' | 'red', string> = {
  blue: 'from-teal-2 to-teal text-black shadow-glow',
  red: 'from-red-400 to-attack text-white shadow-[0_10px_34px_-10px_rgba(239,68,68,.95)]',
}
function BigButton({ tone, icon, children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone: 'blue' | 'red'; icon: string }) {
  return (
    <button {...p} className={`flex items-center gap-2.5 rounded-xl bg-gradient-to-b px-7 py-4 font-mono text-xl uppercase tracking-wider transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 ${BIG[tone]}`}>
      <span aria-hidden>{icon}</span>{children}
    </button>
  )
}

function RunLog({ runs }: { runs: RunRecord[] }) {
  return (
    <div className="rounded-2xl border border-navy-line bg-navy-2/70 p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-display text-base font-bold">Run log</h3>
        <span className="font-mono text-xs text-ink-dim">{runs.length} run{runs.length === 1 ? '' : 's'}</span>
      </div>
      {runs.length === 0 ? <p className="text-sm text-ink-dim">Nothing run yet.</p> : (
        <ol className="grid max-h-[156px] gap-1 overflow-y-auto font-mono text-[13px]">
          {runs.map(r => {
            const [label, cls] = RUN_LABEL[r.outcome]
            return (
              <li key={r.id} className="flex animate-rise items-center gap-3 rounded-lg px-2 py-1 odd:bg-white/[.03]">
                <span className="text-ink-dim">{r.id}</span>
                <span className={`mr-auto ${cls}`}>{label}</span>
                <span className="text-xs text-ink-dim">defense {r.defenseOn ? 'on' : 'off'}</span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

/** Full-screen beat for the two moments that matter: the attack landing, and the attack being blocked. */
function Moment({ kind }: { kind: 'attack' | 'retest' }) {
  const bad = kind === 'attack'
  return (
    <div className="pointer-events-none fixed inset-0 z-40 grid place-items-center" aria-live="assertive">
      <div className={`absolute inset-0 animate-vignette ${bad ? 'bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(239,68,68,.45))]' : 'bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(34,197,94,.4))]'}`} />
      <div className={`relative grid animate-stamp justify-items-center gap-3 rounded-[28px] border-2 px-12 py-8 text-center backdrop-blur-md ${bad ? 'border-attack bg-[#2a0b10]/85' : 'border-defense bg-[#062414]/85'}`}>
        <svg viewBox="0 0 48 48" className="h-20 w-20" aria-hidden>
          <path d="M24 4 7 10v12c0 11 7.5 19 17 22 9.5-3 17-11 17-22V10L24 4Z" fill={bad ? '#EF4444' : '#22C55E'} fillOpacity=".2" stroke={bad ? '#EF4444' : '#22C55E'} strokeWidth="2.5" strokeLinejoin="round" />
          {bad
            ? <path d="m18 18 12 12m0-12L18 30" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
            : <path d="m16 24 6 6 11-12" fill="none" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
        <b className={`font-display text-[clamp(36px,5vw,64px)] font-extrabold leading-none tracking-tight ${bad ? 'text-red-300' : 'text-green-300'}`}>
          {bad ? 'ATTACK SUCCEEDED' : 'ATTACK BLOCKED'}
        </b>
        <span className="text-lg text-ink-muted">{bad ? 'in the lab · on a fictional site' : 'same attack · defense on'}</span>
      </div>
    </div>
  )
}
