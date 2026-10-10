/**
 * Password gate in front of the HackProof static site.
 * Runs on Cloudflare before any file is served. Fails closed: with no SITE_PASSWORD set, nobody gets in.
 */

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> }
  SITE_PASSWORD?: string
}

const COOKIE = 'hp_session'
const SESSION_HOURS = 12
const enc = new TextEncoder()

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c]!))
}

/** Constant-time string compare, so response timing does not leak the password. */
function same(a: string, b: string): boolean {
  const x = enc.encode(a), y = enc.encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

async function makeSession(secret: string): Promise<string> {
  const expires = Date.now() + SESSION_HOURS * 3600_000
  return `${expires}.${await hmac(secret, `session:${expires}`)}`
}

async function validSession(secret: string, value: string | undefined): Promise<boolean> {
  if (!value) return false
  const [exp, sig] = value.split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  return same(sig, await hmac(secret, `session:${exp}`))
}

function readCookie(req: Request, name: string): string | undefined {
  return req.headers.get('Cookie')?.split(/;\s*/).find(c => c.startsWith(name + '='))?.slice(name.length + 1)
}

const SECURITY_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
}

function loginPage(message = ''): Response {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HackProof · Authorised access</title>
<style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#000;color:#d7ffe0;font-family:"Share Tech Mono",ui-monospace,Consolas,monospace;padding:16px;
    background-image:radial-gradient(ellipse at center,rgba(0,255,65,.08),transparent 60%)}
  form{width:100%;max-width:420px;display:grid;gap:16px;padding:32px;border:1px solid #0d3b1e;border-radius:16px;background:rgba(3,17,10,.9);box-shadow:0 0 40px -10px rgba(0,255,65,.35)}
  h1{margin:0;font-size:34px;letter-spacing:.12em;color:#00ff41;text-shadow:0 0 14px rgba(0,255,65,.6)}
  p{margin:0;color:#86b894;font-size:14px;line-height:1.5}
  label{font-size:12px;letter-spacing:.25em;text-transform:uppercase;color:#4f7d5c}
  input{width:100%;padding:14px;border-radius:10px;border:1px solid #0d3b1e;background:#000;color:#d7ffe0;font:inherit;font-size:18px}
  input:focus{outline:2px solid #00ff41;outline-offset:2px}
  button{padding:14px;border:0;border-radius:10px;background:#00ff41;color:#000;font:inherit;font-size:16px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}
  .err{color:#ff3355}
</style></head><body>
<form method="post" action="/__login">
  <h1>HACKPROOF</h1>
  <p>Authorised access only. Enter the lab password to continue.</p>
  <label for="password">Password</label>
  <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
  ${message ? `<p class="err" role="alert">${message}</p>` : ''}
  <button type="submit">Unlock</button>
</form></body></html>`, { status: message ? 401 : 200, headers: SECURITY_HEADERS })
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    const secret = env.SITE_PASSWORD

    if (!secret) return new Response('HackProof is locked: no password has been set yet.', { status: 503, headers: { 'Cache-Control': 'no-store' } })

    if (url.pathname === '/__logout') {
      return new Response(null, { status: 302, headers: { Location: '/__login', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } })
    }

    if (url.pathname === '/__login') {
      if (req.method === 'POST') {
        const form = await req.formData()
        const given = String(form.get('password') ?? '')
        if (!same(given, secret)) {
          await new Promise(r => setTimeout(r, 800)) // slow down guessing
          return loginPage('Wrong password. Try again.')
        }
        return new Response(null, {
          status: 302,
          headers: { Location: '/', 'Set-Cookie': `${COOKIE}=${await makeSession(secret)}; Path=/; Max-Age=${SESSION_HOURS * 3600}; HttpOnly; Secure; SameSite=Lax` },
        })
      }
      return loginPage()
    }

    if (!(await validSession(secret, readCookie(req, COOKIE)))) {
      return new Response(null, { status: 302, headers: { Location: '/__login', 'Cache-Control': 'no-store' } })
    }
    return env.ASSETS.fetch(req)
  },
}
