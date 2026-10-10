import type { EventStatus, Layer, Phase, Scenario, TraceEvent } from '../types'

type Step = [Layer, string, string, string, EventStatus]

/* Generic preview stream. Real scenario steps come from scenarios/<id>.json once the team writes them. */
const STEPS: Record<Phase, Step[]> = {
  normal: [
    ['browser', 'Normal visit', 'A shopper uses the page the way it was meant to be used.', 'GET /{page}', 'ok'],
    ['api', 'Request received', 'The shop gets an ordinary request.', '{method} /api/{page} -> 200', 'ok'],
    ['server_code', 'Normal code path', 'The server handles it as designed.', 'handler: {page}.view', 'ok'],
    ['database', 'Expected record returned', 'Only the data this shopper should see comes back.', 'rows: 1', 'ok'],
    ['verdict', 'Working as designed', 'This is how the site should behave.', 'status: normal', 'ok'],
  ],
  attack: [
    ['browser', 'Lab test input sent', 'The attacker sends a prepared test input from the lab.', 'input: lab test input', 'unsafe'],
    ['api', 'Accepted without checks', 'The request is passed on as it is.', '{method} /api/{page} -> 200', 'unsafe'],
    ['server_code', 'Weak code path runs', 'The vulnerable version of the code trusts the input.', 'version: vulnerable', 'unsafe'],
    ['database', 'Too much data returned', 'Data comes back that should have stayed protected.', 'rows: more than allowed', 'unsafe'],
    ['verdict', 'Attack succeeded (in the lab)', 'The weakness was real. Nothing left this laptop.', 'severity: {severity}', 'unsafe'],
  ],
  defend: [
    ['browser', 'No change for shoppers', 'The page looks the same to normal visitors.', 'ui: unchanged', 'fix'],
    ['api', 'Input checks switched on', 'Requests are now checked at the door.', 'validation: on', 'fix'],
    ['server_code', 'Protected code path on', 'Fix applied: {fix}.', 'version: protected', 'fix'],
    ['database', 'Lab data restored', 'The data is put back to a clean state.', 'snapshot: restored', 'fix'],
    ['verdict', 'Defense ready', 'Now run the exact same test again.', 'ready: retest', 'fix'],
  ],
  retest: [
    ['browser', 'Same test input sent', 'The attacker repeats the exact same attempt.', 'input: lab test input', 'unsafe'],
    ['api', 'Request checked', 'The check notices something is wrong.', '{method} /api/{page} -> 403', 'safe'],
    ['server_code', 'Protected code stops it', 'The fixed code refuses to trust the input.', 'version: protected', 'safe'],
    ['database', 'Nothing extra returned', 'Protected data stays protected.', 'rows: 0', 'safe'],
    ['verdict', 'Attack blocked', 'Same test, different result: the defense works.', 'severity: resolved', 'safe'],
  ],
}

const fill = (text: string, s: Scenario) =>
  text
    .replace('{page}', s.page)
    .replace('{method}', s.page === 'login' ? 'POST' : 'GET')
    .replace('{severity}', s.severity)
    .replace('{fix}', s.fix)

export function buildTrace(s: Scenario, phase: Phase, runId: string): TraceEvent[] {
  return STEPS[phase].map(([layer, title, plain, detail, status], i) => ({
    run_id: runId,
    step: i + 1,
    layer,
    title,
    plain: fill(plain, s),
    detail: fill(detail, s),
    status,
    version: phase === 'normal' || phase === 'attack' ? 'vulnerable' : 'protected',
    mode: 'preview',
  }))
}
