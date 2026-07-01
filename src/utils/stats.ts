import type { AppState, DailyEntry, Habit } from '../types/app'
import { getWeekDates, shiftDate, toDateKey } from './date'

export function findEntry(entries: DailyEntry[], dateKey: string) {
  return entries.find((entry) => entry.date === dateKey)
}

export function getTodayProgress(state: AppState, todayKey: string) {
  const activeHabits = state.habits.filter((habit) => habit.isEnabled)
  const entry = findEntry(state.entries, todayKey)
  const completed = entry?.completedHabitIds.filter((id) =>
    activeHabits.some((habit) => habit.id === id),
  ).length ?? 0

  return {
    completed,
    total: activeHabits.length,
    rate: activeHabits.length ? Math.round((completed / activeHabits.length) * 100) : 0,
  }
}

export function getWeekCompletion(state: AppState, anchor = new Date()) {
  const activeHabits = state.habits.filter((habit) => habit.isEnabled)
  const dates = getWeekDates(anchor)
  const completedDays = dates.filter((date) => {
    const entry = findEntry(state.entries, toDateKey(date))
    return entry && entry.completedHabitIds.length > 0
  }).length
  const maxChecks = Math.max(1, activeHabits.length * dates.length)
  const completedChecks = dates.reduce((sum, date) => {
    const entry = findEntry(state.entries, toDateKey(date))
    return sum + (entry?.completedHabitIds.length ?? 0)
  }, 0)

  return {
    dates,
    completedDays,
    totalDays: dates.length,
    rate: Math.round((completedChecks / maxChecks) * 100),
  }
}

export function buildWeeklyTable(state: AppState, anchor = new Date()) {
  const dates = getWeekDates(anchor)

  return state.habits.slice(0, 5).map((habit) => ({
    habit,
    days: dates.map((date) => {
      const key = toDateKey(date)
      return {
        date: key,
        done: findEntry(state.entries, key)?.completedHabitIds.includes(habit.id) ?? false,
      }
    }),
  }))
}

export function buildTrendPoints(state: AppState, anchor = new Date()) {
  const dates = Array.from({ length: 7 }, (_, index) => shiftDate(anchor, index - 6))
  const max = Math.max(1, state.habits.filter((habit) => habit.isEnabled).length)

  return dates.map((date) => {
    const count = findEntry(state.entries, toDateKey(date))?.completedHabitIds.length ?? 0
    return {
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.min(100, Math.round((count / max) * 100)),
    }
  })
}

export function buildHeatmap(state: AppState, anchor = new Date()) {
  return Array.from({ length: 28 }, (_, index) => {
    const date = shiftDate(anchor, index - 27)
    const key = toDateKey(date)
    return {
      date: key,
      count: findEntry(state.entries, key)?.completedHabitIds.length ?? 0,
    }
  })
}

export function getTotalCheckIns(state: AppState) {
  return state.entries.reduce((sum, entry) => sum + entry.completedHabitIds.length, 0)
}

export function getHabitBallCount(habits: Habit[]) {
  return Math.min(3, habits.filter((habit) => habit.isEnabled).length)
}
