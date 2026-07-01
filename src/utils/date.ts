export function toDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function formatHomeDate(date = new Date()) {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${date.getMonth() + 1}月${date.getDate()}日 · ${weekdays[date.getDay()]}`
}

export function shiftDate(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function getWeekDates(anchor = new Date()) {
  const day = anchor.getDay() || 7
  const monday = shiftDate(anchor, 1 - day)

  return Array.from({ length: 7 }, (_, index) => shiftDate(monday, index))
}

export function formatMonthDay(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

export function formatRange(dates: Date[]) {
  return `${formatMonthDay(dates[0])} → ${formatMonthDay(dates[dates.length - 1])}`
}
