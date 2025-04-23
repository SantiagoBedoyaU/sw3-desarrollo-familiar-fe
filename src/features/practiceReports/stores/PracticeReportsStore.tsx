import { create } from 'zustand'
import Swal from 'sweetalert2'
import PracticeReport, { PracticeReportCreate } from '../entities/PracticeReport'
import { practiceService } from '../services/PraticeReportService'
import { ResponseEntity } from '../../../shared/types/reactTypes/ResponseEntity'

interface PracticeReportState {
  filteredPracticeReports: PracticeReport[]
  practiceReports: PracticeReport[]
  topPracticeReports: PracticeReport[]
  isLoadingFilters: boolean
  isLoading: boolean
  isLoadingTop: boolean
  error: Error | null
  errorTop: Error | null

  fetchPracticeReports: () => Promise<void>
  refreshPracticeReports: () => Promise<void>
  addPracticeReport: (practiceReport: Omit<PracticeReportCreate, '_id'>) => Promise<void>
  deletePracticeReport: (_id: string) => Promise<void>
  editPracticeReport: (_id: string, updatedPracticeReport: PracticeReport) => Promise<void>
  filterPracticeReports: (searchFilters: {
    title: string
    authors: string
    keywords: string
    primaryThematicAxis: string
    secondaryThematicAxis: string
  }) => void
  clearFilters: () => void

  fetchTopPracticeReports: () => Promise<void>
  refreshTopPracticeReports: () => Promise<void>
}

export const usePracticeReportStore = create<PracticeReportState>((set, get) => ({
  filteredPracticeReports: [],
  practiceReports: [],
  topPracticeReports: [],
  isLoading: false,
  isLoadingFilters: false,
  isLoadingTop: false,
  error: null,
  errorTop: null,

  fetchPracticeReports: async () => {
    if (get().practiceReports.length > 0 && !get().isLoading) return

    try {
      set({ isLoading: true })

      const responsePracticeReports: ResponseEntity<PracticeReport> | null =
        await practiceService.getAll().catch((error: unknown) => {
          void Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los reportes de práctica.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
          console.error(error)
          return null
        })

      if (!responsePracticeReports) {
        throw new Error('No se encontraron reportes de práctica disponibles')
      }

      const practiceReports = responsePracticeReports.data

      if (practiceReports.length === 0) {
        await Swal.fire({
          title: 'Sin reportes disponibles',
          text: 'No hay reportes de práctica disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        practiceReports,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error fetching practice reports:', err)
      const error =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener reportes de práctica')
      set({ error, isLoading: false })
    }
  },

  refreshPracticeReports: async () => {
    try {
      set({ isLoading: true })

      const responsePracticeReports = await practiceService.getAll().catch((error: unknown) => {
        void Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al obtener los reportes de práctica.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
        console.error(error)
        return null
      })

      if (!responsePracticeReports) {
        throw new Error('No se encontraron reportes de práctica disponibles')
      }

      const practiceReports = responsePracticeReports.data

      if (practiceReports.length === 0) {
        await Swal.fire({
          title: 'Sin reportes disponibles',
          text: 'No hay reportes de práctica disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        practiceReports,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error refreshing practice reports:', err)
      const error =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener reportes de práctica')
      set({ error, isLoading: false })
    }
  },

  addPracticeReport: async (practiceReport: Omit<PracticeReportCreate, '_id'>) => {
    await practiceService.create(practiceReport)
  },

  deletePracticeReport: async (_id: string) => {
    try {
      await practiceService.delete(_id).catch(() => {
        void Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al eliminar el reporte de práctica.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
        return false
      })
    } catch (error) {
      console.error('Error deleting practice report:', error)
    }
  },

  editPracticeReport: async (_id: string, updatedPracticeReport: PracticeReport) => {
    try {
      await Promise.resolve()
      set((state) => ({
        practiceReports: state.practiceReports.map((report) =>
          report._id === _id ? { ...updatedPracticeReport } : report,
        ),
        topPracticeReports: state.topPracticeReports.map((report) =>
          report._id === _id ? { ...updatedPracticeReport } : report,
        ),
      }))
    } catch (error) {
      console.error('Error editing practice report:', error)
    }
  },

  fetchTopPracticeReports: async () => {
    if (get().topPracticeReports.length > 0 && !get().isLoadingTop) return

    try {
      set({ isLoadingTop: true })

      const topPracticeReports: PracticeReport[] = await practiceService.getTopPracticeReports()

      if (topPracticeReports.length === 0) {
        await Swal.fire({
          title: 'Sin reportes disponibles',
          text: 'No hay reportes de práctica disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        topPracticeReports,
        isLoadingTop: false,
        errorTop: null,
      })
    } catch (err) {
      console.error('Error fetching top practice reports:', err)
      const errorTop =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener reportes destacados')
      set({ errorTop, isLoadingTop: false })
    }
  },

  refreshTopPracticeReports: async () => {
    try {
      set({ isLoadingTop: true })

      const topPracticeReports = await practiceService.getTopPracticeReports()

      if (topPracticeReports.length === 0) {
        await Swal.fire({
          title: 'Sin reportes disponibles',
          text: 'No hay reportes de práctica disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        topPracticeReports: topPracticeReports.slice(0, 5),
        isLoadingTop: false,
        errorTop: null,
      })
    } catch (err) {
      console.error('Error refreshing top practice reports:', err)
      const errorTop =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener reportes destacados')
      set({ errorTop, isLoadingTop: false })
    }
  },

  filterPracticeReports: (searchFilters) => {
    const params = new URLSearchParams()
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })
    const queryString = params.toString()
    set({ isLoadingFilters: true })
    practiceService
      .getFilters(queryString)
      .then((response) => {
        const practiceReports = response.data
        set({ filteredPracticeReports: practiceReports })
        if (practiceReports.length === 0) {
          void Swal.fire({
            title: 'Sin reportes disponibles',
            text: 'No hay reportes de práctica disponibles en este momento.',
            icon: 'info',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
        }
        set({ isLoadingFilters: false })
      })
      .catch((error: unknown) => {
        console.error('Error filtering practice reports:', error)
        set({
          error: error instanceof Error ? error : new Error('Unknown error'),
          isLoadingFilters: false,
        })
      })
  },

  clearFilters() {
    set({ filteredPracticeReports: [] })
  },
}))
