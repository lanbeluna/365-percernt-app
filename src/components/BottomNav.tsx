import { BarChart3, CirclePlus, Home, Sparkles, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/check-in', label: '打卡', icon: Sparkles },
  { to: '/statistics', label: '统计', icon: BarChart3 },
  { to: '/profile', label: '我的', icon: UserRound },
]

export function BottomNav({ onAddHabit }: { onAddHabit: () => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[390px] px-4 pb-5">
      <div className="grid grid-cols-[1fr_1fr_64px_1fr_1fr] items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--nav-bg)] p-2 shadow-[0_12px_32px_rgba(56,47,104,0.12)] backdrop-blur-xl">
        {navItems.slice(0, 2).map((item) => (
          <NavItem item={item} key={item.to} />
        ))}
        <button
          aria-label="添加习惯"
          className="pressable mx-auto flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-full bg-[#7C63F5] text-white shadow-[0_10px_24px_rgba(124,99,245,0.32)]"
          onClick={onAddHabit}
          type="button"
        >
          <CirclePlus size={22} />
          <span className="text-[10px] font-black leading-none">添加</span>
        </button>
        {navItems.slice(2).map((item) => (
          <NavItem item={item} key={item.to} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({
  item,
}: {
  item: {
    to: string
    label: string
    icon: typeof Home
  }
}) {
  const Icon = item.icon

  return (
    <NavLink
      className={({ isActive }) =>
        `pressable flex flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-[11px] font-semibold ${
          isActive ? 'bg-[#EDE9FF] text-[#7C63F5]' : 'text-[var(--muted)]'
        }`
      }
      end={item.to === '/'}
      to={item.to}
    >
      <Icon size={19} />
      <span>{item.label}</span>
    </NavLink>
  )
}
