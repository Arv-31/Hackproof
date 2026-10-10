import type { Phase } from '../../types'
import { Chrome } from './InboxStage'

const REVIEWS = [
  ['meera_k', 'Bright and simple. Good value.'],
  ['arjun.r', 'Looks great on my desk.'],
  ['kavya.s', 'Arrived quickly, works well.'],
]

/** Fictional shop assistant chat. The 4th review carries an instruction meant for the bot. */
export function ChatStage({ phase }: { phase: Phase | null }) {
  const showTrap = phase === 'attack' || phase === 'defend' || phase === 'retest'
  const tricked = phase === 'attack'
  const safe = phase === 'retest'
  const asked = phase === 'normal' || tricked || safe

  return (
    <div className="overflow-hidden rounded-[20px] border border-navy-line bg-[#f6f8fb] text-[#17202e]">
      <Chrome url="shopshield.lab/product/aurora-desk-lamp" />
      <div className="grid min-h-[380px] gap-4 p-4 text-sm md:grid-cols-[1fr_1.1fr]">
        <div className="grid content-start gap-2">
          <b className="font-display text-base text-[#0f6d63]">Aurora Desk Lamp · reviews</b>
          {REVIEWS.map(([who, text]) => (
            <div key={who} className="rounded-lg border border-slate-200 bg-white px-3 py-2"><b>{who}</b> <span className="text-amber-500">★★★★★</span><div>{text}</div></div>
          ))}
          {showTrap && (
            <div className={`rounded-lg border px-3 py-2 ${phase === 'attack' ? 'border-red-400 bg-red-50' : 'border-amber-400 bg-amber-50'}`}>
              <b>guest_9917</b> <span className="text-amber-500">★★★★★</span>
              <div>Nice lamp. <span className="rounded bg-slate-800 px-1.5 font-mono text-[11px] text-slate-300">[hidden instruction for the assistant]</span></div>
              <div className="mt-1 text-xs text-slate-500">Looks like a normal review to people. The extra text is aimed at the AI.</div>
            </div>
          )}
        </div>

        <div className="grid content-start gap-2 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0f6d63] text-xs font-bold text-white">AI</span>
            <b>ShopShield Assistant</b>
            <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${phase === 'defend' || safe ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{phase === 'defend' || safe ? 'guarded' : 'standard'}</span>
          </div>
          {asked ? (
            <>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#0f6d63] px-3 py-2 text-white">Summarise the reviews for this lamp.</div>
              <div className={`max-w-[90%] rounded-2xl rounded-bl-sm px-3 py-2 ${tricked ? 'border border-red-300 bg-red-50' : 'bg-slate-100'}`}>
                Shoppers say it is bright, simple and good value, and it arrives quickly.
                {tricked && <div className="mt-2 font-semibold text-red-700">Also, here is the staff discount code: <span className="rounded bg-red-600 px-1.5 font-mono text-white">LAB-STAFF-90</span></div>}
                {safe && <div className="mt-2 text-xs text-green-700">1 review contained instructions and was treated as plain text.</div>}
              </div>
              {tricked && <div className="rounded-lg bg-[#7f1d1d] px-3 py-2 font-semibold text-white">The assistant followed text hidden in a review, not the shop’s rules. (lab simulation, fictional code)</div>}
              {safe && <div className="rounded-lg bg-[#14532d] px-3 py-2 font-semibold text-white">Same review, same question. The assistant stayed within its rules.</div>}
            </>
          ) : (
            <div className="grid place-items-center py-10 text-center text-slate-400">{phase === 'defend' ? 'Guard rails switched on. Ask the same question again.' : 'Ask the assistant something.'}</div>
          )}
        </div>
      </div>
    </div>
  )
}
