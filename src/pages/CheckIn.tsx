import { CheckCircle2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Page, PageTitle } from '../components/Page'
import type { AppDataController } from '../hooks/useAppData'
import type { EnergyLevel } from '../types/app'

const energyOptions: EnergyLevel[] = ['很有劲', '普通', '有点累', '只想躺着']
const moods = ['🙂', '🥰', '😴', '🌧️', '🌿', '✨']

export function CheckInPage({ app }: { app: AppDataController }) {
  const [saved, setSaved] = useState(false)
  const activeHabits = app.state.habits.filter((habit) => habit.isEnabled)

  function submit() {
    app.submitTodayCheckIn()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <Page>
      <PageTitle title="今日打卡" subtitle="今天的你，能量怎么样？不用满分，回来就好。" />

      <div className="grid grid-cols-2 gap-3">
        {energyOptions.map((energy) => {
          const active = app.todayEntry.energy === energy
          return (
            <button
              className={`pressable rounded-[22px] border px-4 py-4 text-sm font-black ${
                active
                  ? 'border-[#7C63F5] bg-[#EDE9FF] text-[#7C63F5]'
                  : 'border-[var(--line)] bg-[var(--card)] text-[var(--text)]'
              }`}
              key={energy}
              onClick={() => app.setEnergy(energy)}
              type="button"
            >
              {energy}
            </button>
          )
        })}
      </div>

      <section className="mt-6 space-y-3">
        {activeHabits.length ? (
          activeHabits.map((habit) => {
            const done = app.todayEntry.completedHabitIds.includes(habit.id)
            return (
              <button
                className={`pressable flex w-full gap-3 rounded-[24px] border p-4 text-left ${
                  done
                    ? 'border-[#DDF2EC] bg-[#F1FBF7]'
                    : 'border-[var(--line)] bg-[var(--card)]'
                }`}
                key={habit.id}
                onClick={() => app.toggleHabit(habit.id)}
                type="button"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-[18px] bg-[#DDEBFF] text-xl">
                  {habit.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-black">{habit.name}</span>
                  <span className="mt-1 block text-sm leading-5 text-[var(--muted)]">
                    最低行动：{habit.minimumAction}
                  </span>
                </span>
                <span className={done ? 'animate-soft-pop text-emerald-600' : 'text-[var(--soft-line)]'}>
                  <CheckCircle2 size={22} />
                </span>
              </button>
            )
          })
        ) : (
          <EmptyState
            message="还没有习惯也没关系，可以先添加一个 2 分钟就能开始的小行动。"
            onAction={app.openAddHabit}
            title="没有需要打卡的习惯"
          />
        )}
      </section>

      <label className="mt-6 block">
        <span className="font-black">今天想对自己说</span>
        <textarea
          className="mt-3 min-h-28 w-full resize-none rounded-[24px] border border-[var(--line)] bg-[var(--card)] p-4 text-[15px] leading-6 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[#7C63F5]"
          onChange={(event) => app.setSelfNote(event.target.value)}
          placeholder="写一句就好，比如：我已经做得不错了。"
          value={app.todayEntry.selfNote}
        />
      </label>

      <div className="mt-5">
        <p className="font-black">今日心情</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {moods.map((mood) => (
            <button
              className={`pressable grid size-12 shrink-0 place-items-center rounded-full text-xl ${
                app.todayEntry.mood === mood
                  ? 'bg-[#EDE9FF] ring-2 ring-[#7C63F5]'
                  : 'bg-[var(--card)] ring-1 ring-[var(--line)]'
              }`}
              key={mood}
              onClick={() => app.setMood(mood)}
              type="button"
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <button
        className="pressable mt-6 flex w-full items-center justify-center gap-2 rounded-[24px] bg-[#7C63F5] py-4 text-base font-black text-white shadow-[0_14px_30px_rgba(124,99,245,0.26)]"
        onClick={submit}
        type="button"
      >
        {saved ? '已保存今天 ✨' : '完成打卡 ✨'}
        <Sparkles size={18} />
      </button>
    </Page>
  )
}
