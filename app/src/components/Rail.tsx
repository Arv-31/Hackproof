import { STEPS, useLab } from '../store'
import { Shield } from './ui'

export function Rail() {
  const { s, go } = useLab()
  return (
    <header className="sticky top-0 z-20 border-b border-navy-line bg-[#091a31]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-5 px-5 py-3">
        <button onClick={() => go(0)} className="flex items-center gap-2.5 font-display text-xl font-bold">
          <Shield /> HackProof
        </button>
        <nav aria-label="Demo progress" className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
          {STEPS.slice(0, 5).map((label, i) => (
            <button key={label} onClick={() => go(i)} aria-current={i === s.step ? 'step' : undefined} className="min-w-[84px] flex-1 px-1 py-1.5 text-left">
              <div className="h-1.5 overflow-hidden rounded-full bg-navy-3">
                <i className={`block h-full bg-gradient-to-r from-teal to-teal-2 transition-all duration-500 ${i <= s.step ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`mt-1.5 whitespace-nowrap text-xs uppercase tracking-wider ${i === s.step ? 'font-semibold text-ink' : 'text-ink-dim'}`}>
                {i + 1}. {i === 3 && s.module === 'lab' ? 'Assess' : label}
              </div>
            </button>
          ))}
        </nav>
        <span className="rounded-full border border-dashed border-warn/60 px-3 py-1 text-xs font-semibold text-warn">Fictional lab · runs locally</span>
      </div>
    </header>
  )
}
