import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Course, CourseProgress } from '@/data/mockData'
import { generateId } from '@/utils/helpers'
import { addData, putData, getAllData, getDataByIndex } from '@/data/database'

interface CourseState {
  courses: Course[]
  selectedCourse: Course | null
  selectedLanguage: string
  selectedLevel: string
  courseProgress: CourseProgress[]
  isLoading: boolean
  setCourses: (courses: Course[]) => void
  setSelectedCourse: (course: Course | null) => void
  setSelectedLanguage: (language: string) => void
  setSelectedLevel: (level: string) => void
  loadProgress: (userId: string) => Promise<void>
  updateProgress: (userId: string, courseId: string, lessonId: string, completed: boolean, score: number) => Promise<void>
  getCourseProgress: (userId: string, courseId: string) => CourseProgress | undefined
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      selectedCourse: null,
      selectedLanguage: 'all',
      selectedLevel: 'all',
      courseProgress: [],
      isLoading: false,

      setCourses: (courses: Course[]) => set({ courses }),

      setSelectedCourse: (course: Course | null) => set({ selectedCourse: course }),

      setSelectedLanguage: (language: string) => set({ selectedLanguage: language }),

      setSelectedLevel: (level: string) => set({ selectedLevel: level }),

      loadProgress: async (userId: string) => {
        set({ isLoading: true })
        try {
          const progress = await getDataByIndex<CourseProgress>('progress', 'userId', userId)
          set({ courseProgress: progress, isLoading: false })
        } catch (error) {
          console.error('Failed to load progress:', error)
          set({ isLoading: false })
        }
      },

      updateProgress: async (userId: string, courseId: string, lessonId: string, completed: boolean, score: number) => {
        const { courseProgress } = get()
        const existingProgress = courseProgress.find(
          p => p.courseId === courseId && p.lessonId === lessonId
        )

        if (existingProgress) {
          const updatedProgress = {
            ...existingProgress,
            completed,
            score: Math.max(existingProgress.score, score),
            lastStudied: new Date().toISOString(),
          }
          await putData('progress', updatedProgress)
          set({
            courseProgress: courseProgress.map(p =>
              p.id === updatedProgress.id ? updatedProgress : p
            ),
          })
        } else {
          const newProgress: CourseProgress = {
            id: generateId(),
            odId: userId,
            courseId,
            lessonId,
            completed,
            score,
            timeSpent: 0,
            lastStudied: new Date().toISOString(),
          }
          await addData('progress', newProgress)
          set({ courseProgress: [...courseProgress, newProgress] })
        }
      },

      getCourseProgress: (userId: string, courseId: string) => {
        return get().courseProgress.find(
          p => p.courseId === courseId
        )
      },
    }),
    {
      name: 'course-storage',
      partialize: (state) => ({
        selectedLanguage: state.selectedLanguage,
        selectedLevel: state.selectedLevel,
      }),
    }
  )
)
