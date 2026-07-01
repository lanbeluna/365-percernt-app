import { Check, Plus, Sparkles } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { Page } from '../components/Page'
import type { AppDataController } from '../hooks/useAppData'
import { formatHomeDate } from '../utils/date'

export function HomePage({ app }: { app: AppDataController }) {
  const activeHabits = app.state.habits.filter((habit) => habit.isEnabled)
  const hasHabits = activeHabits.length > 0

  return (
    <Page>
      <header className="flex items-start justify-between gap-4 pt-1">
        <div className="min-w-0">
          <p className="text-[26px] font-black leading-tight">早上好，Dylan ☀️</p>
          <p className="mt-2 text-sm font-medium text-[var(--muted)]">{formatHomeDate()}</p>
        </div>
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#EDE9FF] text-[#7C63F5]">
          <Sparkles size={21} />
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#7C63F5_0%,#9B8CFF_52%,#DDEBFF_100%)] p-5 text-white shadow-[0_16px_34px_rgba(124,99,245,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/80">连续打卡</p>
            <h1 className="mt-1 text-[34px] font-black leading-none">12 天</h1>
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold backdrop-blur">
            {app.todayProgress.completed} / {app.todayProgress.total}
          </div>
        </div>
        <p className="mt-7 max-w-64 text-[15px] leading-6 text-white/90">
          你正在慢慢变成自己喜欢的样子。
        </p>
        <div className="mt-5 h-2 rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${app.todayProgress.rate}%` }}
          />
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[21px] font-black">今日习惯</h2>
          <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs font-bold text-[var(--muted)]">
            完成 {app.todayProgress.rate}%
          </span>
        </div>

        {hasHabits ? (
          <div className="space-y-3">
            {activeHabits.map((habit) => {
              const done = app.todayEntry.completedHabitIds.includes(habit.id)
              return (
                <button
                  className={`pressable flex w-full items-center gap-3 rounded-[24px] border p-4 text-left shadow-[0_8px_24px_rgba(35,31,58,0.04)] ${
                    done
                      ? 'border-[#DDF2EC] bg-[#F1FBF7]'
                      : 'border-[var(--line)] bg-[var(--card)]'
                  }`}
                  key={habit.id}
                  onClick={() => app.toggleHabit(habit.id)}
                  type="button"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[18px] bg-[#F6F4FF] text-2xl">
                    {habit.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-black">{habit.name}</span>
                    <span className="mt-1 block truncate text-sm text-[var(--muted)]">
                      {habit.minimumAction}
                    </span>
                  </span>
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full border transition ${
                      done
                        ? 'animate-soft-pop scale-110 border-[#A9E1D2] bg-[#DDF2EC] text-emerald-700'
                        : 'border-[var(--soft-line)] text-transparent'
                    }`}
                  >
                    <Check size={17} strokeWidth={3} />
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <EmptyState
            message="先放一个很小的目标，比如喝一杯水。完成一点点，也是在向生活靠近。"
            onAction={app.openAddHabit}
            title="今天还没有小目标"
          />
        )}
      </section>

      <button
        className="pressable mt-5 flex w-full items-center justify-center gap-2 rounded-[24px] border border-dashed border-[#C7BAFF] bg-[#F7F4FF] py-4 font-black text-[#7C63F5]"
        onClick={app.openAddHabit}
        type="button"
      >
        <Plus size={19} />
        添加今天的小目标
      </button>
    </Page>
  )
}
