import { useEffect, useMemo, useState } from 'react'
import type { AppState, DailyEntry, EnergyLevel, NewHabitInput, ThemeMode } from '../types/app'
import { toDateKey } from '../utils/date'
import { loadState, saveState } from '../utils/storage'
import { findEntry, getTodayProgress } from '../utils/stats'

function createTodayEntry(date = toDateKey()): DailyEntry {
  return {
    date,
    completedHabitIds: [],
    energy: '普通',
    mood: '🙂',
    selfNote: '',
  }
}

function ensureTodayEntry(state: AppState, dateKey: string): AppState {
  if (findEntry(state.entries, dateKey)) return state

  return {
    ...state,
    entries: [...state.entries, createTodayEntry(dateKey)],
  }
}

function updateEntry(
  state: AppState,
  dateKey: string,
  updater: (entry: DailyEntry) => DailyEntry,
) {
  const hasEntry = state.entries.some((entry) => entry.date === dateKey)
  const entries = hasEntry ? state.entries : [...state.entries, createTodayEntry(dateKey)]

  return {
    ...state,
    entries: entries.map((entry) => (entry.date === dateKey ? updater(entry) : entry)),
  }
}

export function useAppData() {
  const [todayKey, setTodayKey] = useState(() => toDateKey())
  const [state, setState] = useState<AppState>(() => ensureTodayEntry(loadState(), todayKey))
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    setState((current) => ensureTodayEntry(current, todayKey))
  }, [todayKey])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = toDateKey()
      if (current !== todayKey) setTodayKey(current)
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [todayKey])

  const todayEntry = useMemo(
    () => findEntry(state.entries, todayKey) ?? createTodayEntry(todayKey),
    [state.entries, todayKey],
  )

  const todayProgress = useMemo(
    () => getTodayProgress(state, todayKey),
    [state, todayKey],
  )

  function toggleHabit(habitId: string) {
    setState((current) => {
      const nextState = updateEntry(current, todayKey, (entry) => {
        const done = entry.completedHabitIds.includes(habitId)
        return {
          ...entry,
          completedHabitIds: done
            ? entry.completedHabitIds.filter((id) => id !== habitId)
            : [...entry.completedHabitIds, habitId],
        }
      })

      return {
        ...nextState,
        habits: nextState.habits.map((habit) => {
          if (habit.id !== habitId) return habit
          const isDone = findEntry(nextState.entries, todayKey)?.completedHabitIds.includes(habitId)
          return {
            ...habit,
            lastCheckedAt: isDone ? todayKey : habit.lastCheckedAt,
            streak: isDone ? Math.max(habit.streak, 1) : habit.streak,
          }
        }),
      }
    })
  }

  function setEnergy(energy: EnergyLevel) {
    setState((current) => updateEntry(current, todayKey, (entry) => ({ ...entry, energy })))
  }

  function setMood(mood: string) {
    setState((current) => updateEntry(current, todayKey, (entry) => ({ ...entry, mood })))
  }

  function setSelfNote(selfNote: string) {
    setState((current) => updateEntry(current, todayKey, (entry) => ({ ...entry, selfNote })))
  }

  function submitTodayCheckIn() {
    setState((current) =>
      updateEntry(current, todayKey, (entry) => ({
        ...entry,
        submittedAt: new Date().toISOString(),
      })),
    )
  }

  function addHabit(input: NewHabitInput) {
    setState((current) => ({
      ...current,
      habits: [
        ...current.habits,
        {
          id: crypto.randomUUID(),
          icon: input.icon,
          name: input.name,
          frequency: '每天',
          dailyTarget: input.dailyTarget,
          minimumAction: input.minimumAction,
          reminderTime: input.reminderTime,
          createdAt: todayKey,
          lastCheckedAt: '还没有开始',
          streak: 0,
          isEnabled: true,
        },
      ],
    }))
    setIsAddHabitOpen(false)
  }

  function toggleHabitEnabled(habitId: string) {
    setState((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === habitId ? { ...habit, isEnabled: !habit.isEnabled } : habit,
      ),
    }))
  }

  function toggleReminder() {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        remindersEnabled: !current.settings.remindersEnabled,
      },
    }))
  }

  function setTheme(theme: ThemeMode) {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        theme,
      },
    }))
  }

  return {
    state,
    todayKey,
    todayEntry,
    todayProgress,
    isAddHabitOpen,
    addHabit,
    closeAddHabit: () => setIsAddHabitOpen(false),
    openAddHabit: () => setIsAddHabitOpen(true),
    setEnergy,
    setMood,
    setSelfNote,
    setTheme,
    submitTodayCheckIn,
    toggleHabit,
    toggleHabitEnabled,
    toggleReminder,
  }
}

export type AppDataController = ReturnType<typeof useAppData>
