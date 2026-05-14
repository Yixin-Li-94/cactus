export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}小时${mins}分钟`
  }
  return `${mins}分钟`
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const calculateStreak = (studyDates: string[]): { current: number; longest: number } => {
  if (studyDates.length === 0) return { current: 0, longest: 0 }

  const sortedDates = [...new Set(studyDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  let prevDate: Date | null = null

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr)

    if (prevDate === null) {
      tempStreak = 1
      if (dateStr === today || dateStr === yesterday) {
        currentStreak = 1
      }
    } else {
      const diff = (prevDate.getTime() - date.getTime()) / 86400000
      if (diff === 1) {
        tempStreak++
        if (currentStreak > 0) currentStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
        if (currentStreak > 0 && dateStr !== today && dateStr !== yesterday) {
          currentStreak = 0
        }
      }
    }

    prevDate = date
  }

  longestStreak = Math.max(longestStreak, tempStreak)

  return { current: currentStreak, longest: longestStreak }
}

export const getLanguageName = (lang: string): string => {
  const names: Record<string, string> = {
    en: '英语',
    ja: '日语',
    ko: '韩语',
  }
  return names[lang] || lang
}

export const getLanguageFlag = (lang: string): string => {
  const flags: Record<string, string> = {
    en: '🇺🇸',
    ja: '🇯🇵',
    ko: '🇰🇷',
  }
  return flags[lang] || '🌐'
}

export const getLevelName = (level: string): string => {
  const names: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  }
  return names[level] || level
}

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-accent-500'
  if (percentage >= 50) return 'text-highlight-500'
  return 'text-primary-500'
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
