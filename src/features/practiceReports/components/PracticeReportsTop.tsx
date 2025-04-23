import { useEffect, useState } from 'react'
import { usePracticeReportStore } from '../stores/PracticeReportsStore'
import PracticeReportsList from './PracticeReportsList'

function PracticeReportsTop() {
  const { topPracticeReports, fetchTopPracticeReports, refreshPracticeReports } = usePracticeReportStore()

  const [countPracticeReports, setCountPracticeReports] = useState(topPracticeReports.length)

  useEffect(() => {
    void fetchTopPracticeReports()
  }, [fetchTopPracticeReports])

  useEffect(() => {
    setCountPracticeReports(topPracticeReports.length)
  }, [topPracticeReports])

  return (
    countPracticeReports > 0 ? (
      <PracticeReportsList practiceReports={topPracticeReports} />
    ) : (
      <section className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">No hay informes prácticos destacados</h2>
        <p className="text-lg">No se encontraron informes prácticos destacados en este momento.</p>
        <button type='button' onClick={() => void refreshPracticeReports()}>
          <span className="text-blue-500 hover:text-blue-700 underline">
            Actualizar
          </span>
        </button>
      </section>
    )
  )
}

export default PracticeReportsTop
