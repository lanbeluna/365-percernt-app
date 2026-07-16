import {
  Bell,
  ChevronRight,
  Cloud,
  HelpCircle,
  ListChecks,
  Moon,
  Settings,
  SmilePlus,
  Sun,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '../components/Page'
import { Switch } from '../components/Switch'
import type { AppDataController } from '../hooks/useAppData'
import { getTotalCheckIns } from '../utils/stats'

export function ProfilePage({ app }: { app: AppDataController }) {
  const navigate = useNavigate()
  const isDark = app.state.settings.theme === 'dark'
  const stats = [
    ['连续打卡', '12 天'],
    ['总打卡', `${getTotalCheckIns(app.state)} 次`],
    ['习惯数量', `${app.state.habits.length} 个`],
  ]

  return (
    <Page>
      <header className="rounded-[28px] bg-[linear-gradient(135deg,#EDE9FF_0%,#DDEBFF_100%)] p-5 text-stone-950 shadow-[0_12px_30px_rgba(124,99,245,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-[30px] font-black">Dylan</h1>
              <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-sm font-black text-[#7C63F5]">
                Lv.3
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
              记录每一个没有放弃的今天。
            </p>
          </div>
          <div className="grid size-15 shrink-0 place-items-center rounded-full bg-white/80 text-3xl shadow-sm">
            🌙
          </div>
        </div>
      </header>

      <section className="mt-5 grid grid-cols-3 gap-2.5">
        {stats.map(([label, value]) => (
          <div className="soft-card rounded-[22px] p-3 text-center" key={label}>
            <p className="text-[19px] font-black">{value}</p>
            <p className="mt-1 text-[11px] font-bold text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </section>

      <section className="soft-card mt-6 overflow-hidden rounded-[26px]">
        <SettingRow
          icon={<ListChecks size={19} />}
          label="我的习惯"
          onClick={() => navigate('/habits')}
        />
        <SettingRow
          icon={<Bell size={19} />}
          label="打卡提醒"
          right={
            <Switch
              checked={app.state.settings.remindersEnabled}
              label="打卡提醒"
              onChange={app.toggleReminder}
            />
          }
        />
        <SettingRow icon={<SmilePlus size={19} />} label="心情标签管理" />
        <SettingRow icon={<Cloud size={19} />} label="数据备份" />
        <SettingRow
          icon={isDark ? <Moon size={19} /> : <Sun size={19} />}
          label="主题模式"
          onClick={() => app.setTheme(isDark ? 'light' : 'dark')}
          right={<span className="text-sm font-black text-[#7C63F5]">{isDark ? '深色' : '浅色'}</span>}
        />
        <SettingRow icon={<HelpCircle size={19} />} label="帮助与反馈" />
        <SettingRow icon={<Settings size={19} />} label="设置" />
      </section>
    </Page>
  )
}

function SettingRow({
  icon,
  label,
  onClick,
  right,
}: {
  icon: ReactNode
  label: string
  onClick?: () => void
  right?: ReactNode
}) {
  return (
    <button
      className="pressable flex w-full items-center gap-3 border-b border-[var(--line)] px-4 py-4 text-left last:border-b-0"
      onClick={onClick}
      type="button"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[16px] bg-[var(--soft)] text-[#7C63F5]">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate font-black">{label}</span>
      {right ?? <ChevronRight className="shrink-0 text-[var(--muted)]" size={18} />}
    </button>
  )
}
