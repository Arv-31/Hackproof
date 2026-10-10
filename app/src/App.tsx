import { useEffect, type ComponentType } from 'react'
import { Rail } from './components/Rail'
import { ConsoleScreen } from './screens/ConsoleScreen'
import { DemoScreen } from './screens/DemoScreen'
import { HomeScreen } from './screens/HomeScreen'
import { PresenterScreen } from './screens/PresenterScreen'
import { ReportScreen } from './screens/ReportScreen'
import { TargetScreen } from './screens/TargetScreen'
import { LabProvider, useLab, type View } from './store'

const SCREENS: Record<View, ComponentType> = {
  home: HomeScreen,
  targets: TargetScreen,
  demo: DemoScreen,
  console: ConsoleScreen,
  report: ReportScreen,
  presenter: PresenterScreen,
}

function Shell() {
  const { s, go } = useLab()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') { e.preventDefault(); go('presenter') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const Screen = SCREENS[s.view]
  return (
    <>
      <Rail />
      <main className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-7">
        <Screen key={`${s.view}-${s.mode}`} />
      </main>
    </>
  )
}

export default function App() {
  return <LabProvider><Shell /></LabProvider>
}
