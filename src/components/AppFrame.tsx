import type { ReactNode } from 'react'
import type { ThemeMode } from '../types/app'

export function AppFrame({ children, theme }: { children: ReactNode; theme: ThemeMode }) {
  return (
    <main className={`app-theme ${theme}`}>
      <div className="min-h-screen bg-[var(--app-outer)] px-0 text-[var(--text)] transition-colors duration-300">
        <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[var(--app-bg)] shadow-[0_18px_50px_rgba(39,32,69,0.10)] transition-colors duration-300">
          <div className="min-h-screen pb-28">{children}</div>
        </div>
      </div>
    </main>
  )
}
