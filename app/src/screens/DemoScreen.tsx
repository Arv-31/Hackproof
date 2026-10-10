import { useEffect, useRef, useState } from 'react'
import { BehindTheScenes } from '../components/BehindTheScenes'
import { ShopShield } from '../components/ShopShield'
import { Button, LabelBadge } from '../components/ui'
import { SCENARIOS } from '../data/catalog'
import { useLab } from '../store'
import type { Phase, SitePage } from '../types'

const STAGES = [
  { key: 'normal', label: 'Normal use' },
  { key: 'attack', label: 'Attack' },
  { key: 'defend', label: 'Defend' },
  { key: 'retest', label: 'Retest' },
  { key: 'result', label: 'Result' },
]
const ORDER: (Phase | null)[] = [null, 'normal', 'attack', 'defend', 'retest']

/** The one thing to press next, with a line the presenter can read aloud. */
const NEXT: Record<string, { phase: Phase; label: string; hint: string; cls: string }> = {
  none: { phase: 'normal', label: 'Show Normal Use', hint: 'First, see how the site is supposed to work.', cls: 'from-sky-400 to-blue-600 text-white shadow-[0_10px_40px_-8px_rgba(59,130,246,.8)]' },
  normal: { phase: 'attack', label: 'Run Attack', hint: 'Send the lab test input to the weak version of the site.', cls: 'from-red-400 to-attack text-white shadow-[0_10px_40px_-8px_rgba(239,68,68,.9)]' },
  attack: { phase: 'defend', label: 'Apply Defense', hint: 'Switch on the fix. Nothing else changes.', cls: 'from-green-300 to-defense text-[#052e14] shadow-[0_10px_40px_-8px_rgba(34,197,94,.9)]' },
  defend: { phase: 'retest', label: 'Retest', hint: 'Send the exact same test again.', cls: 'from-teal-2 to-teal text-[#04201d] shadow-[0_10px_40px_-8px_rgba(20,184,166,.9)]' },
}

const STATUS: Record<Phase, { cls: string; title: string; text: string }> = {
  normal: { cls: 'border-teal/60 bg-teal/10 text-teal-100', title: 'Normal use', text: 'This is how the site should work.' },
  attack: { cls: 'border-attack/70 bg-attack/10 text-red-200', title: 'Attack succeeded · in the lab', text: 'The weakness is real. Nothing left this computer.' },
  defend: { cls: 'border-warn/70 bg-warn/10 text-amber-200', title: 'Defense applied', text: 'Now run the exact same test again.' },
  retest: { cls: 'border-defense/70 bg-defense/10 text-green-200', title: 'Attack blocked', text: 'Same test, different result. The defense works.' },
}

export function DemoScreen() {
  const { s, patch, go, play, resetScenario } = useLab()
  const scenario = SCENARIOS.find(x => x.id === s.scenarioId)!
  const [page, setPage] = useState<SitePage>(scenario.page)
  const [moment, setMoment] = useState<'attack' | 'retest' | null>(null)
  const prev = useRef(s.phase)

  useEffect(() => setPage(scenario.page), [scenario.page, s.phase])
  useEffect(() => {
    if (!s.busy && s.phase !== prev.current && (s.phase === 'attack' || s.phase === 'retest')) {
      setMoment(s.phase)
      const t = window.setTimeout(() => setMoment(null), 2200)
      prev.current = s.phase
      return () => clearTimeout(t)
    }
    prev.current = s.phase
  }, [s.phase, s.busy])

  const stageIdx = ORDER.indexOf(s.phase)
  const next = !s.busy ? NEXT[s.phase ?? 'none'] : undefined
  const status = s.phase && !s.busy ? STATUS[s.phase] : null
  const glow = s.busy ? '' : s.phase === 'attack' ? 'shadow-[0_0_0_2px_rgba(239,68,68,.8),0_0_60px_-10px_rgba(239,68,68,.7)]' : s.phase === 'retest' ? 'shadow-[0_0_0_2px_rgba(34,197,94,.8),0_0_60px_-10px_rgba(34,197,94,.7)]' : ''

  return (
    <section className="animate-rise">
      {/* header */}
      <div className="mb-5 flex flex-wrap items-end gap-4">
        <div className="mr-auto">
          <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-teal">ShopShield · {scenario.severity} severity</span>
          <h2 className="font-display text-[clamp(28px,3vw,40px)] font-bold tracking-tight">{scenario.title}</h2>
          <p className="max-w-[60ch] text-ink-muted">{scenario.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LabelBadge label={scenario.label} />
          <span className="rounded-full border border-dashed border-warn/60 px-3 py-1.5 text-xs font-semibold text-warn">Preview data</span>
        </div>
      </div>

      {/* stage track */}
      <ol className="mb-5 grid grid-cols-5 gap-2">
        {STAGES.map((st, i) => {
          const done = i < stageIdx || (i === 4 && s.phase === 'retest' && !s.busy)
          const on = i === stageIdx && s.busy
          const tone = st.key === 'attack' ? 'bg-attack' : st.key === 'defend' || st.key === 'retest' || st.key === 'result' ? 'bg-defense' : 'bg-sky-500'
          return (
            <li key={st.key} className="grid gap-2">
              <div className="h-2 overflow-hidden rounded-full bg-navy-3">
                <i className={`block h-full rounded-full transition-all duration-700 ${tone} ${done ? 'w-full' : on ? 'w-1/2 animate-pulse' : 'w-0'}`} />
              </div>
              <span className={`text-center text-[13px] font-semibold uppercase tracking-wider ${done || on ? 'text-ink' : 'text-ink-dim'}`}>{done ? '✓ ' : ''}{st.label}</span>
            </li>
          )
        })}
      </ol>

      {/* stage */}
      <div className={`grid items-start gap-5 ${s.showPanel ? 'xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]' : ''}`}>
        <div className="grid gap-3">
          <div className={`rounded-[22px] transition-shadow duration-700 ${glow}`}>
            <ShopShield page={page} onPage={setPage} scenario={scenario.id} phase={s.busy ? null : s.phase} />
          </div>
          {status && (
            <div className={`flex animate-pop flex-wrap items-baseline gap-x-3 rounded-2xl border px-5 py-3 ${status.cls}`}>
              <b className="font-display text-lg font-bold uppercase tracking-wide">{status.title}</b>
              <span className="text-[15px] opacity-90">{status.text}</span>
            </div>
          )}
        </div>
        {s.showPanel && <BehindTheScenes events={s.events} busy={s.busy} technical={s.technical} onTechnical={v => patch({ technical: v })} />}
      </div>

      {/* action dock */}
      <div className="sticky bottom-4 z-10 mt-6 flex flex-wrap items-center gap-4 rounded-[24px] border border-navy-line bg-[#091a31]/90 p-4 backdrop-blur-xl">
        {next ? (
          <>
            <button onClick={() => play(next.phase)} className={`rounded-2xl bg-gradient-to-b px-9 py-4 font-display text-[22px] font-bold transition hover:-translate-y-0.5 ${next.cls}`}>
              {next.label} →
            </button>
            <p className="min-w-[200px] flex-1 text-[15px] text-ink-muted">{next.hint}</p>
          </>
        ) : s.busy ? (
          <p className="flex flex-1 items-center gap-3 font-display text-lg text-ink-muted"><span className="h-3 w-3 animate-ping rounded-full bg-teal" />Running… watch Behind the Scenes</p>
        ) : (
          <>
            <Button onClick={() => go(4)} className="px-9 py-4 font-display text-[22px]">See the Report →</Button>
            <p className="min-w-[200px] flex-1 text-[15px] text-ink-muted">The weakness is fixed and proven. See the score change.</p>
          </>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => patch({ showPanel: !s.showPanel })} aria-pressed={s.showPanel} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-muted hover:text-ink">
            <span className={`relative h-5 w-9 rounded-full transition ${s.showPanel ? 'bg-teal' : 'bg-navy-3'}`}>
              <span className={`absolute top-[3px] h-[14px] w-[14px] rounded-full bg-ink transition-all ${s.showPanel ? 'left-[19px]' : 'left-[3px]'}`} />
            </span>
            Behind the Scenes
          </button>
          <Button tone="ghost" disabled={s.busy} onClick={resetScenario} className="px-4 py-2.5 text-[15px]">↺ Reset Scenario</Button>
          <Button tone="ghost" onClick={() => (s.returnToLab ? patch({ returnToLab: false }) : go(2))} className="px-4 py-2.5 text-[15px]">
            {s.returnToLab ? '← Assessment' : '← Attacks'}
          </Button>
        </div>
      </div>

      {moment && <Moment kind={moment} />}
    </section>
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
        <span className="text-lg text-ink-muted">{bad ? 'in the lab · on a fictional site' : 'same test · different result'}</span>
      </div>
    </div>
  )
}
