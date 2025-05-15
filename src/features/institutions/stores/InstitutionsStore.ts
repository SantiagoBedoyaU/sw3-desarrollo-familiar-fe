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
  editInstitution: (data: Institution) => Promise<void>
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
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar la institución.',
      })
    }
  },

  deleteInstitution: async (_id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la institución de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })

      if (!result.isConfirmed) return

      await institutionService.delete(_id)

      set((state) => ({
        institutions: state.institutions.filter((i) => i._id !== _id),
      }))

      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'La institución fue eliminada correctamente.',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error('Error deleting institution:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la institución.',
      })
    }
  },

  editInstitution: async (data) => {
    try {
      const updatedInstitution =
        await institutionService.updateInstitution(data)
      set((state) => ({
        institutions: state.institutions.map((i) =>
          i._id === updatedInstitution._id ? updatedInstitution : i,
        ),
      }))
    } catch (error: any) {
      console.error('Error updating institution:', error)
      let errorMessage = 'No se pudo actualizar la institución.'

      // Manejar mensajes específicos según el error del servidor
      if (error.response?.data?.message) {
        const serverError = error.response.data.message

        if (serverError.includes('ya existe')) {
          errorMessage = 'Ya existe una institución con este nombre.'
        } else if (serverError.includes('nombre no válido')) {
          errorMessage = 'El nombre contiene caracteres no permitidos.'
        } else if (serverError.includes('espacios')) {
          errorMessage = 'El nombre no debe comenzar ni terminar con espacios.'
        } else if (serverError.includes('requerido')) {
          errorMessage = 'El nombre de la institución es obligatorio.'
        } else {
          errorMessage = serverError
        }
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      })

      throw error
    }
  },
}))
