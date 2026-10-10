import type { Phase } from '../../types'

const OTHERS = [
  { from: 'PostHaven Orders', subject: 'Your order #PH-2291 has shipped', time: '09:12' },
  { from: 'CampusNest Notices', subject: 'Mid-term timetable published', time: 'Yesterday' },
  { from: 'Kavya S.', subject: 'Notes from today’s lab session', time: 'Mon' },
]

const SIGNS = [
  ['Sender address', 'p0sthaven-help.lab uses a zero instead of an “o”.'],
  ['Urgent pressure', '“Pay within 2 hours or your parcel is returned.”'],
  ['Link goes elsewhere', 'Text says posthaven.lab, real destination is a copycat.'],
]

/** Fictional mail client. Shows the fake message, the copycat page, or quarantine depending on the run. */
export function InboxStage({ phase }: { phase: Phase | null }) {
  const tricked = phase === 'attack'
  const warned = phase === 'defend' || phase === 'retest'
  const blocked = phase === 'retest'
  const showFake = phase === 'attack' || phase === 'defend'

  return (
    <div className="overflow-hidden rounded-[20px] border border-navy-line bg-[#f6f8fb] text-[#17202e]">
      <Chrome url={tricked ? 'p0sthaven-help.lab/login' : 'posthaven.lab/inbox'} bad={tricked} />
      <div className="grid min-h-[380px] grid-cols-[150px_minmax(0,1fr)] text-sm">
        <aside className="grid content-start gap-1 border-r border-slate-200 bg-white p-3">
          <b className="mb-2 font-display text-base text-[#2563eb]">PostHaven</b>
          {['Inbox', 'Starred', 'Sent', blocked ? 'Quarantine · 1' : 'Quarantine'].map((f, i) => (
            <span key={f} className={`rounded-md px-2 py-1 ${i === 0 && !blocked ? 'bg-blue-50 font-semibold text-[#2563eb]' : ''} ${f.startsWith('Quarantine ·') ? 'bg-green-50 font-semibold text-green-700' : ''}`}>{f}</span>
          ))}
        </aside>
        <div className="grid content-start">
          {tricked ? (
            <div className="grid gap-3 p-5">
              <div className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white">Copycat page (lab simulation)</div>
              <h4 className="font-display text-xl font-bold">P0stHaven · Confirm delivery</h4>
              <span className="rounded-md border border-red-300 bg-red-50 px-3 py-2">meera@posthaven.lab</span>
              <span className="rounded-md border border-red-300 bg-red-50 px-3 py-2">••••••••••</span>
              <div className="rounded-lg bg-[#7f1d1d] px-4 py-2.5 font-semibold text-white">The password was sent to the copycat page. In real life the account would now be at risk.</div>
            </div>
          ) : (
            <>
              {showFake && !blocked && (
                <div className={`border-b border-slate-200 px-4 py-3 ${warned ? 'bg-amber-50' : 'bg-white'}`}>
                  <div className="flex justify-between"><b>Parcel Desk</b><span className="text-xs text-slate-500">now</span></div>
                  <div className="font-semibold">⚠ Your parcel is on hold. Pay ₹25 within 2 hours</div>
                  <div className="text-slate-500">parcel-desk@p0sthaven-help.lab</div>
                </div>
              )}
              {blocked && (
                <div className="m-3 rounded-lg bg-[#14532d] px-4 py-2.5 font-semibold text-white">The fake courier message was quarantined. It never reached the inbox.</div>
              )}
              {OTHERS.map(m => (
                <div key={m.subject} className="border-b border-slate-200 bg-white px-4 py-3">
                  <div className="flex justify-between"><b>{m.from}</b><span className="text-xs text-slate-500">{m.time}</span></div>
                  <div className="text-slate-600">{m.subject}</div>
                </div>
              ))}
              {warned && !blocked && (
                <div className="grid gap-2 p-4">
                  <b className="text-amber-700">Warning signs found</b>
                  {SIGNS.map(([t, d]) => <div key={t} className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2"><b>{t}:</b> {d}</div>)}
                </div>
              )}
              {phase === 'normal' && <div className="m-3 rounded-lg bg-[#14532d] px-4 py-2.5 font-semibold text-white">A normal inbox. Every sender is who they say they are.</div>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function Chrome({ url, bad }: { url: string; bad?: boolean }) {
  return (
    <>
      <div className="flex items-center gap-3 bg-[#e6ebf2] px-4 py-2.5">
        <div className="flex gap-1.5">{[0, 1, 2].map(i => <i key={i} className="h-3 w-3 rounded-full bg-[#c3ccd8]" />)}</div>
        <div className={`min-w-0 flex-1 truncate rounded-lg px-3 py-1 font-mono text-[13px] ${bad ? 'bg-red-100 text-red-700' : 'bg-white text-slate-600'}`}>{url}</div>
      </div>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center text-[13px] font-semibold text-amber-800">⚠ Fictional lab site. Nothing here leaves this computer.</div>
    </>
  )
}
