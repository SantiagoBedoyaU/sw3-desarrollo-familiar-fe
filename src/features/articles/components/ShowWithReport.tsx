import React from 'react'
import PracticeReport from '../../practiceReports/entities/PracticeReport'

interface ShowWithReportProps {
  article: {
    practiceReport?: string;
  };
  associatedPracticeReport?: PracticeReport | null;
  isSubmittingPractice: boolean;
  setIsSubmittingPractice: (val: boolean) => void;
  viewDownloadPractice: () => Promise<void>;
  onClose: (val: boolean) => void;
}

const ShowWithReport: React.FC<ShowWithReportProps> = ({
  article,
  associatedPracticeReport,
  isSubmittingPractice,
  setIsSubmittingPractice,
  viewDownloadPractice,
  onClose,
}) => {
  if (!article.practiceReport) return null


  return (
    <section className="border border-gray-200 rounded-lg p-4 bg-blue-50">
      <h3 className="text-md text-left font-bold mb-3">
        Informe de Práctica Relacionado
      </h3>
      {associatedPracticeReport ? (
        <div className="space-y-2">
          <div className="flex flex-col">
            <span className="font-semibold">Título:</span>
            <span className="text-sm">{associatedPracticeReport.title}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">Período:</span>
            <span className="text-sm">{associatedPracticeReport.period}</span>
          </div>

          {Array.isArray(associatedPracticeReport.authors) &&
            associatedPracticeReport.authors.length > 0 && (
            <div className="flex flex-col">
              <span className="font-semibold">
                  Autor
                {associatedPracticeReport.authors.length > 1 ? 'es' : ''}:
              </span>
              <ul className="list-disc pl-5">
                {associatedPracticeReport.authors.map((author, index) => (
                  <li key={index} className="text-sm">
                    {author}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <section className="flex items-center gap-2 mt-2">
            <button
              type="button"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
              onClick={() => {
                setIsSubmittingPractice(true)
                void viewDownloadPractice().then(() => {
                  setIsSubmittingPractice(false)
                  onClose(false)
                })
              }}
            >
              {isSubmittingPractice ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cloud-arrow-down-fill mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z" />
                </svg>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-download mr-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                  </svg>
                  Descargar informe
                </>
              )}
            </button>

            <a
              href={`/practice-reports/${article.practiceReport}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
              Ver informe completo
            </a>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-sm text-gray-500 mb-2">
            Cargando información del informe...
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
              onClick={() => {
                setIsSubmittingPractice(true)
                void viewDownloadPractice().then(() => {
                  setIsSubmittingPractice(false)
                  onClose(false)
                })
              }}
            >
              {isSubmittingPractice ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cloud-arrow-down-fill mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z" />
                </svg>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-download mr-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                  </svg>
                  Descargar informe
                </>
              )}
            </button>

            <a
              href={article.practiceReport ? `/practice-reports/${article.practiceReport}` : '#'}
              target="_blank"
              rel="noreferrer"
              className="text-sm bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
              Ver informe completo
            </a>
          </div>
        </div>
      )}
    </section>
  )
}

export default ShowWithReport
