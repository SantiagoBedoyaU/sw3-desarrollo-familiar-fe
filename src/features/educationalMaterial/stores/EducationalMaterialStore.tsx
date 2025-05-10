import { create } from 'zustand'
import Swal from 'sweetalert2'
import EducationalMaterial, { EducationalMaterialCreate, EducationalMaterialUpdate } from '../entities/EducationalMaterial'
import { educationalMaterialService } from '../services/EducationalMaterialService'
import { ResponseEntity } from '../../../shared/types/reactTypes/ResponseEntity'

interface EducationalMaterialState {
  // State
  materials: EducationalMaterial[]
  filteredMaterials: EducationalMaterial[]
  isLoading: boolean
  isLoadingFilters: boolean
  error: Error | null

  // Actions
  fetchMaterials: () => Promise<void>
  refreshMaterials: () => Promise<void>
  addMaterial: (material: EducationalMaterialCreate) => Promise<void>
  deleteMaterial: (_id: string) => Promise<void>
  editMaterial: (_id: string, updatedMaterial: EducationalMaterialUpdate) => Promise<EducationalMaterial | null>
  filterMaterials: (searchFilters: {
    type?: string
    minAge?: number
    maxAge?: number
    title?: string
  }) => void
  clearFilters: () => void
}

export const useEducationalMaterialStore = create<EducationalMaterialState>((set, get) => ({
  materials: [],
  filteredMaterials: [],
  isLoading: false,
  isLoadingFilters: false,
  error: null,

  fetchMaterials: async () => {
    if (get().materials.length > 0 && !get().isLoading) return

    try {
      set({ isLoading: true })

      const response: ResponseEntity<EducationalMaterial> | null =
        await educationalMaterialService.getAll().catch((error: unknown) => {
          void Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los materiales educativos.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
          console.error(error)
          return null
        })

      if (!response) {
        throw new Error('No se encontraron materiales educativos disponibles')
      }

      const materials = response.data

      if (materials.length === 0) {
        await Swal.fire({
          title: 'Sin materiales disponibles',
          text: 'No hay materiales educativos disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        materials: materials,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error fetching educational materials:', err)
      const error =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener materiales educativos')
      set({ error, isLoading: false })
    }
  },

  refreshMaterials: async () => {
    try {
      set({ isLoading: true })

      const response = await educationalMaterialService
        .getAll()
        .catch((error: unknown) => {
          void Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los materiales educativos.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
          console.error(error)
          return null
        })

      if (!response) {
        throw new Error('No se encontraron materiales educativos disponibles')
      }

      const materials = response.data

      if (materials.length === 0) {
        await Swal.fire({
          title: 'Sin materiales disponibles',
          text: 'No hay materiales educativos disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        materials: materials,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error refreshing educational materials:', err)
      const error =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener materiales educativos')
      set({ error, isLoading: false })
    }
  },

  addMaterial: async (material: EducationalMaterialCreate) => {
    try {
      await educationalMaterialService.create(material)
      // Refresh materials after successful addition
      await get().refreshMaterials()

      void Swal.fire({
        title: 'Éxito',
        text: 'Material educativo agregado correctamente.',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4B5563',
      })
    } catch (error) {
      console.error('Error adding educational material:', error)
    }
  },

  deleteMaterial: async (_id: string) => {
    try {
      await educationalMaterialService.delete(_id).catch(() => {
        void Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al eliminar el material educativo.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
        return false
      })

      // Refresh after successful deletion
      await get().refreshMaterials()

      void Swal.fire({
        title: 'Éxito',
        text: 'Material educativo eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4B5563',
      })
    } catch (error) {
      console.error('Error deleting educational material:', error)
    }
  },

  editMaterial: async (_id: string, updatedMaterial: EducationalMaterialUpdate): Promise<EducationalMaterial | null> => {
    try {
      const updated = await educationalMaterialService.update(_id, updatedMaterial)
        .catch(() => {
          void Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar el material educativo.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
          return null
        })

      if (updated) {
        // Refresh materials after successful update
        await get().refreshMaterials()

        void Swal.fire({
          title: 'Éxito',
          text: 'Material educativo actualizado correctamente.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      return updated
    } catch (error) {
      console.error('Error editing educational material:', error)
      return null
    }
  },

  filterMaterials: (searchFilters) => {
    const params = new URLSearchParams()
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        params.append(key, String(value))
      }
    })
    const queryString = params.toString()
    set({ isLoadingFilters: true })

    educationalMaterialService
      .getFilters(queryString)
      .then((response) => {
        const materials = response.data
        set({ filteredMaterials: materials })

        if (materials.length === 0) {
          void Swal.fire({
            title: 'Sin materiales disponibles',
            text: 'No hay materiales educativos que coincidan con los filtros aplicados.',
            icon: 'info',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
        }

        set({ isLoadingFilters: false })
      })
      .catch((error: unknown) => {
        console.error('Error filtering educational materials:', error)
        set({
          error: error instanceof Error ? error : new Error('Unknown error'),
          isLoadingFilters: false,
        })
      })
  },

  clearFilters: () => {
    set({ filteredMaterials: [] })
  },
}))
