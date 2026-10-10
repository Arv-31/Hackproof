import type { Domain, Scenario } from '../types'

export const DOMAINS: Domain[] = [
  { id: 'shop', name: 'Shopping', site: 'ShopShield Store', host: 'shopshield.lab', client: 'ShopShield Retail', why: 'An online store everyone recognises.', hosts: 'Login · Orders · Reviews', ready: true, icon: 'M6 8h12l-1 11H7L6 8Z M9 8a3 3 0 0 1 6 0' },
  { id: 'mail', name: 'Email', site: 'PostHaven Mail', host: 'posthaven.lab', client: 'PostHaven Mail', why: 'Everyone gets messages that are not what they seem.', hosts: 'Inbox · Link check', ready: true, icon: 'M3 5h18v14H3z M3 7l9 6 9-6' },
  { id: 'tickets', name: 'Tickets', site: 'TripTide Tickets', host: 'triptide.lab', client: 'TripTide Travel', why: 'A busy booking site on sale day.', hosts: 'Live traffic · Booking', ready: true, icon: 'M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V8Z' },
]

export const SCENARIOS: Scenario[] = [
  { id: 'login', domainId: 'shop', stage: 'shop', title: 'Login weakness', summary: 'The sign-in page can be fooled into letting someone in without the right password.', label: 'executed', severity: 'high', weight: 3, page: 'login', fix: 'Safe database queries', ready: true },
  { id: 'orders', domainId: 'shop', stage: 'shop', title: 'Order privacy weakness', summary: "One customer can open another customer's order.", label: 'executed', severity: 'high', weight: 3, page: 'orders', fix: 'Ownership check on every order', ready: true },
  { id: 'reviews', domainId: 'shop', stage: 'shop', title: 'Review weakness', summary: 'A review can carry hidden code that runs for other shoppers.', label: 'executed', severity: 'medium', weight: 2, page: 'product', fix: 'Reviews shown as plain text', ready: true },
  { id: 'guess', domainId: 'shop', stage: 'shop', title: 'Password guessing', summary: 'A bot tries common passwords again and again, and the login never slows it down.', label: 'executed', severity: 'medium', weight: 2, page: 'login', fix: 'Attempt limit, lockout and 2-step sign-in', ready: true },
  { id: 'phish', domainId: 'mail', stage: 'inbox', title: 'Fake delivery message', summary: 'A message pretends to be a courier and asks you to sign in on a copycat page.', label: 'simulated', severity: 'high', weight: 3, page: 'home', fix: 'Mail filter + warning signs shown', ready: true },
  { id: 'flood', domainId: 'tickets', stage: 'traffic', title: 'Traffic flood', summary: 'Far too many requests arrive at once and real customers cannot get in.', label: 'simulated', severity: 'high', weight: 3, page: 'home', fix: 'Rate limiting and caching', ready: true },
]

export const scenariosFor = (domainId: string) => SCENARIOS.filter(s => s.domainId === domainId)
export const weightFor = (domainId: string) => scenariosFor(domainId).reduce((n, s) => n + s.weight, 0)
