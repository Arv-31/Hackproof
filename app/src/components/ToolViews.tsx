import type { EventStatus, Layer, Phase, Scenario, TraceEvent } from '../types'

/* Simplified views modelled on professional testing tools, built for students. All data is from the lab run. */

const HOP: Record<Layer, [string, string, string]> = {
  browser: ['visitor', 'shopshield.lab', 'HTTP'],
  api: ['shopshield.lab', 'shop-api', 'HTTP'],
  server_code: ['shop-api', 'app-server', 'APP'],
  database: ['app-server', 'database', 'DB'],
  verdict: ['shopshield.lab', 'visitor', 'HTTP'],
}
const ROW: Record<EventStatus, string> = {
  ok: 'bg-teal/[.07] text-ink',
  unsafe: 'bg-attack/15 text-red-200',
  fix: 'bg-warn/10 text-amber-200',
  safe: 'bg-defense/15 text-green-200',
}

/** Packet list, in the spirit of a network analyser. */
export function TrafficView({ events }: { events: TraceEvent[] }) {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-ink-muted">Every message passing between the parts of the shop, in order. Red rows carry the attack; green rows show it being stopped.</p>
      <div className="overflow-x-auto rounded-xl border border-navy-line bg-[#040d1b]">
        <table className="w-full min-w-[560px] font-mono text-[12.5px]">
          <thead>
            <tr className="border-b border-navy-line text-left text-[11px] uppercase tracking-wider text-ink-dim">
              {['No.', 'Time', 'From', 'To', 'Type', 'Info'].map(h => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-ink-dim">No traffic yet. Press a button to send a request.</td></tr>}
            {events.map((e, i) => {
              const [from, to, type] = HOP[e.layer]
              return (
                <tr key={e.step} className={`animate-rise border-b border-navy-line/50 ${ROW[e.status]}`}>
                  <td className="px-3 py-2 tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2 tabular-nums">{(i * 0.012).toFixed(3)}s</td>
                  <td className="px-3 py-2">{from}</td>
                  <td className="px-3 py-2">{to}</td>
                  <td className="px-3 py-2"><span className="rounded bg-white/10 px-1.5 py-0.5">{type}</span></td>
                  <td className="px-3 py-2">{e.detail}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const REQUEST: Record<string, { method: string; path: string; body: (attack: boolean) => string[] }> = {
  login: { method: 'POST', path: '/api/login', body: a => [`email: ${a ? '[lab test input]' : 'meera@shopshield.lab'}`, `password: ${a ? '(not the real password)' : '••••••••••'}`] },
  orders: { method: 'GET', path: '/api/orders/', body: () => ['(no body)', 'signed in as: Meera'] },
  reviews: { method: 'POST', path: '/api/reviews', body: a => [`product: aurora-desk-lamp`, `text: ${a ? 'Great lamp! [hidden test code]' : 'Arrived quickly, works well.'}`] },
  guess: { method: 'POST', path: '/api/login', body: a => [a ? 'email: [lab-test-user@shopshield.lab]' : 'email: meera@shopshield.lab', a ? 'password: [guess 612 of 1,000]' : 'password: ••••••••••'] },
  phish: { method: 'MAIL', path: '/inbox', body: a => [a ? 'from: [parcel-desk@p0sthaven-help.lab]' : 'from: orders@posthaven.lab', `subject: ${a ? 'Your parcel is on hold' : 'Your order has shipped'}`] },
  flood: { method: 'GET', path: '/api/seats', body: a => [a ? 'visitors: [4,800 per second, simulated]' : 'visitors: 40 per second'] },
}

const RESPONSE: Record<string, Partial<Record<Phase, [number, string]>>> = {
  login: { normal: [200, 'Signed in as Meera'], attack: [200, 'Signed in as Admin  ← no valid password!'], retest: [401, 'Sign-in refused'] },
  orders: { normal: [200, 'Order #SS-10517 · owner: Meera'], attack: [200, 'Order #SS-10518 · owner: Arjun  ← not Meera’s!'], retest: [403, 'Access denied: not your order'] },
  reviews: { normal: [201, 'Review saved'], attack: [201, 'Review saved as page code  ← will run for every shopper!'], retest: [400, 'Rejected: reviews may only contain text'] },
  guess: { normal: [200, 'Signed in as Meera'], attack: [200, 'Signed in  ← found after 612 guesses, never slowed down!'], retest: [429, 'Too many attempts. Account paused for 15 minutes.'] },
  phish: { normal: [250, 'Delivered to inbox'], attack: [250, 'Delivered to inbox  ← sender was never checked!'], retest: [550, 'Quarantined: sender check failed'] },
  flood: { normal: [200, 'Seat map loaded'], attack: [503, 'Service unavailable  ← real customers locked out!'], retest: [200, 'Seat map loaded (fake traffic dropped)'] },
}

/** Request in, response out: modelled on an intercepting proxy, simplified. */
export function RequestInspector({ scenario, phase }: { scenario: Scenario; phase: Phase | null }) {
  const req = REQUEST[scenario.id]
  const shown = phase && phase !== 'defend' ? phase : null
  const attack = shown === 'attack' || shown === 'retest'
  const res = shown ? RESPONSE[scenario.id]?.[shown] : undefined
  const path = req.path + (scenario.id === 'orders' ? (attack ? '10518' : '10517') : '')
  const bad = shown === 'attack'
  const good = shown === 'retest'

  return (
    <div className="grid gap-3">
      <p className="text-sm text-ink-muted">What the browser sent, and what the shop answered. The changed part is highlighted.</p>
      {!shown ? (
        <div className="rounded-xl border border-dashed border-navy-line px-4 py-8 text-center text-ink-dim">Run normal use or the attack to capture a request.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="min-w-0 rounded-xl border border-navy-line bg-[#040d1b]">
            <div className="flex items-center justify-between border-b border-navy-line px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-dim">
              Request <span className="rounded bg-sky-500/20 px-2 py-0.5 text-sky-300">sent</span>
            </div>
            <pre className="whitespace-pre-wrap break-words p-3 font-mono text-[12.5px] leading-6 text-ink">
              <span className="text-sky-300">{req.method}</span> <span className={attack && scenario.id === 'orders' ? 'rounded bg-attack/30 px-1' : ''}>{path}</span>{'\n'}
              <span className="text-ink-dim">Host: shopshield.lab</span>{'\n\n'}
              {req.body(attack).map(l => (
                <span key={l} className={attack && l.includes('[') ? 'rounded bg-attack/30 px-1' : ''}>{l}{'\n'}</span>
              ))}
            </pre>
          </div>
          <div className={`min-w-0 rounded-xl border bg-[#040d1b] ${bad ? 'border-attack/70' : good ? 'border-defense/70' : 'border-navy-line'}`}>
            <div className="flex items-center justify-between border-b border-navy-line px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-dim">
              Response
              {res && <span className={`rounded px-2 py-0.5 ${bad ? 'bg-attack/25 text-red-300' : good ? 'bg-defense/25 text-green-300' : 'bg-teal/20 text-teal'}`}>{res[0]}</span>}
            </div>
            <pre className="whitespace-pre-wrap break-words p-3 font-mono text-[12.5px] leading-6">
              <span className="text-ink-dim">HTTP/1.1 {res?.[0]}</span>{'\n\n'}
              <span className={bad ? 'text-red-300' : good ? 'text-green-300' : 'text-ink'}>{res?.[1]}</span>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
