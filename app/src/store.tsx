import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { SCENARIOS } from './data/catalog'
import { buildTrace } from './data/trace'
import type { Phase, TraceEvent } from './types'

export const STEPS = ['Start', 'Module', 'Target', 'Demo', 'Report', 'Presenter'] as const

/** What the presenter can press on the demo screen, in any order. */
export type Action = 'normal' | 'attack' | 'defenseOn'

export interface RunRecord {
  id: string
  scenarioId: string
  action: Action
  /** Which trace was played: attack = succeeded, retest = blocked. */
  outcome: Phase
  defenseOn: boolean
}

interface LabState {
  step: number
  domain: string | null
  scenarioId: string
  /** Outcome of the last finished run; drives the site and the banners. */
  phase: Phase | null
  events: TraceEvent[]
  busy: boolean
  done: Record<string, boolean>
  /** Per scenario: true once the attack has been seen to succeed (needed before "fixed" counts). */
  broken: Record<string, boolean>
  defenseOn: Record<string, boolean>
  runs: RunRecord[]
  showPanel: boolean
  technical: boolean
  module: 'sim' | 'lab'
  /** Lab module: the demo was opened from the Validate phase and should return there. */
  returnToLab: boolean
  labPhase: number
}

const initial: LabState = {
  step: 0, domain: null, scenarioId: 'login', phase: null, events: [],
  busy: false, done: {}, broken: {}, defenseOn: {}, runs: [], showPanel: true, technical: false,
  module: 'sim', returnToLab: false, labPhase: 0,
}

const STEP_MS = 600

function useLabStore() {
  const [s, setS] = useState<LabState>(initial)
  const run = useRef(140)
  const timers = useRef<number[]>([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const patch = useCallback((p: Partial<LabState>) => setS(prev => ({ ...prev, ...p })), [])

  const go = useCallback((step: number) => { patch({ step }); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [patch])

  const openScenario = useCallback((id: string) => {
    clearTimers()
    patch({ scenarioId: id, phase: null, events: [], busy: false })
    go(3)
  }, [go, patch])

  /** Stream a trace into the panel; `after` runs when the last event lands. */
  const stream = (events: TraceEvent[], after: (prev: LabState) => Partial<LabState>) => {
    clearTimers()
    setS(prev => ({ ...prev, busy: true, events: [] }))
    events.forEach((e, i) => {
      timers.current.push(window.setTimeout(() => {
        const last = i === events.length - 1
        setS(prev => ({ ...prev, events: [...prev.events, e], ...(last ? { busy: false, ...after(prev) } : {}) }))
      }, STEP_MS * (i + 1)))
    })
  }

  const act = useCallback((action: Action) => {
    const scenario = SCENARIOS.find(x => x.id === s.scenarioId)!
    const on = !!s.defenseOn[scenario.id]
    const id = `r_0${++run.current}`

    if (action === 'defenseOn' && on) {
      // Switching the defense off needs no trace: the site is simply weak again.
      clearTimers()
      patch({ defenseOn: { ...s.defenseOn, [scenario.id]: false }, phase: null, events: [], busy: false })
      return
    }

    const outcome: Phase = action === 'normal' ? 'normal' : action === 'defenseOn' ? 'defend' : on ? 'retest' : 'attack'
    const nextOn = action === 'defenseOn' ? true : on
    if (action === 'defenseOn') patch({ defenseOn: { ...s.defenseOn, [scenario.id]: true } })

    stream(buildTrace(scenario, outcome, id), prev => ({
      phase: outcome,
      broken: outcome === 'attack' ? { ...prev.broken, [scenario.id]: true } : prev.broken,
      done: outcome === 'retest' && prev.broken[scenario.id] ? { ...prev.done, [scenario.id]: true } : prev.done,
      runs: [{ id, scenarioId: scenario.id, action, outcome, defenseOn: nextOn }, ...prev.runs].slice(0, 30),
    }))
  }, [s.scenarioId, s.defenseOn, patch])

  const resetScenario = useCallback(() => {
    clearTimers()
    setS(prev => ({
      ...prev, phase: null, events: [], busy: false,
      defenseOn: { ...prev.defenseOn, [prev.scenarioId]: false },
      runs: prev.runs.filter(r => r.scenarioId !== prev.scenarioId),
    }))
  }, [])
  const resetLab = useCallback(() => { clearTimers(); setS(initial) }, [])

  return { s, patch, go, openScenario, act, resetScenario, resetLab }
}

type Lab = ReturnType<typeof useLabStore>
const Ctx = createContext<Lab | null>(null)

export function LabProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useLabStore()}>{children}</Ctx.Provider>
}

export function useLab() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useLab must be used inside LabProvider')
  return v
}
