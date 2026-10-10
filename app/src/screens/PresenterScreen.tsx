import { useState } from 'react'
import { Button, Card, Head } from '../components/ui'
import { SCENARIOS } from '../data/catalog'
import { useLab } from '../store'

const RESET_STEPS = [
  'Stop any running scenario and clear its trace events',
  "Delete the visitor's session, scores and reports",
  'Restore every fictional site from its clean snapshot',
  'Switch every defense back to its default setting',
  'Return to the Home screen',
]

export function PresenterScreen() {
  const { s, go, resetLab } = useLab()
  const [confirm, setConfirm] = useState(false)
  const [progress, setProgress] = useState(-1)
  const fixed = SCENARIOS.filter(x => s.done[x.id]).length

  const runReset = () => {
    setConfirm(false)
    RESET_STEPS.forEach((_, i) => setTimeout(() => setProgress(i), 350 * (i + 1)))
    setTimeout(() => { resetLab(); setProgress(-1) }, 350 * (RESET_STEPS.length + 1))
  }

  return (
    <section className="animate-rise">
      <Head eyebrow="Staff only" title="Presenter controls" lead="Visitors never see this screen. Open it any time with Ctrl + Shift + P." />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Card><span className="text-xs uppercase tracking-wider text-ink-dim">Current scenario</span><b className="font-display text-2xl">{SCENARIOS.find(x => x.id === s.scenarioId)?.title}</b></Card>
        <Card><span className="text-xs uppercase tracking-wider text-ink-dim">Scenario state</span><b className="font-display text-2xl capitalize">{s.phase ?? 'Clean'}</b></Card>
        <Card><span className="text-xs uppercase tracking-wider text-ink-dim">Weaknesses fixed this session</span><b className="font-display text-2xl tabular-nums">{fixed}</b></Card>
      </div>

      <Card className="border-attack/50 shadow-glow-red">
        <div className="flex flex-wrap items-center gap-5">
          <div className="min-w-[220px] flex-1">
            <h3 className="font-display text-2xl font-bold">Reset Entire Lab</h3>
            <p className="text-ink-muted">Gets everything ready for the next visitor.</p>
          </div>
          <Button tone="red" disabled={progress >= 0} onClick={() => setConfirm(true)}>Reset Entire Lab</Button>
        </div>
        <ol className="grid list-decimal gap-1 pl-5 text-ink-muted">
          {RESET_STEPS.map((t, i) => <li key={t} className={i <= progress ? 'text-defense' : ''}>{t}{i <= progress ? '  ✓' : ''}</li>)}
        </ol>
      </Card>
      <div className="mt-8"><Button tone="ghost" onClick={() => go('home')}>← Back to Home</Button></div>

      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="reset-title" className="grid w-full max-w-md animate-pop gap-4 rounded-[20px] border border-navy-line bg-navy-2 p-7">
            <h3 id="reset-title" className="font-display text-2xl font-bold">Reset the entire lab?</h3>
            <p className="text-ink-muted">Every scenario goes back to its starting state and the app returns to the Home screen. This can't be undone.</p>
            <div className="flex flex-wrap justify-end gap-2.5">
              <Button tone="ghost" onClick={() => setConfirm(false)} autoFocus>Cancel</Button>
              <Button tone="red" onClick={runReset}>Yes, reset everything</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
