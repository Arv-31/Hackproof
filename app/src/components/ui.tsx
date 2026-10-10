import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { Label, Severity } from '../types'

type Tone = 'green' | 'red' | 'blue' | 'ghost' | 'teal'
const TONES: Record<Tone, string> = {
  green: 'bg-teal text-black shadow-glow hover:bg-teal-2',
  teal: 'bg-teal text-black shadow-glow hover:bg-teal-2',
  red: 'bg-attack text-white shadow-glow-red',
  blue: 'bg-sky-500 text-black',
  ghost: 'border border-navy-line bg-black/60 text-ink hover:border-teal/60',
}

export function Button({ tone = 'green', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return (
    <button
      {...p}
      className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-mono text-[17px] uppercase tracking-wider transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0 ${TONES[tone]} ${className}`}
    />
  )
}

const LABELS: Record<Label, [string, string]> = {
  executed: ['Executed', 'border-attack/60 text-attack'],
  simulated: ['Simulated', 'border-warn/60 text-warn'],
  explained: ['Explained', 'border-teal/60 text-teal'],
}
export function LabelBadge({ label }: { label: Label }) {
  const [text, cls] = LABELS[label]
  return <span className={`whitespace-nowrap rounded border px-2.5 py-1 font-mono text-xs uppercase tracking-widest ${cls}`}>{text}</span>
}

const SEV: Record<Severity, string> = { high: 'text-attack', medium: 'text-warn', low: 'text-teal' }
export const sevColor = (s: Severity) => SEV[s]

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`panel grid content-start gap-3 p-6 ${className}`}>{children}</div>
}

export function Head({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="mb-7 grid gap-2">
      <span className="font-mono text-sm uppercase tracking-[.3em] text-teal">&gt; {eyebrow}</span>
      <h2 className="glow-text font-display text-[clamp(28px,3.4vw,44px)] font-bold uppercase tracking-wide text-ink">{title}</h2>
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
      <path d="M24 4 7 10v12c0 11 7.5 19 17 22 9.5-3 17-11 17-22V10L24 4Z" fill="#00ff41" fillOpacity=".12" stroke="#00ff41" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="m16 24 6 6 11-12" fill="none" stroke="#00ff41" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
