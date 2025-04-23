import { useEffect } from 'react'
import PracticeReportsList from './PracticeReportsList'
import { usePracticeReportStore } from '../stores/PracticeReportsStore'

function PracticeReportsAllList() {
  const {
    isLoading,
    error,
    practiceReports,
    fetchPracticeReports,
    refreshPracticeReports,
  } = usePracticeReportStore()

  useEffect(() => {
    void fetchPracticeReports()
  }, [fetchPracticeReports])

  if (isLoading) return <section>Cargando informes prácticos...</section>
  if (error) return <section>Error: {error.message}</section>
  if (!practiceReports.length)
    return <section>No se encontraron informes prácticos disponibles</section>

  return (
    <section className="mt-14">
      <section className="flex flex-col md:flex-row items-center justify-center md:justify-between">
        <section className="w-full md:w-fit mb-4 flex flex-col items-center justify-between gap-4 bg-gray-50 p-4 rounded-md shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-2 md:w-fit text-center">
            <span className="text-blue-600 w-full md:w-fit">Nuestros informes prácticos</span>
          </h4>
        </section>
        <button
          onClick={() => void refreshPracticeReports()}
          className="w-full md:w-fit bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out mb-2"
        >
          Refrescar informes prácticos
        </button>
      </section>
      <section className="space-y-4">
        <PracticeReportsList practiceReports={practiceReports} />
      </section>
    </section>
  )
}

export default PracticeReportsAllList
