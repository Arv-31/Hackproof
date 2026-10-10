export type Label = 'executed' | 'simulated' | 'explained'
export type Severity = 'high' | 'medium' | 'low'
export type Layer = 'browser' | 'api' | 'server_code' | 'database' | 'verdict'
export type Phase = 'normal' | 'attack' | 'defend' | 'retest'
export type EventStatus = 'ok' | 'unsafe' | 'fix' | 'safe'
export type SitePage = 'home' | 'login' | 'product' | 'cart' | 'orders'
export type Mode = 'cyber' | 'ethical'
/** How a scenario is drawn on the demo stage. */
export type Stage = 'shop' | 'inbox' | 'traffic'

/** One step streamed into the Behind the Scenes panel. */
export interface TraceEvent {
  run_id: string
  step: number
  layer: Layer
  title: string
  plain: string
  detail: string
  status: EventStatus
  version: 'vulnerable' | 'protected'
  mode: Label | 'preview'
}

export interface Scenario {
  id: string
  domainId: string
  stage: Stage
  title: string
  summary: string
  label: Label
  severity: Severity
  weight: number
  page: SitePage
  fix: string
  ready: boolean
}

export interface Domain {
  id: string
  name: string
  site: string
  why: string
  hosts: string
  ready: boolean
  icon: string
  host: string
  client: string
}
