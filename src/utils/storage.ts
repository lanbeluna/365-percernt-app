import type { AppState } from '../types/app'
import { defaultState } from './seedData'

const STORAGE_KEY = '365-percent-v2'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState

    const parsed = JSON.parse(raw) as AppState
    return {
      habits: Array.isArray(parsed.habits) ? parsed.habits : defaultState.habits,
      entries: Array.isArray(parsed.entries) ? parsed.entries : defaultState.entries,
      settings: { ...defaultState.settings, ...parsed.settings },
    }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
