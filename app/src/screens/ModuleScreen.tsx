import { Button, Head, Icon } from '../components/ui'
import { useLab } from '../store'

const MODULES = [
  { id: 'sim', title: 'Cyber Attack Simulator', tag: 'Guided', text: 'Sit back and watch an attack hit a fictional website step by step, then see the fix that stops it.', tone: 'text-attack bg-attack/15', icon: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z', ready: true },
  { id: 'lab', title: 'Ethical Hacking Lab', tag: 'Hands-on', text: 'Work like a professional tester: read the brief, scan, assess, prove, fix and report.', tone: 'text-defense bg-defense/15', icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5Z', ready: true },
]

export function ModuleScreen() {
  const { go, patch } = useLab()
  return (
    <section className="animate-rise">
      <Head eyebrow="Choose a lab" title="What do you want to try?" />
      <div className="grid gap-6 md:grid-cols-2">
        {MODULES.map(m => (
          <button
            key={m.id}
            onClick={() => { patch({ module: m.id as 'sim' | 'lab', labPhase: 0, returnToLab: false }); go(2) }}
            className={`group relative grid content-start gap-4 overflow-hidden rounded-[24px] border border-navy-line bg-navy-2 p-8 text-left transition hover:-translate-y-1 hover:border-teal `}
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal/10 blur-3xl transition group-hover:bg-teal/20" />
            <div className={`grid h-16 w-16 place-items-center rounded-2xl ${m.tone}`}><Icon d={m.icon} className="h-8 w-8" /></div>
            <span className={`justify-self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${m.ready ? 'bg-teal/15 text-teal' : 'bg-navy-3 text-ink-dim'}`}>{m.tag}</span>
            <h3 className="font-display text-3xl font-bold">{m.title}</h3>
            <p className="text-lg text-ink-muted">{m.text}</p>
          </button>
        ))}
      </div>
      <div className="mt-8"><Button tone="ghost" onClick={() => go(0)}>← Back</Button></div>
    </section>
  )
}
