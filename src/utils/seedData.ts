import type { AppState, DailyEntry, Habit } from '../types/app'
import { shiftDate, toDateKey } from './date'

export const seedHabits: Habit[] = [
  {
    id: 'study',
    icon: '📚',
    name: '学习 1 小时',
    frequency: '每天',
    dailyTarget: '专注学习 1 小时',
    minimumAction: '打开书 10 分钟',
    reminderTime: '20:30',
    createdAt: toDateKey(shiftDate(new Date(), -30)),
    lastCheckedAt: toDateKey(),
    streak: 12,
    isEnabled: true,
  },
  {
    id: 'water',
    icon: '💧',
    name: '喝水 6 杯',
    frequency: '每天',
    dailyTarget: '喝够 6 杯水',
    minimumAction: '先喝一杯温水',
    reminderTime: '10:00',
    createdAt: toDateKey(shiftDate(new Date(), -26)),
    lastCheckedAt: toDateKey(),
    streak: 8,
    isEnabled: true,
  },
  {
    id: 'stretch',
    icon: '🧘',
    name: '拉伸 10 分钟',
    frequency: '每天',
    dailyTarget: '放松肩颈和腿部',
    minimumAction: '站起来转转肩',
    reminderTime: '21:40',
    createdAt: toDateKey(shiftDate(new Date(), -18)),
    lastCheckedAt: toDateKey(shiftDate(new Date(), -1)),
    streak: 5,
    isEnabled: true,
  },
  {
    id: 'sleep',
    icon: '🌙',
    name: '23:30 前睡觉',
    frequency: '工作日',
    dailyTarget: '23:30 前放下手机',
    minimumAction: '提前 10 分钟关灯',
    reminderTime: '23:00',
    createdAt: toDateKey(shiftDate(new Date(), -22)),
    lastCheckedAt: toDateKey(shiftDate(new Date(), -1)),
    streak: 3,
    isEnabled: true,
  },
  {
    id: 'journal',
    icon: '✍️',
    name: '写日记',
    frequency: '每天',
    dailyTarget: '写下今天的一句话',
    minimumAction: '只写一个关键词',
    reminderTime: '22:20',
    createdAt: toDateKey(shiftDate(new Date(), -14)),
    lastCheckedAt: toDateKey(shiftDate(new Date(), -2)),
    streak: 2,
    isEnabled: true,
  },
]

const weekPattern = [
  ['study', 'water', 'stretch', 'sleep'],
  ['study', 'water', 'journal'],
  ['study', 'water', 'stretch', 'sleep', 'journal'],
  ['study', 'stretch', 'journal'],
  ['study', 'water', 'sleep'],
  ['water', 'stretch'],
  ['study', 'water', 'stretch'],
]

function buildSeedEntries(): DailyEntry[] {
  const today = new Date()

  return Array.from({ length: 28 }, (_, index) => {
    const date = shiftDate(today, index - 27)
    const pattern = weekPattern[index % weekPattern.length]
    const key = toDateKey(date)

    return {
      date: key,
      completedHabitIds: key === toDateKey() ? ['study', 'water', 'stretch'] : pattern,
      energy: index % 4 === 0 ? '有点累' : '普通',
      mood: ['🙂', '🌿', '😴', '✨'][index % 4],
      selfNote: index % 5 === 0 ? '完成一点点，也是在向生活靠近。' : '',
      submittedAt: key === toDateKey() ? undefined : `${key}T22:10:00.000Z`,
    }
  })
}

export const defaultState: AppState = {
  habits: seedHabits,
  entries: buildSeedEntries(),
  settings: {
    theme: 'light',
    remindersEnabled: true,
  },
}
