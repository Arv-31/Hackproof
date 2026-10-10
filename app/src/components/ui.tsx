import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { Label, Severity } from '../types'

type Tone = 'teal' | 'red' | 'green' | 'blue' | 'ghost'
const TONES: Record<Tone, string> = {
  teal: 'bg-gradient-to-b from-teal-2 to-teal text-[#04201d] shadow-[0_8px_30px_-10px_rgba(20,184,166,.7)]',
  red: 'bg-attack text-white shadow-[0_8px_30px_-12px_rgba(239,68,68,.8)]',
  green: 'bg-defense text-[#052e14] shadow-[0_8px_30px_-12px_rgba(34,197,94,.8)]',
  blue: 'bg-blue-500 text-white',
  ghost: 'bg-navy-2 border border-navy-line',
}

export function Button({ tone = 'teal', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return (
    <button
      {...p}
      className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[17px] font-semibold transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0 ${TONES[tone]} ${className}`}
    />
  )
}

const LABELS: Record<Label, [string, string]> = {
  executed: ['Executed', 'bg-attack/15 text-red-300'],
  simulated: ['Simulated', 'bg-warn/15 text-warn'],
  explained: ['Explained', 'bg-teal/15 text-teal'],
}
export function LabelBadge({ label }: { label: Label }) {
  const [text, cls] = LABELS[label]
  return <span className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${cls}`}>{text}</span>
}

const SEV: Record<Severity, string> = { high: 'text-attack', medium: 'text-warn', low: 'text-teal' }
export const sevColor = (s: Severity) => SEV[s]

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`grid content-start gap-3 rounded-[20px] border border-navy-line bg-navy-2/80 bg-gradient-to-b from-white/[.045] to-white/[.01] p-6 ${className}`}>{children}</div>
}

export function Head({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="mb-7 grid gap-2">
      <span className="text-[13px] font-semibold uppercase tracking-[.16em] text-teal">{eyebrow}</span>
      <h2 className="font-display text-[clamp(30px,3.6vw,44px)] font-bold tracking-tight">{title}</h2>
      {lead && <p className="max-w-[62ch] text-lg text-ink-muted">{lead}</p>}
    </div>
  )
}

export function Icon({ d, className = 'h-6 w-6' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}

export function Shield({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M24 4 7 10v12c0 11 7.5 19 17 22 9.5-3 17-11 17-22V10L24 4Z" fill="#14B8A6" fillOpacity=".18" stroke="#14B8A6" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="m16 24 6 6 11-12" fill="none" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
