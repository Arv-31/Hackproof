import { useState } from 'react'
import type { EventStatus, Layer, Phase, Scenario, TraceEvent } from '../types'
import { RequestInspector, TrafficView } from './ToolViews'

const TABS = [['layers', 'Layers'], ['traffic', 'Traffic'], ['request', 'Request inspector']] as const
type Tab = typeof TABS[number][0]

const LAYERS: { id: Layer; name: string; short: string }[] = [
  { id: 'browser', name: 'Browser', short: 'WEB' },
  { id: 'api', name: 'API', short: 'API' },
  { id: 'server_code', name: 'Server code', short: 'SRV' },
  { id: 'database', name: 'Database', short: 'DB' },
  { id: 'verdict', name: 'Verdict', short: '!' },
]

const TONE: Record<EventStatus, { ring: string; node: string; rgb: string }> = {
  ok: { ring: 'border-teal/70', node: 'bg-teal text-[#04201d]', rgb: '20,184,166' },
  unsafe: { ring: 'border-attack/80', node: 'bg-attack text-white', rgb: '239,68,68' },
  fix: { ring: 'border-warn/80', node: 'bg-warn text-[#2b1a00]', rgb: '245,158,11' },
  safe: { ring: 'border-defense/80', node: 'bg-defense text-[#052e14]', rgb: '34,197,94' },
}

interface Props {
  events: TraceEvent[]
  technical: boolean
  onTechnical: (v: boolean) => void
  busy: boolean
  scenario: Scenario
  phase: Phase | null
}

/** The five layers drawn as a pipeline. A glowing packet travels down to the newest event. */
export function BehindTheScenes({ events, technical, onTechnical, busy, scenario, phase }: Props) {
  const [tab, setTab] = useState<Tab>('layers')
  const runId = events[0]?.run_id
  const lit = events.length
  const last = events[lit - 1]

  return (
    <aside className="relative grid gap-3 overflow-hidden rounded-[24px] border border-navy-line bg-navy-deep/80 p-5">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(36,71,111,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(36,71,111,.25)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${busy ? 'animate-ping bg-teal' : lit ? 'bg-teal' : 'bg-ink-dim'}`} />
          <div>
            <h3 className="font-display text-xl font-bold">Behind the Scenes</h3>
            <span className="font-mono text-xs text-ink-dim">{runId ? `${busy ? 'streaming' : 'complete'} · run ${runId}` : 'waiting for a run'}</span>
          </div>
        </div>
        <div className="flex rounded-full border border-navy-line bg-navy-2 p-1" role="group" aria-label="Detail level">
          {([['Simple', false], ['Technical', true]] as const).map(([label, v]) => (
            <button key={label} onClick={() => onTechnical(v)} aria-pressed={technical === v}
              className={`rounded-full px-3.5 py-1 text-[13px] font-semibold transition ${technical === v ? 'bg-teal text-[#04201d]' : 'text-ink-muted'}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="relative flex gap-1 border-b border-navy-line" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-3.5 py-2 text-sm font-semibold transition ${tab === id ? 'border-teal text-ink' : 'border-transparent text-ink-dim hover:text-ink-muted'}`}>{label}</button>
        ))}
      </div>

      {tab === 'traffic' && <div className="relative"><TrafficView events={events} /></div>}
      {tab === 'request' && <div className="relative"><RequestInspector scenario={scenario} phase={busy ? null : phase} /></div>}
      <div className={tab === 'layers' ? 'relative' : 'hidden'}>
        <div className="grid gap-3">
          {LAYERS.map((L, i) => {
            const e = events.find(x => x.layer === L.id)
            const t = e ? TONE[e.status] : null
            const newest = e && e === last
            const next = events.find(x => x.layer === LAYERS[i + 1]?.id)
            return (
              <div key={L.id} className={`relative grid grid-cols-[46px_minmax(0,1fr)] items-start gap-3 transition-all duration-500 ${e ? 'opacity-100' : 'opacity-40'}`}>
                {i < LAYERS.length - 1 && (
                  <span className="absolute -bottom-3 left-[21px] top-[46px] w-[3px] rounded-full transition-all duration-500"
                    style={next ? { background: `rgb(${TONE[next.status].rgb})`, boxShadow: `0 0 12px rgba(${TONE[next.status].rgb},.7)` } : { background: '#163660' }} />
                )}
                <div className={`relative z-10 grid h-[46px] w-[46px] place-items-center rounded-full border-4 border-navy-deep font-mono text-[11px] font-bold transition-all duration-500 ${t ? t.node : 'bg-navy-3 text-ink-dim'}`}
                  style={newest ? { boxShadow: `0 0 0 6px rgba(${t!.rgb},.18), 0 0 28px rgba(${t!.rgb},.7)` } : undefined}>
                  {L.short}
                </div>
                <div className={`min-w-0 rounded-2xl border bg-navy-2/90 px-4 py-3 backdrop-blur transition-all duration-500 ${t ? t.ring : 'border-navy-line'} ${newest ? 'translate-x-0' : e ? '' : 'translate-x-1'}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-dim">{i + 1} · {L.name}</span>
                    {e && <span className="font-mono text-[11px] text-ink-dim">step {e.step}</span>}
                  </div>
                  <div className="text-[16px] font-semibold">{e ? e.title : 'Waiting…'}</div>
                  {e && <p className="text-[14.5px] leading-snug text-ink-muted">{e.plain}</p>}
                  {e && technical && (
                    <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-navy-line bg-navy-deep px-3 py-2 font-mono text-[12.5px] text-sky-200">
                      {e.detail}{'\n'}<span className="text-ink-dim">version: {e.version} · mode: {e.mode}</span>
                    </pre>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
