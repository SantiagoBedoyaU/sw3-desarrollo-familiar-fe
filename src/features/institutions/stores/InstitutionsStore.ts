import { create } from 'zustand'
import Institution, { InstitutionCreate } from '../entities/Institution'
import { institutionService } from '../services/InstitutionService'
import Swal from 'sweetalert2'

interface InstitutionState {
  institutions: Institution[]
  isLoading: boolean
  fetchInstitutions: () => Promise<void>
  addInstitution: (data: InstitutionCreate) => Promise<void>
  deleteInstitution: (_id: string) => Promise<void>
}

export const useInstitutionStore = create<InstitutionState>((set) => ({
  institutions: [],
  isLoading: false,

  fetchInstitutions: async () => {
    set({ isLoading: true })
    try {
      const response = await institutionService.getAll()
      set({ institutions: response.data, isLoading: false })
    } catch (error) {
      console.error('Error loading institutions:', error)
      set({ isLoading: false })
    }
  },

  addInstitution: async (data) => {
    try {
      const newInstitution = await institutionService.createInstitution(data)
      set((state) => ({
        institutions: [...state.institutions, newInstitution],
      }))
    } catch (error) {
      console.error('Error adding institution:', error)
    }
  },

  deleteInstitution: async (_id) => {
    try {
      await institutionService.delete(_id)
      set((state) => ({
        institutions: state.institutions.filter((i) => i._id !== _id),
      }))
    } catch (error) {
      console.error('Error deleting institution:', error)
    }
  },
}))
