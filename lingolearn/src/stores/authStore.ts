import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/data/mockData'
import { generateId } from '@/utils/helpers'
import { addData, getDataByIndex } from '@/data/database'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addExperience: (amount: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const users = await getDataByIndex<User>('users', 'email', email)
          const user = users[0]

          if (user) {
            const storedPassword = localStorage.getItem(`password_${user.id}`)
            if (storedPassword === password) {
              set({ user, isAuthenticated: true, isLoading: false })
              return true
            }
          }

          set({ isLoading: false })
          return false
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          return false
        }
      },

      register: async (email: string, username: string, password: string) => {
        set({ isLoading: true })
        try {
          const users = await getDataByIndex<User>('users', 'email', email)
          if (users.length > 0) {
            set({ isLoading: false })
            return false
          }

          const newUser: User = {
            id: generateId(),
            email,
            username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            level: 1,
            experience: 0,
            joinDate: new Date().toISOString(),
          }

          await addData('users', newUser)
          localStorage.setItem(`password_${newUser.id}`, password)

          set({ user: newUser, isAuthenticated: true, isLoading: false })
          return true
        } catch (error) {
          console.error('Registration error:', error)
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates }
          set({ user: updatedUser })
        }
      },

      addExperience: (amount: number) => {
        const currentUser = get().user
        if (currentUser) {
          const newExperience = currentUser.experience + amount
          const newLevel = Math.floor(newExperience / 1000) + 1
          const updatedUser = { ...currentUser, experience: newExperience, level: newLevel }
          set({ user: updatedUser })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
