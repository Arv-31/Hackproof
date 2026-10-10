import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { SCENARIOS } from './data/catalog'
import { buildTrace } from './data/trace'
import type { Phase, TraceEvent } from './types'

export const STEPS = ['Start', 'Module', 'Target', 'Demo', 'Report', 'Presenter'] as const

interface LabState {
  step: number
  domain: string | null
  scenarioId: string
  phase: Phase | null
  events: TraceEvent[]
  busy: boolean
  done: Record<string, boolean>
  showPanel: boolean
  technical: boolean
}

const initial: LabState = {
  step: 0, domain: null, scenarioId: 'login', phase: null, events: [],
  busy: false, done: {}, showPanel: true, technical: false,
}

const STEP_MS = 650

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

  const play = useCallback((phase: Phase) => {
    const scenario = SCENARIOS.find(x => x.id === s.scenarioId)!
    const events = buildTrace(scenario, phase, `r_0${++run.current}`)
    clearTimers()
    patch({ busy: true, events: [] })
    events.forEach((e, i) => {
      timers.current.push(window.setTimeout(() => {
        const last = i === events.length - 1
        setS(prev => ({
          ...prev,
          events: [...prev.events, e],
          ...(last ? { busy: false, phase, done: phase === 'retest' ? { ...prev.done, [scenario.id]: true } : prev.done } : {}),
        }))
      }, STEP_MS * (i + 1)))
    })
  }, [s.scenarioId, patch])

  const resetScenario = useCallback(() => { clearTimers(); patch({ phase: null, events: [], busy: false }) }, [patch])
  const resetLab = useCallback(() => { clearTimers(); setS(initial) }, [])

  return { s, patch, go, openScenario, play, resetScenario, resetLab }
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
