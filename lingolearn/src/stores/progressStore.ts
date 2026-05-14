import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, calculateStreak } from '@/utils/helpers'
import { addData, putData, getDataByIndex } from '@/data/database'
import { StudyRecord, Achievement } from '@/data/mockData'
import { achievements as defaultAchievements } from '@/data/mockData'

interface ProgressState {
  todayMinutes: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  weeklyProgress: number[]
  vocabularyAccuracy: number
  grammarAccuracy: number
  speakingCount: number
  listeningAccuracy: number
  studyDates: string[]
  unlockedAchievements: Achievement[]
  isLoading: boolean

  addStudyTime: (minutes: number) => Promise<void>
  updateAccuracy: (type: 'vocabulary' | 'grammar' | 'listening', accuracy: number) => void
  incrementSpeaking: () => void
  loadProgress: (userId: string) => Promise<void>
  checkAchievements: () => Achievement[]
  getWeeklyStats: () => { day: string; minutes: number }[]
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      todayMinutes: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
      vocabularyAccuracy: 0,
      grammarAccuracy: 0,
      speakingCount: 0,
      listeningAccuracy: 0,
      studyDates: [],
      unlockedAchievements: [],
      isLoading: false,

      addStudyTime: async (minutes: number) => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]
        const newStudyDates = state.studyDates.includes(today)
          ? state.studyDates
          : [...state.studyDates, today]

        const { current, longest } = calculateStreak(newStudyDates)

        set({
          todayMinutes: state.todayMinutes + minutes,
          totalMinutes: state.totalMinutes + minutes,
          currentStreak: current,
          longestStreak: longest,
          studyDates: newStudyDates,
        })

        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weeklyProgress = [...state.weeklyProgress]
        const dayIndex = new Date().getDay()
        weeklyProgress[dayIndex] += minutes

        set({ weeklyProgress })
      },

      updateAccuracy: (type: 'vocabulary' | 'grammar' | 'listening', accuracy: number) => {
        const state = get()
        if (type === 'vocabulary') {
          const newAccuracy = (state.vocabularyAccuracy + accuracy) / 2
          set({ vocabularyAccuracy: newAccuracy })
        } else if (type === 'grammar') {
          const newAccuracy = (state.grammarAccuracy + accuracy) / 2
          set({ grammarAccuracy: newAccuracy })
        } else if (type === 'listening') {
          const newAccuracy = (state.listeningAccuracy + accuracy) / 2
          set({ listeningAccuracy: newAccuracy })
        }
      },

      incrementSpeaking: () => {
        set(state => ({ speakingCount: state.speakingCount + 1 }))
      },

      loadProgress: async (userId: string) => {
        set({ isLoading: true })
        try {
          const records = await getDataByIndex<StudyRecord>('studyRecords', 'userId', userId)

          if (records.length > 0) {
            const totalMinutes = records.reduce((sum, r) => sum + r.minutesStudied, 0)
            const studyDates = records.map(r => r.date)
            const { current, longest } = calculateStreak(studyDates)

            const today = new Date().toISOString().split('T')[0]
            const todayRecord = records.find(r => r.date === today)
            const todayMinutes = todayRecord?.minutesStudied || 0

            const weekStart = new Date()
            weekStart.setDate(weekStart.getDate() - weekStart.getDay())
            const weeklyProgress = [0, 0, 0, 0, 0, 0, 0]

            records.forEach(record => {
              const recordDate = new Date(record.date)
              if (recordDate >= weekStart) {
                const dayIndex = recordDate.getDay()
                weeklyProgress[dayIndex] = record.minutesStudied
              }
            })

            set({
              totalMinutes,
              todayMinutes,
              currentStreak: current,
              longestStreak: longest,
              studyDates,
              weeklyProgress,
              isLoading: false,
            })
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          console.error('Failed to load progress:', error)
          set({ isLoading: false })
        }
      },

      checkAchievements: () => {
        const state = get()
        const newUnlocks: Achievement[] = []

        defaultAchievements.forEach(achievement => {
          const isAlreadyUnlocked = state.unlockedAchievements.some(a => a.id === achievement.id)
          if (isAlreadyUnlocked) return

          let shouldUnlock = false

          switch (achievement.type) {
            case 'streak':
              shouldUnlock = state.currentStreak >= achievement.requirement
              break
            case 'hours':
              shouldUnlock = Math.floor(state.totalMinutes / 60) >= achievement.requirement
              break
            case 'vocabulary':
              shouldUnlock = state.vocabularyAccuracy >= 80
              break
            case 'grammar':
              shouldUnlock = state.grammarAccuracy >= 90
              break
            case 'speaking':
              shouldUnlock = state.speakingCount >= achievement.requirement
              break
            case 'listening':
              shouldUnlock = state.listeningAccuracy >= 100
              break
          }

          if (shouldUnlock) {
            const unlockedAchievement = {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date().toISOString(),
            }
            newUnlocks.push(unlockedAchievement)
          }
        })

        if (newUnlocks.length > 0) {
          set(state => ({
            unlockedAchievements: [...state.unlockedAchievements, ...newUnlocks],
          }))
        }

        return newUnlocks
      },

      getWeeklyStats: () => {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const state = get()

        return state.weeklyProgress.map((minutes, index) => ({
          day: days[index],
          minutes,
        }))
      },
    }),
    {
      name: 'progress-storage',
    }
  )
)
