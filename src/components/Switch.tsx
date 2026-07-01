export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={checked}
      className={`pressable flex h-8 w-[54px] items-center rounded-full p-1 ${
        checked ? 'justify-end bg-[#7C63F5]' : 'justify-start bg-[var(--soft-line)]'
      }`}
      onClick={onChange}
      type="button"
    >
      <span className="size-6 rounded-full bg-white shadow-sm" />
    </button>
  )
}
