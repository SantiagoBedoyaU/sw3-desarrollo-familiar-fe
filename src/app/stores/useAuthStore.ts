import { create } from 'zustand'
import { getLocalStorageToken } from '../../features/auth/utils/verifyLocalToken'

interface AuthStore {
  isAuthenticated: boolean
  checkAuth: () => void
  logout: () => void
  login: () => void
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,

  checkAuth: () => {
    const token = getLocalStorageToken()
    if (token) {
      set({ isAuthenticated: true })
    }
  },

  login: () => {
    set({ isAuthenticated: true })
    const token = getLocalStorageToken()
    if (token) {
      // useAuthStore.getState().checkPurchasedCourses(token)
    }
  },

  logout: () => {
    set({
      isAuthenticated: false,
      // hasPurchasedCourses: false,
    })
    window.location.reload()
    localStorage.removeItem('signIn')
    localStorage.removeItem('token')
  },
}))

export default useAuthStore
