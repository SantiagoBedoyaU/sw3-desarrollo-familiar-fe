import { useEffect, useState } from 'react'
import { Download, Edit2, FileText, Trash2 } from 'lucide-react'
import PracticeReport from '../entities/PracticeReport'
import PracticeReportView from './PracticeReportView'
import { Modal } from '../../../shared/components/common/modal/Modal'
import { usePracticeReportStore } from '../stores/PracticeReportsStore'
import downloadPracticeReport from '../utils/AddDownload'
import useAuthStore from '../../../app/stores/useAuthStore'
import { getSignIn } from '../../auth/utils/getSignIn'
import PracticeReportEdit from './PracticeReportEdit'

interface PracticeReportsListProps {
  practiceReports: PracticeReport[]
}

function PracticeReportsList({ practiceReports }: Readonly<PracticeReportsListProps>) {
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false)
  const [isSubmittingDownload, setIsSubmittingDownload] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPracticeReport, setSelectedPracticeReport] = useState<PracticeReport | null>(null)
  const { deletePracticeReport } = usePracticeReportStore()
  const [updatedPracticeReports, setUpdatedPracticeReports] = useState(practiceReports)
  const { checkAuth } = useAuthStore()
  const [userRole, setUserRole] = useState(false)

  useEffect(() => {
    const signIn = getSignIn()
    if (signIn) setUserRole(signIn.userRole === 1 || signIn.userRole === 2)
  }, [checkAuth])

  const fromListDownload = async (report: PracticeReport) => {
    await downloadPracticeReport(report)
    const id = report._id
    setUpdatedPracticeReports((prev) =>
      prev.map((r) =>
        r._id === id
          ? { ...r, downloadCounter: (r.downloadCounter ?? 0) + 1 }
          : r
      )
    )
  }

  return updatedPracticeReports.map((report) => (
    <section
      key={report._id + report.title + report.period}
      className="grid col-span-1 sm:col-span-2 md:col-span-4 md:grid-flow-col justify-center items-center gap-2 sm:gap-6 md:gap-10 border border-blue-200 rounded-lg p-2 sm:p-4 bg-blue-50 h-fit"
    >
      <section className="flex flex-col items-center gap-2 md:gap-4 sm:col-span-2 md:col-span-4">
        <h3 className="h-fit flex flex-col gap-2 items-center justify-center font-bold text-blue-800 sm:col-span-2 underline text-center text-lg md:text-xl">
          <span>{report.title}</span>
          {report.researchArticle && (
            <span>
              <span
                className="ml-2 text-green-600 inline-flex items-center"
                title="Tiene informe de práctica asociado"
              >
                <FileText size={16} />
              </span>
            </span>
          )}
        </h3>
      </section>

      <section className="sm:col-span-1 text-sm text-center text-gray-600 gap-1 md:gap-2 flex flex-col">
        <span className="underline font-medium w-full ">Eje temático </span>
        <section>
          <span className="mx-2">•</span>
          {report.primaryThematicAxis}
        </section>
        {report.secondaryThematicAxis && (
          <section>
            <span className="mx-2">•</span>
            {report.secondaryThematicAxis}
          </section>
        )}
      </section>

      {Array.isArray(report.authors) && (
        <section className=" w-full md:w-fit  sm:col-span-1 text-sm text-center text-gray-600 flex flex-col items-center gap-2 md:gap-4">
          <span className="underline font-medium w-full ">
            Autor{report.authors.length > 1 ? 'es' : ''}
          </span>
          <ul className="w-fit flex flex-wrap flex-row justify-center items-center list-disc gap-1 md:gap-2 max-h-72 overflow-auto md:pl-1">
            {report.authors.map((author: string) => (
              <li
                key={`${report._id}-${author.trim()}`}
                className="w-fit ml-5 md:ml-4 text-sm text-gray-600 "
              >
                {author.trim()}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-1 col-span-1 sm:col-span-2 sm:grid-cols-2 justify-center gap-4 text-sm text-gray-600 md:mr-4 px-4">
        <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:justify-center gap-2">
          <p>
            {report.counter} vista{report.counter === 1 ? '' : 's'}{' '}
          </p>
          <p>
            {report.downloadCounter} descarga
            {report.downloadCounter === 1 ? '' : 's'}
          </p>
        </section>

        {userRole && (
          <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedPracticeReport(report)
                setIsEditModalOpen(true)
              }}
              className="w-full md:w-fit flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
            >
              <Edit2 size={16} className="mr-1" />
              <span>Editar</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="w-full md:w-fit flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
            >
              <Trash2 size={16} className="mr-1" />
              <span>Eliminar</span>
            </button>
          </section>
        )}

        <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:flex-col md:justify-center gap-2 relative">
          <button
            type="button"
            className="md:h-16 flex w-full md:w-fit  items-center justify-center rounded text-sm "
          >
            <PracticeReportView
              practiceReport={report}
              setUpdatedPracticeReports={setUpdatedPracticeReports}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSubmittingDownload(true)
              setSelectedPracticeReport(report)
              void fromListDownload(report).then(() => {
                setIsSubmittingDownload(false)
                setSelectedPracticeReport(null)
              })
            }}
            className={
              'w-full md:w-fit flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 text-gray-900 rounded text-sm ' +
              (isSubmittingDownload ? 'cursor-not-allowed py-1 px-3' : '')
            }
          >
            {isSubmittingDownload && selectedPracticeReport?._id === report._id ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cloud-arrow-down-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z" />
              </svg>
            ) : (
              <section className="w-full md:w-fit flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 text-gray-800 py-1 px-3 rounded text-sm">
                <Download size={16} className="mr-1" />
                <span>Descargar</span>
              </section>
            )}
          </button>
        </section>
      </section>

      {isEditModalOpen && selectedPracticeReport?._id === report._id && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-screen">
            <h2 className="text-xl font-bold mb-4">Editar Informe de Práctica</h2>
            <PracticeReportEdit
              practiceReport={selectedPracticeReport}
              onClose={() => {
                setIsEditModalOpen(false)
                setSelectedPracticeReport(null)
              }}
              setUpdatedPracticeReports={setUpdatedPracticeReports}
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4">
          Confirmar Eliminación de informe práctico
        </h2>
        <p className="mb-4">
          ¿Estás seguro de que deseas eliminar el informe práctico{' '}
          <span className="font-semibold text-red-600">
            {report.period}{report.period ? ' - ' : ''}{report.title}
          </span>?
        </p>
        <section className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsDeleteConfirmOpen(false)}
            className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSubmittingDelete(true)
              void deletePracticeReport(report._id).then(() => {
                setIsDeleteConfirmOpen(false)
                setIsSubmittingDelete(false)
                window.location.reload()
              })
            }}
            disabled={isSubmittingDelete}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isSubmittingDelete ? 'Eliminando...' : 'Eliminar'}
          </button>
        </section>
      </Modal>
    </section>
  ))
}

export default PracticeReportsList
