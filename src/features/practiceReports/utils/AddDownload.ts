import Swal from 'sweetalert2'
import { practiceService } from '../services/PraticeReportService'
import PracticeReport from '../entities/PracticeReport'

const downloadPracticeReport = async (practiceReport: PracticeReport) => {
  await practiceService
    .downloadWithPractice(practiceReport)
    .catch((error: unknown) => {
      void Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al descargar el artículo.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4B5563',
      })
      console.error(error)
      return null
    })
}

export default downloadPracticeReport
