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

/* Scenario-specific wording for the simulated demos. Same five layers, same statuses. */
const OVERRIDES: Record<string, Partial<Record<Phase, [string, string, string][]>>> = {
  phish: {
    normal: [['Message arrives', 'A real order update from PostHaven.', 'from: orders@posthaven.lab'], ['Mail server checks it', 'The sender is who it claims to be.', 'sender check: pass'], ['Delivered to inbox', 'Nothing unusual about this message.', 'folder: inbox'], ['No links to strange sites', 'The link points to the real site.', 'link: posthaven.lab'], ['Safe message', 'This is what a normal email looks like.', 'verdict: safe']],
    attack: [['Fake courier message', 'Urgent tone: “Your parcel is held, pay ₹25 now”.', 'from: parcel-desk@p0sthaven-help.lab'], ['No sender check', 'The server lets it through without checking.', 'sender check: off'], ['Lands in the inbox', 'It looks just like a real message.', 'folder: inbox'], ['Copycat sign-in page', 'The link opens a look-alike page that collects the password.', 'link: p0sthaven-help.lab/login'], ['Visitor was fooled (in the lab)', 'The password went to the copycat page. Nothing real was sent.', 'verdict: tricked']],
    defend: [['Warning signs shown', 'Odd sender, urgent tone and mismatched links get highlighted.', 'ui: warnings on'], ['Sender check switched on', 'Messages must prove who sent them.', 'sender check: on'], ['Mail filter on', 'Suspicious messages go to a quarantine folder.', 'filter: on'], ['Link check on', 'Links are compared with where they really go.', 'link check: on'], ['Defense ready', 'Now send the same message again.', 'ready: retest']],
    retest: [['Same fake message', 'The exact same courier message is sent again.', 'from: parcel-desk@p0sthaven-help.lab'], ['Sender check fails', 'The sender cannot prove it is PostHaven.', 'sender check: fail'], ['Moved to quarantine', 'It never reaches the inbox.', 'folder: quarantine'], ['Link flagged', 'The look-alike address is spotted.', 'link: blocked'], ['Scam blocked', 'Same message, different result. The defense works.', 'verdict: blocked']],
  },
  guess: {
    normal: [['Meera signs in', 'One attempt with the right password.', 'attempts: 1'], ['Sign-in request', 'The login answers normally.', 'POST /api/login -> 200'], ['Password checked', 'The password matches.', 'result: match'], ['Account found', 'Meera’s account is opened.', 'account: meera'], ['Normal sign-in', 'This is how signing in should work.', 'status: normal']],
    attack: [['Bot starts guessing', 'A script tries a list of common passwords on one lab test account.', 'attempts: 1 → 1,000 (bounded)'], ['No limit on tries', 'The login answers every attempt at full speed.', 'rate limit: none'], ['Each guess checked', 'Wrong, wrong, wrong… until one matches.', 'match on attempt 612'], ['Account opened', 'The test account’s weak password was found.', 'account: lab-test-user'], ['Attack succeeded (in the lab)', 'A weak password plus no limits means a bot gets in eventually.', 'severity: medium']],
    defend: [['2-step sign-in on', 'A code from the phone is needed as well as the password.', '2-step: on'], ['Attempt limit on', 'Only 5 tries per 15 minutes.', 'limit: 5 / 15 min'], ['Lockout on', 'Too many wrong tries pause the account.', 'lockout: on'], ['Weak passwords refused', 'Common passwords can no longer be chosen.', 'password rules: on'], ['Defense ready', 'Now run the same bot again.', 'ready: retest']],
    retest: [['Same bot again', 'The same list of guesses is sent.', 'attempts: 1 → …'], ['Slowed down', 'After 5 wrong tries the login stops answering.', 'POST /api/login -> 429'], ['Account locked', 'The account pauses and the owner is alerted.', 'lockout: 15 min'], ['Nothing opened', 'Even a right guess would still need the phone code.', 'account: protected'], ['Attack blocked', 'Same bot, different result. The defense works.', 'status: blocked']],
  },
  flood: {
    normal: [['Customers browse', 'About 40 people per second look at tickets.', 'requests: 40/s'], ['Gateway calm', 'Every request is answered quickly.', 'response: 120 ms'], ['Servers relaxed', 'Plenty of spare capacity.', 'cpu: 22%'], ['Seats load fine', 'The seat map loads for everyone.', 'errors: 0%'], ['Site healthy', 'This is a normal sale day.', 'status: healthy']],
    attack: [['Flood begins', 'A swarm of fake visitors sends thousands of requests (simulated).', 'requests: 4,800/s'], ['Gateway overwhelmed', 'Real customers wait in the same queue.', 'response: 9,400 ms'], ['Servers maxed out', 'No capacity left for real work.', 'cpu: 100%'], ['Pages fail to load', 'Most customers see an error page.', 'errors: 71%'], ['Site down (in the lab)', 'Nothing was stolen. The damage is that nobody can buy.', 'status: outage']],
    defend: [['Rate limiting on', 'Each visitor may only ask so often.', 'limit: 20/s per visitor'], ['Traffic filter on', 'Requests that look automated are dropped early.', 'filter: on'], ['Caching on', 'Popular pages are served from a ready-made copy.', 'cache: on'], ['Extra capacity ready', 'More servers can join when busy.', 'autoscale: on'], ['Defense ready', 'Now send the same flood again.', 'ready: retest']],
    retest: [['Same flood again', 'The same swarm of fake visitors arrives.', 'requests: 4,800/s'], ['Flood filtered', 'Most fake requests are dropped at the door.', 'dropped: 96%'], ['Servers steady', 'Capacity stays free for real customers.', 'cpu: 38%'], ['Seats load fine', 'Real customers keep buying tickets.', 'errors: 0.4%'], ['Site stays up', 'Same flood, different result. The defense works.', 'status: healthy']],
  },
}

export function buildTrace(s: Scenario, phase: Phase, runId: string): TraceEvent[] {
  const custom = OVERRIDES[s.id]?.[phase]
  return STEPS[phase].map(([layer, title, plain, detail, status], i) => ({
    run_id: runId,
    step: i + 1,
    layer,
    title: custom ? custom[i][0] : title,
    plain: custom ? custom[i][1] : fill(plain, s),
    detail: custom ? custom[i][2] : fill(detail, s),
    status,
    version: phase === 'normal' || phase === 'attack' ? 'vulnerable' : 'protected',
    mode: 'preview',
  }))
}
