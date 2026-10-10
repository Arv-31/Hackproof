import { useEffect, useState } from 'react'
import type { Phase } from '../../types'
import { Chrome } from './InboxStage'

const FILES = ['patient_list.xlsx', 'appointments_oct.docx', 'xray_0412.png', 'lab_results.pdf', 'billing_q3.xlsx', 'staff_rota.docx', 'prescriptions.pdf', 'clinic_logo.png']

/** Dummy-file sandbox for the ransomware demo. Files lock one by one during the attack. */
export function FilesStage({ phase, busy }: { phase: Phase | null; busy: boolean }) {
  const attacking = phase === 'attack' || (busy && phase !== 'retest' && phase !== 'defend')
  const [locked, setLocked] = useState(0)

  useEffect(() => {
    if (phase === 'attack') { setLocked(FILES.length); return }
    if (!attacking) { setLocked(0); return }
    setLocked(0)
    const t = window.setInterval(() => setLocked(n => Math.min(FILES.length, n + 1)), 350)
    return () => clearInterval(t)
  }, [phase, attacking])

  const done = phase === 'attack'
  const safe = phase === 'retest'
  const guarded = phase === 'defend' || safe

  return (
    <div className="overflow-hidden rounded-[20px] border border-navy-line bg-[#f6f8fb] text-[#17202e]">
      <Chrome url="medicore.lab · records share (dummy files)" bad={done} />
      <div className="relative grid min-h-[380px] content-start gap-3 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <b className="mr-auto font-display text-base text-[#be123c]">MediCore · Records</b>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${guarded ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>{guarded ? 'app control · offline backup' : 'no protection'}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${done ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{done ? 'backup locked' : 'backup ok'}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FILES.map((f, i) => {
            const isLocked = i < locked
            return (
              <div key={f} className={`grid gap-1 rounded-lg border p-3 transition-colors duration-300 ${isLocked ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}>
                <span className="text-2xl" aria-hidden>{isLocked ? '🔒' : '📄'}</span>
                <span className={`break-all font-mono text-[11px] ${isLocked ? 'text-red-700' : 'text-slate-600'}`}>{f}{isLocked ? '.locked' : ''}</span>
              </div>
            )
          })}
        </div>
        {safe && <div className="rounded-lg bg-[#14532d] px-4 py-2.5 font-semibold text-white">“invoice_0923.exe” was blocked before it started. Every file is still readable.</div>}
        {phase === 'normal' && <div className="rounded-lg bg-[#14532d] px-4 py-2.5 font-semibold text-white">A normal day. Every record opens.</div>}

        {done && (
          <div className="absolute inset-3 grid animate-pop place-items-center rounded-xl bg-black/85 p-6 text-center">
            <div className="grid max-w-md gap-3">
              <span className="text-4xl" aria-hidden>🔒</span>
              <b className="font-display text-2xl text-red-400">YOUR FILES ARE LOCKED</b>
              <p className="text-slate-300">Pay to get them back. <span className="text-slate-500">(Fake ransom note. Lab demo on dummy files. Nothing real was touched.)</span></p>
              <p className="rounded-lg border border-red-500/50 px-3 py-2 text-sm text-red-300">Lesson: with no offline backup, the clinic cannot treat patients until this is solved.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
