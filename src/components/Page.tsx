import type { ReactNode } from 'react'

export function Page({ children }: { children: ReactNode }) {
  return <section className="px-5 pb-4 pt-5">{children}</section>
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <header className="mb-5">
      <h1 className="text-[28px] font-black leading-tight tracking-normal text-[var(--text)]">
        {title}
      </h1>
      {subtitle ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{subtitle}</p> : null}
    </header>
  )
}
