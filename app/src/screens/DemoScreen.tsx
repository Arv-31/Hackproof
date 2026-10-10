import { useEffect, useState } from 'react'
import { BehindTheScenes } from '../components/BehindTheScenes'
import { ShopShield } from '../components/ShopShield'
import { Button, LabelBadge } from '../components/ui'
import { SCENARIOS } from '../data/catalog'
import { useLab } from '../store'
import type { Phase, SitePage } from '../types'

const BAR = ['Normal use', 'Attack', 'Defend', 'Retest', 'Result']
const NEXT_INDEX: Record<string, number> = { none: 0, normal: 1, attack: 2, defend: 3, retest: 4 }

const BANNERS: Record<Phase, { cls: string; title: string; text: string }> = {
  normal: { cls: 'border-teal bg-teal/15 text-teal-100', title: 'NORMAL USE', text: 'This is how the site should work.' },
  attack: { cls: 'border-attack bg-attack/15 text-red-200', title: 'ATTACK SUCCEEDED', text: '(in the lab) The weakness is real. Nothing left this computer.' },
  defend: { cls: 'border-warn bg-warn/15 text-amber-200', title: 'DEFENSE APPLIED', text: 'Now run the exact same test again.' },
  retest: { cls: 'border-defense bg-defense/15 text-green-200', title: 'ATTACK BLOCKED', text: 'Same test, different result. The defense works.' },
}

export function DemoScreen() {
  const { s, patch, go, play, resetScenario } = useLab()
  const scenario = SCENARIOS.find(x => x.id === s.scenarioId)!
  const [page, setPage] = useState<SitePage>(scenario.page)
  useEffect(() => setPage(scenario.page), [scenario.page, s.phase])

  const idx = NEXT_INDEX[s.phase ?? 'none']
  const banner = s.phase && !s.busy ? BANNERS[s.phase] : null
  const can = (p: Phase | null) => !s.busy && s.phase === p

  return (
    <section className="animate-rise">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-teal">ShopShield · {scenario.severity} severity</span>
          <h2 className="font-display text-3xl font-bold">{scenario.title}</h2>
        </div>
        <LabelBadge label={scenario.label} />
        <span className="rounded-full border border-dashed border-warn/60 px-3 py-1.5 text-xs font-semibold text-warn">Preview data</span>
      </div>

      <div className="mb-4 flex overflow-x-auto rounded-full border border-navy-line bg-navy-2 p-1.5">
        {BAR.map((b, i) => (
          <div key={b} className={`flex-1 whitespace-nowrap rounded-full px-3 py-2.5 text-center text-[15px] font-semibold transition ${i === idx ? 'bg-teal text-[#05221f]' : i < idx ? 'text-teal' : 'text-ink-dim'}`}>
            {i < idx ? '✓ ' : ''}{b}
          </div>
        ))}
      </div>

      {banner && (
        <div className={`mb-4 flex animate-pop flex-wrap items-center gap-3 rounded-xl border-2 px-5 py-3.5 ${banner.cls}`}>
          <b className="font-display text-2xl font-extrabold tracking-wide">{banner.title}</b>
          <span className="text-[15px] opacity-90">{banner.text}</span>
        </div>
      )}

      <div className="mb-3 flex justify-end">
        <button onClick={() => patch({ showPanel: !s.showPanel })} aria-pressed={s.showPanel} className="flex items-center gap-2.5 text-sm text-ink-muted">
          Behind the Scenes
          <span className={`relative h-6 w-11 rounded-full transition ${s.showPanel ? 'bg-teal' : 'bg-navy-3'}`}>
            <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-ink transition ${s.showPanel ? 'left-[23px]' : 'left-[3px]'}`} />
          </span>
        </button>
      </div>

      <div className={`grid items-start gap-5 ${s.showPanel ? 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]' : ''}`}>
        <ShopShield page={page} onPage={setPage} scenario={scenario.id} phase={s.busy ? null : s.phase} />
        {s.showPanel && <BehindTheScenes events={s.events} technical={s.technical} onTechnical={v => patch({ technical: v })} />}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5 rounded-[20px] border border-navy-line bg-navy-2 p-3.5">
        <Button tone="blue" disabled={!can(null)} onClick={() => play('normal')}>Show Normal Use</Button>
        <Button tone="red" disabled={!can('normal')} onClick={() => play('attack')}>Run Attack</Button>
        <Button tone="green" disabled={!can('attack')} onClick={() => play('defend')}>Apply Defense</Button>
        <Button tone="teal" disabled={!can('defend')} onClick={() => play('retest')}>Retest</Button>
        <span className="flex-1" />
        <Button tone="ghost" disabled={s.busy} onClick={resetScenario}>Reset Scenario</Button>
        {s.phase === 'retest' && !s.busy && <Button onClick={() => go(4)}>See Report →</Button>}
      </div>
      <div className="mt-8"><Button tone="ghost" onClick={() => (s.returnToLab ? patch({ returnToLab: false }) : go(2))}>{s.returnToLab ? '← Back to assessment' : '← Back to attacks'}</Button></div>
    </section>
  )
}
