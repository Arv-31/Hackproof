import { jsPDF } from 'jspdf'
import type { Scenario } from '../types'

const NAVY: [number, number, number] = [0, 0, 0]
const TEAL: [number, number, number] = [0, 170, 60]

/** One-page visitor takeaway. Uses only built-in fonts, so it works offline. */
export function downloadReport(items: (Scenario & { fixed: boolean })[], after: number, site = 'ShopShield Store') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  doc.setFillColor(...NAVY).rect(0, 0, 210, 38, 'F')
  doc.setTextColor(255, 255, 255).setFont('helvetica', 'bold').setFontSize(24).text('HackProof', 16, 20)
  doc.setFont('helvetica', 'normal').setFontSize(11).text(`Security report · ${site} (fictional lab site)`, 16, 29)

  doc.setTextColor(...NAVY).setFont('helvetica', 'bold').setFontSize(14).text('Security score', 16, 52)
  doc.setFontSize(32).setTextColor(239, 68, 68).text('0%', 16, 68)
  doc.setTextColor(...TEAL).text(`${after}%`, 70, 68)
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(90, 100, 120)
  doc.text('Before fixes', 16, 75).text('After fixes', 70, 75)

  let y = 92
  doc.setFont('helvetica', 'bold').setFontSize(14).setTextColor(...NAVY).text('Findings', 16, y)
  y += 8
  for (const it of items) {
    doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...NAVY).text(`${it.title}  (${it.severity}, weight ${it.weight})`, 16, y)
    doc.setTextColor(...(it.fixed ? [34, 140, 80] as [number, number, number] : [150, 150, 150] as [number, number, number])).text(it.fixed ? 'FIXED' : 'OPEN', 180, y)
    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(90, 100, 120)
    doc.text(doc.splitTextToSize(it.summary, 160), 16, y + 5)
    doc.text(`Fix: ${it.fix}`, 16, y + 11)
    y += 20
  }

  doc.setFontSize(9).setTextColor(140, 140, 140)
  doc.text('All websites in HackProof are fictional and ran only on the presenter\'s computer.', 16, 285)
  doc.save('hackproof-report.pdf')
}
