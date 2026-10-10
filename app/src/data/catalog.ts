import type { Domain, Scenario } from '../types'

export const DOMAINS: Domain[] = [
  { id: 'shop', name: 'Shop', site: 'ShopShield Store', why: 'Everyone shops online.', hosts: 'Login, orders, reviews, checkout', ready: true, icon: 'M6 8h12l-1 11H7L6 8Z M9 8a3 3 0 0 1 6 0' },
  { id: 'bank', name: 'Bank', site: 'VaultLine Bank', why: 'Fictional balances only.', hosts: 'Accounts, transfers, statements', ready: false, icon: 'M4 10h16M6 10v7m4-7v7m4-7v7m4-7v7M3 20h18M12 4l8 4H4l8-4Z' },
  { id: 'college', name: 'College', site: 'CampusNest Portal', why: 'Made for student visitors.', hosts: 'Marks, fees, staff view', ready: false, icon: 'm2 9 10-5 10 5-10 5L2 9Z M6 11v5c3 2 9 2 12 0v-5' },
  { id: 'social', name: 'Social', site: 'Chirply', why: 'Used every day.', hosts: 'Profiles, posts, privacy', ready: false, icon: 'M9 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z M3 19c1-3 4-4 6-4s5 1 6 4' },
  { id: 'email', name: 'Email', site: 'PostHaven Inbox', why: 'Everyone gets scam messages.', hosts: 'Inbox, link inspector', ready: false, icon: 'M3 5h18v14H3z M3 7l9 6 9-6' },
  { id: 'hospital', name: 'Hospital', site: 'MediCore Records', why: 'Fictional patients.', hosts: 'Patient list, records', ready: false, icon: 'M12 6v12M6 12h12 M3 3h18v18H3z' },
  { id: 'booking', name: 'Booking', site: 'TripTide Tickets', why: 'Fun and traffic-heavy.', hosts: 'Browse, book, pay', ready: false, icon: 'M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V8Z' },
]

/** ShopShield scenarios. Attack specifics live in each scenario's data file, written by the team. */
export const SCENARIOS: Scenario[] = [
  { id: 'login', title: 'Login weakness', summary: 'The sign-in page can be fooled into letting someone in without the right password.', label: 'executed', severity: 'high', weight: 3, page: 'login', fix: 'Safe database queries', ready: true },
  { id: 'orders', title: 'Order privacy weakness', summary: "One customer can open another customer's order.", label: 'executed', severity: 'high', weight: 3, page: 'orders', fix: 'Ownership check on every order', ready: true },
  { id: 'reviews', title: 'Review weakness', summary: 'A review can carry hidden code that runs for other shoppers.', label: 'executed', severity: 'medium', weight: 2, page: 'product', fix: 'Reviews shown as plain text, plus a browser safety rule', ready: true },
  { id: 'price', title: 'Checkout price weakness', summary: 'The checkout trusts a price sent by the browser.', label: 'executed', severity: 'medium', weight: 2, page: 'cart', fix: 'Server sets every price', ready: false },
  { id: 'guess', title: 'Password-guessing limits', summary: 'The login never slows down after many wrong tries.', label: 'executed', severity: 'medium', weight: 2, page: 'login', fix: 'Attempt limits and lockout', ready: false },
  { id: 'phish', title: 'Look-alike email', summary: 'A fake message that copies the store to collect sign-ins.', label: 'explained', severity: 'medium', weight: 1, page: 'home', fix: 'Check the sender and link before clicking', ready: false },
]

export const READY_WEIGHT = SCENARIOS.filter(s => s.ready).reduce((n, s) => n + s.weight, 0)
