import { useEffect } from 'react'
import { Rail } from './components/Rail'
import { DemoScreen } from './screens/DemoScreen'
import { EthicalLabScreen } from './screens/EthicalLabScreen'
import { ModuleScreen } from './screens/ModuleScreen'
import { PresenterScreen } from './screens/PresenterScreen'
import { ReportScreen } from './screens/ReportScreen'
import { StartScreen } from './screens/StartScreen'
import { TargetScreen } from './screens/TargetScreen'
import { LabProvider, useLab } from './store'

const SCREENS = [StartScreen, ModuleScreen, TargetScreen, DemoScreen, ReportScreen, PresenterScreen]

function Shell() {
  const { s, go } = useLab()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') { e.preventDefault(); go(5) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const Screen = s.step === 3 && s.module === 'lab' && !s.returnToLab ? EthicalLabScreen : SCREENS[s.step]
  return (
    <>
      <Rail />
      <main className="mx-auto max-w-[1360px] px-5 pb-16 pt-7">
        <Screen key={`${s.step}-${s.module}-${s.returnToLab}`} />
      </main>
    </>
  )
}

export default function App() {
  return <LabProvider><Shell /></LabProvider>
}
