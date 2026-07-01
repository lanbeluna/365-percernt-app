import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AddHabitDrawer } from './components/AddHabitDrawer'
import { AppFrame } from './components/AppFrame'
import { BottomNav } from './components/BottomNav'
import { useAppData } from './hooks/useAppData'
import { CheckInPage } from './pages/CheckIn'
import { HabitsPage } from './pages/Habits'
import { HomePage } from './pages/Home'
import { ProfilePage } from './pages/Profile'
import { StatisticsPage } from './pages/Statistics'

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

function AppContent() {
  const app = useAppData()

  return (
    <AppFrame theme={app.state.settings.theme}>
      <Routes>
        <Route path="/" element={<HomePage app={app} />} />
        <Route path="/check-in" element={<CheckInPage app={app} />} />
        <Route path="/habits" element={<HabitsPage app={app} />} />
        <Route path="/statistics" element={<StatisticsPage app={app} />} />
        <Route path="/profile" element={<ProfilePage app={app} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav onAddHabit={app.openAddHabit} />
      <AddHabitDrawer
        isOpen={app.isAddHabitOpen}
        onClose={app.closeAddHabit}
        onSave={app.addHabit}
      />
    </AppFrame>
  )
}

export default App
