import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { SCENARIOS } from './data/catalog'
import { buildTrace } from './data/trace'
import type { Mode, Phase, TraceEvent } from './types'

export type View = 'home' | 'targets' | 'demo' | 'console' | 'report' | 'presenter'

/** What the presenter can press on the demo screen, in any order. */
export type Action = 'normal' | 'attack' | 'defenseOn'

export interface RunRecord {
  id: string
  scenarioId: string
  action: Action
  outcome: Phase
  defenseOn: boolean
}

interface LabState {
  view: View
  mode: Mode
  domain: string
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
  labPhase: number
}

const initial: LabState = {
  view: 'home', mode: 'cyber', domain: 'shop', scenarioId: 'login', phase: null, events: [],
  busy: false, done: {}, broken: {}, defenseOn: {}, runs: [], showPanel: true, technical: false, labPhase: 0,
}

const STEP_MS = 600

function useLabStore() {
  const [s, setS] = useState<LabState>(initial)
  const run = useRef(140)
  const timers = useRef<number[]>([])

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const patch = useCallback((p: Partial<LabState>) => setS(prev => ({ ...prev, ...p })), [])
  const go = useCallback((view: View) => { patch({ view }); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [patch])

  const setMode = useCallback((mode: Mode) => patch({ mode }), [patch])

  const openDomain = useCallback((domain: string) => {
    clearTimers()
    const first = SCENARIOS.find(x => x.domainId === domain)!
    setS(prev => ({ ...prev, domain, scenarioId: first.id, phase: null, events: [], busy: false, labPhase: 0, view: prev.mode === 'cyber' ? 'targets' : 'console' }))
    window.scrollTo({ top: 0 })
  }, [])

  const openScenario = useCallback((id: string) => {
    clearTimers()
    patch({ scenarioId: id, phase: null, events: [], busy: false })
    go('demo')
  }, [go, patch])

  const act = useCallback((action: Action, scenarioId?: string) => {
    const scenario = SCENARIOS.find(x => x.id === (scenarioId ?? s.scenarioId))!
    const on = !!s.defenseOn[scenario.id]
    const id = `r_0${++run.current}`
    clearTimers()

    if (action === 'defenseOn' && on) {
      setS(prev => ({ ...prev, scenarioId: scenario.id, defenseOn: { ...prev.defenseOn, [scenario.id]: false }, phase: null, events: [], busy: false }))
      return
    }

    const outcome: Phase = action === 'normal' ? 'normal' : action === 'defenseOn' ? 'defend' : on ? 'retest' : 'attack'
    const nextOn = action === 'defenseOn' ? true : on
    const events = buildTrace(scenario, outcome, id)

    setS(prev => ({ ...prev, scenarioId: scenario.id, busy: true, events: [], defenseOn: { ...prev.defenseOn, [scenario.id]: nextOn } }))
    events.forEach((e, i) => {
      timers.current.push(window.setTimeout(() => {
        const last = i === events.length - 1
        setS(prev => ({
          ...prev,
          events: [...prev.events, e],
          ...(last ? {
            busy: false,
            phase: outcome,
            broken: outcome === 'attack' ? { ...prev.broken, [scenario.id]: true } : prev.broken,
            done: outcome === 'retest' && prev.broken[scenario.id] ? { ...prev.done, [scenario.id]: true } : prev.done,
            runs: [{ id, scenarioId: scenario.id, action, outcome, defenseOn: nextOn }, ...prev.runs].slice(0, 40),
          } : {}),
        }))
      }, STEP_MS * (i + 1)))
    })
  }, [s.scenarioId, s.defenseOn])

  const resetScenario = useCallback(() => {
    clearTimers()
    setS(prev => ({
      ...prev, phase: null, events: [], busy: false,
      defenseOn: { ...prev.defenseOn, [prev.scenarioId]: false },
      broken: { ...prev.broken, [prev.scenarioId]: false },
      done: { ...prev.done, [prev.scenarioId]: false },
      runs: prev.runs.filter(r => r.scenarioId !== prev.scenarioId),
    }))
  }, [])
  const resetLab = useCallback(() => { clearTimers(); setS(prev => ({ ...initial, mode: prev.mode })) }, [])

  return { s, patch, go, setMode, openDomain, openScenario, act, resetScenario, resetLab }
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
