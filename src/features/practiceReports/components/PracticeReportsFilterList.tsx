import PracticeReportsList from './PracticeReportsList'
import { usePracticeReportStore } from '../stores/PracticeReportsStore'

function PracticeReportsFilterList() {
  const { isLoadingFilters, error, filteredPracticeReports } = usePracticeReportStore()

  if (isLoadingFilters) return <section>Cargando informes prácticos...</section>
  if (error) return <section>Error: {error.message}</section>

  return (
    <section>
      <section className="mb-4 flex flex-col items-center justify-between gap-4 bg-gray-50 p-4 rounded-md shadow-md">
        <h4 className="text-lg font-bold text-gray-800 mb-2">
          <span className="text-blue-500">Informes prácticos destacados</span>
        </h4>
      </section>

      {!filteredPracticeReports.length && (
        <section className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-4 rounded-md shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-2">
            <span className="text-blue-500">No se encontraron informes prácticos</span>
          </h4>
          <p className="text-sm text-gray-600">No hay informes prácticos en este momento.</p>
        </section>
      )}

      {filteredPracticeReports.length > 0 && (
        <section className="space-y-4">
          <PracticeReportsList practiceReports={filteredPracticeReports} />
        </section>
      )}
    </section>
  )
}

export default PracticeReportsFilterList
