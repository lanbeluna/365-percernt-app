export type ThemeMode = 'light' | 'dark'

export type Habit = {
  id: string
  icon: string
  name: string
  frequency: string
  dailyTarget: string
  minimumAction: string
  reminderTime: string
  createdAt: string
  lastCheckedAt: string
  streak: number
  isEnabled: boolean
}

export type DailyEntry = {
  date: string
  completedHabitIds: string[]
  energy: EnergyLevel
  mood: string
  selfNote: string
  submittedAt?: string
}

export type EnergyLevel = '很有劲' | '普通' | '有点累' | '只想躺着'

export type AppSettings = {
  theme: ThemeMode
  remindersEnabled: boolean
}

export type AppState = {
  habits: Habit[]
  entries: DailyEntry[]
  settings: AppSettings
}

export type NewHabitInput = {
  icon: string
  name: string
  dailyTarget: string
  minimumAction: string
  reminderTime: string
}
