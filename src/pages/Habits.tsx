import { Bell, CalendarDays, Flame, Pencil, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Page, PageTitle } from '../components/Page'
import { Switch } from '../components/Switch'
import type { AppDataController } from '../hooks/useAppData'

export function HabitsPage({ app }: { app: AppDataController }) {
  return (
    <Page>
      <PageTitle title="我的习惯" subtitle="把目标放轻一点，才更容易每天回来。" />

      {app.state.habits.length ? (
        <div className="space-y-3">
          {app.state.habits.map((habit) => (
            <article className="soft-card p-4" key={habit.id}>
              <div className="flex items-start gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-[20px] bg-[#EDE9FF] text-2xl">
                  {habit.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-[17px] font-black">{habit.name}</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">{habit.frequency}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        aria-label={`编辑 ${habit.name}`}
                        className="pressable grid size-9 place-items-center rounded-full bg-[var(--soft)] text-[var(--muted)]"
                        onClick={() => app.openEditHabit(habit.id)}
                        title="编辑习惯"
                        type="button"
                      >
                        <Pencil size={16} />
                      </button>
                      <Switch
                        checked={habit.isEnabled}
                        label={`切换 ${habit.name}`}
                        onChange={() => app.toggleHabitEnabled(habit.id)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <InfoPill icon={<CalendarDays size={14} />} text={`最近 ${habit.lastCheckedAt}`} />
                    <InfoPill icon={<Flame size={14} />} text={`连续 ${habit.streak} 天`} />
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-5 text-[var(--muted)]">
                    <Bell className="mt-0.5 shrink-0" size={15} />
                    <span className="min-w-0">
                      {habit.reminderTime} 提醒 · 最低行动：{habit.minimumAction}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          message="从一个很小的动作开始，比如打开书 10 分钟，或睡前写一句话。"
          onAction={app.openAddHabit}
          title="还没有习惯"
        />
      )}

      <button
        className="pressable fixed inset-x-5 bottom-28 z-20 mx-auto flex max-w-[350px] items-center justify-center gap-2 rounded-full bg-[#7C63F5] py-4 font-black text-white shadow-[0_14px_30px_rgba(124,99,245,0.28)]"
        onClick={app.openAddHabit}
        type="button"
      >
        <Plus size={20} />
        添加习惯
      </button>
    </Page>
  )
}

function InfoPill({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="flex min-w-0 items-center gap-1 rounded-full bg-[var(--soft)] px-3 py-2 text-xs font-bold text-[var(--muted)]">
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </span>
  )
}
