import { Plus } from 'lucide-react'

export function EmptyState({
  actionLabel = '添加一个小目标',
  message,
  onAction,
  title,
}: {
  actionLabel?: string
  message: string
  onAction?: () => void
  title: string
}) {
  return (
    <div className="rounded-[26px] border border-dashed border-[#CFC6FF] bg-[#F8F6FF] px-5 py-8 text-center shadow-[0_10px_26px_rgba(124,99,245,0.06)]">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-white text-2xl shadow-sm">
        🌱
      </div>
      <h3 className="mt-4 text-lg font-black text-[var(--text)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-60 text-sm leading-6 text-[var(--muted)]">{message}</p>
      {onAction ? (
        <button
          className="pressable mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#7C63F5] px-5 py-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(124,99,245,0.22)]"
          onClick={onAction}
          type="button"
        >
          <Plus size={17} />
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
