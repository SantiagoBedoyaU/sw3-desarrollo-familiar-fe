import axios from 'axios'
import PracticeReport, {
  PracticeReportCreate,
} from '../entities/PracticeReport'
import { ApiService } from '../../../shared/services/ApiService'
import Config from '../../../app/config/Config'
import { ResponseEntity } from '../../../shared/types/reactTypes/ResponseEntity'
import Swal from 'sweetalert2'

export class PracticeReportService extends ApiService<PracticeReport> {
  constructor() {
    super('practice-reports')
  }

  async downloadPractice(practiceId: string): Promise<void> {
    try {
      const response = await axios.get(this.getUrl(`${practiceId}/download`), {
        ...Config.defaultConfig,
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `practica-report-${practiceId}.pdf`)
      link.target = '_blank' // Abre el archivo en una nueva pestaña
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Limpia el objeto URL para liberar memoria
    } catch (error) {
      this.handleError(error, 'Error downloading practice report')
    }
  }

  async downloadWithPractice(practiceReport: PracticeReport): Promise<void> {
    try {
      const response = await axios.get(
        this.getUrl(`${practiceReport._id}/download`),
        {
          ...Config.defaultConfig,
          responseType: 'blob',
        },
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `practiceReport-${practiceReport.title}-${practiceReport._id}.pdf`,
      )
      link.target = '_blank' // Abre el archivo en una nueva pestaña
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Limpia el objeto URL para liberar memoria
    } catch (error) {
      this.handleError(error, 'Error downloading practiceReport')
    }
  }

  async getTopPracticeReports(): Promise<PracticeReport[]> {
    try {
      const response = await axios.get(
        this.getUrl('top-5'),
        Config.defaultConfig,
      )
      return response.data
    } catch (error) {
      return this.handleError(error, 'Error getting practice reports top')
    }
  }

  async getFilters(
    queryString: string,
  ): Promise<ResponseEntity<PracticeReport>> {
    try {
      const response = await axios.get<ResponseEntity<PracticeReport>>(
        this.getUrl(`?${queryString}`),
        Config.defaultConfig,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Error getting filters')
    }
  }

  async create(
    data: Omit<PracticeReportCreate, '_id'>,
  ): Promise<PracticeReport> {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('period', data.period)
    formData.append('institutionId', data.institutionId)
    formData.append('authors', data.authors.join(','))
    formData.append('primaryThematicAxis', data.primaryThematicAxis)
    formData.append('secondaryThematicAxis', data.secondaryThematicAxis ?? '')
    formData.append('keywords', data.keywords.join(','))
    formData.append('summary', data.summary)

    if (data.researchArticle) {
      formData.append('researchArticle', data.researchArticle)
    }
    if (!data.file) {
      throw new Error('File is undefined')
    }
    const cleanName = data.file.name.normalize('NFD').replace(/[̀-ͯ]/g, '') // quita acentos
    const safeFileName = cleanName.replace(/[^a-zA-Z0-9-.]/g, '-')
    const renamedFile = new File([data.file], safeFileName, {
      type: data.file.type,
    })
    formData.append('file', renamedFile)

    const url = this.getUrl('')

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
      body: formData,
    }

    try {
      const response = await fetch(url, {
        ...options,
        body: formData as unknown as BodyInit,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${String(response.status)}`)
      }
      const practiceReport = (await response.json()) as PracticeReport
      console.log(practiceReport)

      return practiceReport
    } catch (err: unknown) {
      console.error('Error:', err)
      void Swal.fire({
        title: 'Error',
        text:
          'Ocurrió un error al agregar el reporte de práctica. ' +
          (err instanceof Error
            ? err.message
            : 'Inténtalo de nuevo más tarde.'),
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4B5563',
      })
      throw err
    }
  }

  addView = async (id: string): Promise<PracticeReport> => {
    try {
      const response = await axios.get(this.getUrl(id), Config.defaultConfig)
      if (response.status !== 200) {
        void Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir la vista al reporte de práctica',
        })
        throw new Error('Failed to add view to the practice report')
      }
      return response.data as PracticeReport
    } catch (error) {
      console.error('Error adding view:', error)
      throw error
    }
  }
}
export const practiceService = new PracticeReportService()
