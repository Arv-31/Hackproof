import type { EventStatus, Layer, TraceEvent } from '../types'

const LAYERS: { id: Layer; name: string; short: string }[] = [
  { id: 'browser', name: 'Browser', short: 'WEB' },
  { id: 'api', name: 'API', short: 'API' },
  { id: 'server_code', name: 'Server code', short: 'SRV' },
  { id: 'database', name: 'Database', short: 'DB' },
  { id: 'verdict', name: 'Verdict', short: '!' },
]

const TONE: Record<EventStatus, { border: string; icon: string }> = {
  ok: { border: 'border-teal', icon: 'bg-teal/15 text-teal' },
  unsafe: { border: 'border-attack', icon: 'bg-attack/15 text-red-300' },
  fix: { border: 'border-warn', icon: 'bg-warn/15 text-warn' },
  safe: { border: 'border-defense', icon: 'bg-defense/15 text-green-300' },
}

interface Props {
  events: TraceEvent[]
  technical: boolean
  onTechnical: (v: boolean) => void
}

export function BehindTheScenes({ events, technical, onTechnical }: Props) {
  const runId = events[0]?.run_id
  return (
    <aside className="grid gap-2.5 rounded-[20px] border border-navy-line bg-navy-2 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-xl font-bold">Behind the Scenes</h3>
          <span className="font-mono text-xs text-ink-dim">{runId ? `run ${runId}` : 'waiting for a run'}</span>
        </div>
        <div className="flex gap-1.5" role="group" aria-label="Detail level">
          {[['Simple', false], ['Technical', true]].map(([label, v]) => (
            <button key={String(label)} onClick={() => onTechnical(v as boolean)} aria-pressed={technical === v}
              className={`rounded-lg px-3 py-1.5 text-[13px] ${technical === v ? 'bg-teal/15 font-semibold text-teal' : 'bg-navy-3 text-ink-muted'}`}>{label}</button>
          ))}
        </div>
      </div>

      {LAYERS.map((L, i) => {
        const e = events.find(x => x.layer === L.id)
        const tone = e ? TONE[e.status] : null
        return (
          <div key={L.id}
            className={`grid grid-cols-[40px_minmax(0,1fr)] gap-3 rounded-xl border bg-navy p-3 transition-all duration-500 ${e ? `translate-x-0 opacity-100 ${tone!.border}` : 'translate-x-1.5 border-navy-line opacity-35'}`}>
            <div className={`grid h-10 w-10 place-items-center rounded-lg font-mono text-[11px] font-semibold ${tone ? tone.icon : 'bg-navy-3 text-ink-muted'}`}>{L.short}</div>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[.1em] text-ink-dim">{i + 1} · {L.name}</div>
              <div className="font-semibold">{e ? e.title : '—'}</div>
              <p className="text-[14.5px] text-ink-muted">{e ? e.plain : 'Waiting…'}</p>
              {e && technical && (
                <pre className="mt-1.5 whitespace-pre-wrap break-words rounded-lg bg-navy-deep px-2.5 py-2 font-mono text-[12.5px] text-sky-200">
                  {e.detail}{'\n'}<span className="text-ink-dim">version: {e.version} · mode: {e.mode} · step {e.step}</span>
                </pre>
              )}
            </div>
          </div>
        )
      })}
    </aside>
  )
}
