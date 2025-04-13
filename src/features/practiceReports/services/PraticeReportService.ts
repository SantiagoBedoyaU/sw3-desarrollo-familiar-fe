import axios from 'axios'
import PracticeReport from '../entities/PracticeReport'
import { ApiService } from '../../../shared/services/ApiService'
import Config from '../../../app/config/Config'

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
}
export const practiceService = new PracticeReportService()
