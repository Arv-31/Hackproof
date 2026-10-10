import { useEffect, useState } from 'react'
import type { Phase } from '../../types'
import { Chrome } from './InboxStage'

const W = 520, H = 170, N = 40

/** Live requests-per-second graph for the fictional ticket site. Simulated, bounded, local. */
export function TrafficStage({ phase, busy }: { phase: Phase | null; busy: boolean }) {
  const flooding = phase === 'attack' || (busy && phase !== 'retest')
  const target = phase === 'attack' ? 0.95 : phase === 'retest' ? 0.3 : 0.1
  const [pts, setPts] = useState<number[]>(() => Array(N).fill(0.1))

  useEffect(() => {
    const t = window.setInterval(() => {
      setPts(p => [...p.slice(1), Math.max(0.04, Math.min(1, target + (Math.random() - 0.5) * (target > 0.5 ? 0.12 : 0.06)))])
    }, 160)
    return () => clearInterval(t)
  }, [target])

  const path = pts.map((v, i) => `${(i / (N - 1)) * W},${H - v * H}`).join(' ')
  const down = phase === 'attack'
  const ok = phase === 'retest'
  const color = down ? '#ef4444' : ok ? '#22c55e' : '#2563eb'
  const stats = down
    ? [['Requests', '4,800/s'], ['Wait time', '9.4 s'], ['Errors', '71%']]
    : ok ? [['Requests', '4,800/s'], ['Dropped fakes', '96%'], ['Errors', '0.4%']]
    : [['Requests', '40/s'], ['Wait time', '0.12 s'], ['Errors', '0%']]

  return (
    <div className="overflow-hidden rounded-[20px] border border-navy-line bg-[#f6f8fb] text-[#17202e]">
      <Chrome url="triptide.lab/status" bad={down} />
      <div className="grid min-h-[380px] content-start gap-4 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <b className="mr-auto font-display text-xl text-[#0e7490]">TripTide · Concert sale</b>
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${down ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{down ? 'Outage' : 'Online'}</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stats.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-xs uppercase tracking-wider text-slate-500">{k}</div>
              <div className="font-display text-2xl font-bold tabular-nums" style={{ color }}>{v}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-1 flex justify-between text-xs text-slate-500"><span>Requests per second (live)</span><span>{flooding ? 'flood in progress (simulated)' : ok ? 'flood filtered' : 'normal'}</span></div>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-[170px] w-full" preserveAspectRatio="none" aria-label="Traffic graph">
            {[0.25, 0.5, 0.75].map(g => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#e2e8f0" />)}
            <polygon points={`0,${H} ${path} ${W},${H}`} fill={color} opacity=".12" />
            <polyline points={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        </div>
        {down && <div className="rounded-lg bg-[#7f1d1d] px-4 py-2.5 text-sm font-semibold text-white">Real customers see “Service unavailable”. Nothing was stolen. The damage is that nobody can buy.</div>}
        {ok && <div className="rounded-lg bg-[#14532d] px-4 py-2.5 text-sm font-semibold text-white">The same flood arrives, but the site stays up and customers keep booking.</div>}
      </div>
    </div>
  )
}
