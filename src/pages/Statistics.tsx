import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronRight as RowArrow,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Page } from '../components/Page'
import type { AppDataController } from '../hooks/useAppData'
import { formatRange, getWeekDates, shiftDate } from '../utils/date'
import { buildWeeklyTable, getHabitBallCount, getWeekCompletion } from '../utils/stats'

type Scope = '周' | '月' | '年'
type MainTab = '习惯打卡' | '番茄专注'

const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日']

export function StatisticsPage({ app }: { app: AppDataController }) {
  const [mainTab, setMainTab] = useState<MainTab>('习惯打卡')
  const [scope, setScope] = useState<Scope>('周')
  const [rangeOffset, setRangeOffset] = useState(0)

  const anchor = useMemo(() => shiftDate(new Date(), rangeOffset * 7), [rangeOffset])
  const weekDates = useMemo(() => getWeekDates(anchor), [anchor])
  const week = getWeekCompletion(app.state, anchor)
  const weeklyTable = buildWeeklyTable(app.state, anchor)
  const ballCount = getHabitBallCount(app.state.habits)
  const totalDone = weeklyTable.reduce(
    (sum, row) => sum + row.days.filter((day) => day.done).length,
    0,
  )
  const hasHabits = app.state.habits.length > 0

  return (
    <Page>
      <header className="relative flex items-center justify-center pb-4 pt-1">
        <button
          aria-label="闪光入口"
          className="pressable absolute left-0 grid size-11 place-items-center rounded-full bg-[var(--card)] text-[#7C63F5] shadow-[0_10px_26px_rgba(124,99,245,0.11)] ring-1 ring-[var(--line)]"
          type="button"
        >
          <Sparkles size={21} fill="currentColor" strokeWidth={1.8} />
        </button>
        <h1 className="text-[24px] font-black tracking-normal">统计</h1>
        <button
          aria-label="更多"
          className="pressable absolute right-0 grid size-11 place-items-center rounded-full bg-[var(--card)] text-[var(--text)] shadow-[0_10px_26px_rgba(42,36,72,0.08)] ring-1 ring-[var(--line)]"
          type="button"
        >
          <MoreHorizontal size={22} />
        </button>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 px-7">
        {(['习惯打卡', '番茄专注'] as MainTab[]).map((tab) => (
          <button
            className={`pressable rounded-full px-3 py-3 text-[15px] font-black ${
              mainTab === tab
                ? 'bg-[var(--soft)] text-[var(--text)] shadow-[inset_0_0_0_1px_var(--line)]'
                : 'text-[var(--muted)]'
            }`}
            key={tab}
            onClick={() => setMainTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <section className="soft-card mt-6 p-4">
        <div className="grid grid-cols-3 gap-2">
          {(['周', '月', '年'] as Scope[]).map((item) => (
            <button
              className={`pressable flex items-center justify-center gap-1.5 rounded-full border py-2.5 text-sm font-black ${
                scope === item
                  ? 'border-[#7C63F5] bg-[#7C63F5] text-white shadow-[0_10px_22px_rgba(124,99,245,0.18)]'
                  : 'border-[var(--line)] bg-[var(--card)] text-[var(--text)]'
              }`}
              key={item}
              onClick={() => setScope(item)}
              type="button"
            >
              <CalendarDays size={14} />
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            aria-label="上一个时间范围"
            className="pressable grid size-12 shrink-0 place-items-center rounded-full bg-[var(--card)] text-[var(--text)] shadow-[0_10px_24px_rgba(42,36,72,0.07)] ring-1 ring-[var(--line)]"
            onClick={() => setRangeOffset((value) => value - 1)}
            type="button"
          >
            <ChevronLeft size={23} />
          </button>
          <div className="min-w-0 text-center">
            <p className="text-sm font-bold text-[var(--muted)]">本{scope}</p>
            <p className="mt-1 whitespace-nowrap text-[21px] font-black tracking-wide">
              {formatRange(weekDates)}
            </p>
          </div>
          <button
            aria-label="下一个时间范围"
            className="pressable grid size-12 shrink-0 place-items-center rounded-full bg-[var(--card)] text-[var(--text)] shadow-[0_10px_24px_rgba(42,36,72,0.07)] ring-1 ring-[var(--line)]"
            onClick={() => setRangeOffset((value) => value + 1)}
            type="button"
          >
            <ChevronRight size={23} />
          </button>
        </div>
      </section>

      {mainTab === '番茄专注' ? (
        <section className="soft-card mt-5 p-6 text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-[#EDE9FF] text-4xl">
            🍅
          </div>
          <h2 className="mt-4 text-xl font-black">番茄专注</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            先用轻量 mock 数据占位，之后可以接入专注计时和专注统计。
          </p>
        </section>
      ) : hasHabits ? (
        <>
          <HabitBallCard ballCount={ballCount} />
          <CompletionCard rate={week.rate} completedDays={week.completedDays} totalDays={week.totalDays} />
          <WeeklyHabitTable rows={weeklyTable} totalDone={totalDone} />
        </>
      ) : (
        <div className="mt-5">
          <EmptyState
            message="添加第一个习惯后，这里会自动生成完成率和周打卡表。"
            onAction={app.openAddHabit}
            title="还没有统计数据"
          />
        </div>
      )}
    </Page>
  )
}

function HabitBallCard({ ballCount }: { ballCount: number }) {
  const balls = [
    { icon: '📚', label: '学习', className: 'from-[#F5F2FF] via-[#EDE9FF] to-[#B8AAFF]' },
    { icon: '💧', label: '补水', className: 'from-[#F5FAFF] via-[#DDEBFF] to-[#9FC7FF]' },
    { icon: '🌿', label: '放松', className: 'from-[#F5FFFB] via-[#DDF2EC] to-[#A8E0D0]' },
  ]

  return (
    <section className="soft-card mt-5 p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-13 shrink-0 place-items-center rounded-full bg-[var(--soft)] text-2xl">🫙</span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[20px] font-black">收集习惯小球</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            本月已经收集了 {ballCount} 个习惯小球
          </p>
        </div>
        <button className="pressable grid size-9 shrink-0 place-items-center rounded-full text-[var(--muted)]" type="button">
          <RowArrow size={21} />
        </button>
      </div>

      <div className="mt-5 rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(237,233,255,0.34),rgba(255,255,255,0.2))] p-4">
        <div className="flex min-h-36 items-end gap-3 overflow-hidden">
          {balls.map((ball, index) => (
            <div
              className="flex flex-col items-center gap-2"
              key={ball.label}
              style={{ transform: `translateY(${index === 1 ? -14 : index === 2 ? -4 : 8}px)` }}
            >
              <div
                className={`grid size-15 place-items-center rounded-full bg-gradient-to-br ${ball.className} text-2xl shadow-[inset_0_8px_16px_rgba(255,255,255,0.65),0_12px_24px_rgba(124,99,245,0.12)]`}
              >
                {ball.icon}
              </div>
              <span className="text-xs font-bold text-[var(--muted)]">{ball.label}</span>
            </div>
          ))}
          <div className="ml-auto mb-2 rounded-full bg-[#EDE9FF] px-3 py-1 text-xs font-black text-[#7C63F5]">
            +{ballCount}
          </div>
        </div>
      </div>
    </section>
  )
}

function CompletionCard({
  completedDays,
  rate,
  totalDays,
}: {
  completedDays: number
  rate: number
  totalDays: number
}) {
  return (
    <section className="soft-card mt-5 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[20px] font-black">本周完成率</h2>
          <p className="mt-2 text-sm leading-5 text-[var(--muted)]">
            完成天数 {completedDays} 天 / 总天数 {totalDays} 天
          </p>
          <p className="mt-4 inline-flex rounded-full bg-[#EDE9FF] px-3 py-2 text-xs font-black text-[#7C63F5]">
            保持舒服的节奏就好
          </p>
        </div>
        <div
          className="grid size-24 shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgba(124,99,245,0.08)]"
          style={{
            background: `conic-gradient(#7C63F5 ${rate * 3.6}deg, #EDE9FF 0deg)`,
          }}
        >
          <div className="grid size-[72px] place-items-center rounded-full bg-[var(--card)]">
            <span className="text-[24px] font-black">{rate}%</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function WeeklyHabitTable({
  rows,
  totalDone,
}: {
  rows: ReturnType<typeof buildWeeklyTable>
  totalDone: number
}) {
  if (!rows.length) {
    return (
      <div className="mt-5">
        <EmptyState message="添加习惯后，会自动生成这一周的打卡表。" title="周表格还没有内容" />
      </div>
    )
  }

  return (
    <section className="soft-card mt-5 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[548px]">
          <div className="grid grid-cols-[156px_repeat(7,56px)] border-b border-[var(--line)] bg-[var(--soft)] text-center text-[14px] font-black text-[var(--text)]">
            <div className="flex items-center gap-2 px-4 py-4 text-left">
              <span className="text-base">☷</span>
              全部
            </div>
            {weekdayLabels.map((label) => (
              <div className="border-l border-[var(--line)] py-4" key={label}>
                {label}
              </div>
            ))}
          </div>

          {rows.map((row) => (
            <div
              className="grid grid-cols-[156px_repeat(7,56px)] border-b border-[var(--line)] last:border-b-0"
              key={row.habit.id}
            >
              <div className="flex min-h-18 items-center gap-2 px-4 py-3">
                <span className="shrink-0 text-xl">{row.habit.icon}</span>
                <span className="truncate text-[15px] font-black">{row.habit.name}</span>
              </div>
              {row.days.map((day) => (
                <div
                  className="grid place-items-center border-l border-[var(--line)]"
                  key={`${row.habit.id}-${day.date}`}
                >
                  <span
                    className={`grid size-8 place-items-center rounded-full border-2 transition ${
                      day.done
                        ? 'animate-soft-pop border-[#C7E9E0] bg-[#DDF2EC] text-emerald-700'
                        : 'border-[var(--soft-line)] bg-[var(--card)] text-transparent'
                    }`}
                  >
                    <Check size={16} strokeWidth={3} />
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="py-4 text-center text-sm font-black text-[var(--muted)]">
        总计：{totalDone}
      </div>
    </section>
  )
}
