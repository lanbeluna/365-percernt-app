import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import type { Habit } from '../types/app'

const REMINDER_SOURCE = 'habit-reminder'

function notificationId(habitId: string) {
  let hash = 0

  for (const character of habitId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }

  return 1000 + (hash % 2_000_000_000)
}

function parseReminderTime(value: string) {
  const [hour, minute] = value.split(':').map(Number)
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return { hour, minute }
}

async function hasNotificationPermission(requestIfNeeded: boolean) {
  const current = await LocalNotifications.checkPermissions()
  if (current.display === 'granted') return true
  if (!requestIfNeeded) return false

  const requested = await LocalNotifications.requestPermissions()
  return requested.display === 'granted'
}

async function cancelScheduledHabitReminders() {
  const pending = await LocalNotifications.getPending()
  const reminders = pending.notifications
    .filter((notification) => notification.extra?.source === REMINDER_SOURCE)
    .map(({ id }) => ({ id }))

  if (reminders.length) {
    await LocalNotifications.cancel({ notifications: reminders })
  }
}

async function scheduleHabitReminders(habits: Habit[], requestPermission: boolean) {
  if (!Capacitor.isNativePlatform()) return true

  try {
    if (!(await hasNotificationPermission(requestPermission))) return false

    await cancelScheduledHabitReminders()

    const notifications = habits.flatMap((habit) => {
      if (!habit.isEnabled) return []
      const time = parseReminderTime(habit.reminderTime)
      if (!time) return []

      return [
        {
          id: notificationId(habit.id),
          title: `${habit.icon} ${habit.name}`,
          body: `完成一点点，也是在向生活靠近。${habit.minimumAction}`,
          schedule: { on: time },
          extra: { source: REMINDER_SOURCE, habitId: habit.id },
        },
      ]
    })

    if (notifications.length) {
      await LocalNotifications.schedule({ notifications })
    }

    return true
  } catch {
    return false
  }
}

export function enableHabitReminders(habits: Habit[]) {
  return scheduleHabitReminders(habits, true)
}

export function refreshHabitReminders(habits: Habit[]) {
  return scheduleHabitReminders(habits, false)
}

export async function disableHabitReminders() {
  if (!Capacitor.isNativePlatform()) return

  try {
    await cancelScheduledHabitReminders()
  } catch {
    // Reminder state still stays off when native cancellation is unavailable.
  }
}
