import { create } from 'zustand'

interface AuthStore {
    isAuthenticated: boolean
    checkAuth: () => void
    logout: () => void
}

const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,

    checkAuth: () => {
        const token = localStorage.getItem('token')
        if (token) {
            set({ isAuthenticated: true })
        }
    },

    login: () => {
        set({ isAuthenticated: true })
        const token = localStorage.getItem('token')
        if (token) {
            // useAuthStore.getState().checkPurchasedCourses(token)
        }
    },

    logout: () => {
        set({
            isAuthenticated: false,
            // hasPurchasedCourses: false,
        })
        localStorage.removeItem('token')
    },
}))

export default useAuthStore
