import { Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import type { Habit, NewHabitInput } from '../types/app'

const icons = ['📚', '💧', '🧘', '🌙', '✍️', '🎧', '🍎', '🏃']

const emptyHabit: NewHabitInput = {
  icon: '📚',
  name: '',
  dailyTarget: '',
  minimumAction: '',
  reminderTime: '21:00',
}

export function AddHabitDrawer({
  habit,
  isOpen,
  onClose,
  onDelete,
  onSave,
}: {
  habit: Habit | null
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  onSave: (habit: NewHabitInput) => void
}) {
  const [form, setForm] = useState<NewHabitInput>(emptyHabit)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  useEffect(() => {
    setIsConfirmingDelete(false)
    if (!isOpen || !habit) {
      setForm(emptyHabit)
      return
    }

    setForm({
      icon: habit.icon,
      name: habit.name,
      dailyTarget: habit.dailyTarget,
      minimumAction: habit.minimumAction,
      reminderTime: habit.reminderTime,
    })
  }, [habit, isOpen])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim()) return

    onSave({
      icon: form.icon,
      name: form.name.trim(),
      dailyTarget: form.dailyTarget.trim() || form.name.trim(),
      minimumAction: form.minimumAction.trim() || '先做 2 分钟',
      reminderTime: form.reminderTime,
    })
  }

  return (
    <div className={`fixed inset-0 z-40 transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <button
        aria-label={habit ? '关闭编辑习惯' : '关闭添加习惯'}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        type="button"
      />
      <form
        className={`absolute inset-x-0 bottom-0 mx-auto max-h-[88dvh] max-w-[390px] overflow-y-auto rounded-t-[30px] bg-[var(--card)] px-5 pb-8 pt-4 shadow-[0_-18px_42px_rgba(37,29,70,0.16)] transition-transform duration-300 ease-out ${
          isOpen ? 'drawer-open translate-y-0' : 'translate-y-full'
        }`}
        onSubmit={submit}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--soft-line)]" />
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">{habit ? '编辑习惯' : '添加习惯'}</h2>
          <button
            className="grid size-9 place-items-center rounded-full bg-[var(--soft)] text-[var(--muted)]"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-8 gap-2">
          {icons.map((icon) => (
            <button
            className={`pressable grid size-9 place-items-center rounded-full text-lg ${
                form.icon === icon ? 'bg-[#EDE9FF] ring-2 ring-[#7C63F5]' : 'bg-[var(--soft)]'
              }`}
              key={icon}
              onClick={() => setForm((current) => ({ ...current, icon }))}
              type="button"
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          <DrawerInput
            label="习惯名称"
            onChange={(value) => setForm((current) => ({ ...current, name: value }))}
            placeholder="比如：背一个单词"
            value={form.name}
          />
          <DrawerInput
            label="每日目标"
            onChange={(value) => setForm((current) => ({ ...current, dailyTarget: value }))}
            placeholder="比如：完成一组听力练习"
            value={form.dailyTarget}
          />
          <DrawerInput
            label="最低行动"
            onChange={(value) => setForm((current) => ({ ...current, minimumAction: value }))}
            placeholder="比如：打开 App 2 分钟"
            value={form.minimumAction}
          />
          <DrawerInput
            label="提醒时间"
            onChange={(value) => setForm((current) => ({ ...current, reminderTime: value }))}
            type="time"
            value={form.reminderTime}
          />
        </div>

        <button className="pressable mt-5 w-full rounded-[22px] bg-[#7C63F5] py-4 text-base font-black text-white shadow-[0_12px_28px_rgba(124,99,245,0.28)]" type="submit">
          {habit ? '保存修改' : '保存习惯'}
        </button>

        {habit && (
          <div className="mt-4 border-t border-[var(--line)] pt-4">
            {isConfirmingDelete ? (
              <div>
                <p className="text-sm font-bold leading-5 text-[var(--muted)]">
                  删除后，这个习惯的历史打卡也会移除。
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    className="pressable rounded-[18px] bg-[var(--soft)] py-3 text-sm font-black text-[var(--text)]"
                    onClick={() => setIsConfirmingDelete(false)}
                    type="button"
                  >
                    先保留
                  </button>
                  <button
                    className="pressable rounded-[18px] bg-red-500 py-3 text-sm font-black text-white"
                    onClick={onDelete}
                    type="button"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="pressable flex w-full items-center justify-center gap-2 py-2 text-sm font-black text-red-500"
                onClick={() => setIsConfirmingDelete(true)}
                type="button"
              >
                <Trash2 size={17} />
                删除这个习惯
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

function DrawerInput({
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  label: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  value: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-[var(--muted)]">{label}</span>
      <input
        className="mt-2 w-full rounded-[18px] border border-[var(--line)] bg-[var(--input)] px-4 py-3 text-[15px] font-semibold text-[var(--text)] outline-none transition focus:border-[#7C63F5]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  )
}
