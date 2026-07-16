import { Preferences } from '@capacitor/preferences'
import type { AppState } from '../types/app'
import { defaultState } from './seedData'

const STORAGE_KEY = '365-percent-v2'

function parseState(raw: string | null): AppState {
  try {
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

export function loadCachedState(): AppState {
  return parseState(localStorage.getItem(STORAGE_KEY))
}

export async function loadState(): Promise<AppState> {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY })
    const state = value ? parseState(value) : loadCachedState()
    const serialized = JSON.stringify(state)

    localStorage.setItem(STORAGE_KEY, serialized)
    if (!value) await Preferences.set({ key: STORAGE_KEY, value: serialized })

    return state
  } catch {
    return loadCachedState()
  }
}

export async function saveState(state: AppState): Promise<void> {
  const value = JSON.stringify(state)
  localStorage.setItem(STORAGE_KEY, value)

  try {
    await Preferences.set({ key: STORAGE_KEY, value })
  } catch {
    // The local cache keeps the web app usable if native storage is unavailable.
  }
}
