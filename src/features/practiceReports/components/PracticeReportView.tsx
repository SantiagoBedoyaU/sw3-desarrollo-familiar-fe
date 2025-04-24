import React, { useEffect, useState } from 'react'
import { Dialog } from '../../../shared/components/common/dialog/Dialog'
import { DialogContent } from '../../../shared/components/common/dialog/DialogContent'
import { DialogHeader } from '../../../shared/components/common/dialog/DialogHeader'
import { DialogTitle } from '../../../shared/components/common/dialog/DialogTitle'
import { DialogTrigger } from '../../../shared/components/common/dialog/DialogTrigger'
import PracticeReport from '../entities/PracticeReport'
import { Eye } from 'lucide-react'
import Swal from 'sweetalert2'
import { practiceService } from '../services/PraticeReportService'
import downloadPracticeReport from '../utils/AddDownload'
import { institutionService } from '../../institutions/services/InstitutionService'
import { articleService } from '../../articles/services/ArticlesService'
import Article from '../../articles/entities/Article'

interface PracticeReportViewProps {
  practiceReport: PracticeReport
  setUpdatedPracticeReports: React.Dispatch<React.SetStateAction<PracticeReport[]>>
}

const PracticeReportView: React.FC<PracticeReportViewProps> = ({
  practiceReport,
  setUpdatedPracticeReports,
}) => {
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [open, setOpen] = useState(false)
  const [institution, setInstitution] = useState('')
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false)
  const [article, setArticle] = useState<Article>({} as Article)

  useEffect(() => {
    void institutionService.getById(practiceReport.institution).then(res => {
      setInstitution(res.name)
    })
  }, [practiceReport.institution])

  useEffect(() => {
    if (practiceReport.researchArticle) {
      void articleService.getAll().then(res => {
        const foundArticle = res.data.find(
          article => article._id === practiceReport.researchArticle
        )
        if (foundArticle) {
          setArticle(foundArticle)
        } else {
          console.error('Article not found')
        }
      })
    }
  }, [practiceReport.researchArticle, practiceReport._id])

  const viewDownload = async () => {
    await downloadPracticeReport(practiceReport)
    const id = practiceReport._id
    setUpdatedPracticeReports(prev =>
      prev.map(report =>
        report._id === id
          ? { ...report, downloadCounter: (report.downloadCounter ?? 0) + 1 }
          : report
      )
    )
  }

  const viewDownloadArticle = async () => {
    if (practiceReport.researchArticle && article._id) {
      await articleService.downloadArticle(article)
    } else {
      console.error('Practice report is undefined')
      void Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo descargar el informe relacionado',
      })
    }
  }
  const addView = async (_id: string) => {
    try {
      const resReport = await practiceService.addView(_id)
      setUpdatedPracticeReports(prev =>
        prev.map(report =>
          report._id === resReport._id
            ? { ...resReport, counter: (resReport.counter ?? 0) + 1 }
            : report
        ),
      )
    } catch (error) {
      console.error('Error adding view:', error)
      void Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo añadir la vista al informe',
      })
    }
  }

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      className="relative md:absolute md:right-0 flex items-center justify-center w-full md:w-fit"
    >
      <DialogTrigger setOpen={setOpen} className="w-full h-fit">
        <button
          type="button"
          className="flex w-full md:w-fit h-fit items-center justify-center gap-2 p-2 border rounded-lg text-white bg-blue-500 border-gray-50 hover:bg-gray-600 hover:border-gray-800"
          onClick={() => practiceReport._id && void addView(practiceReport._id)}
        >
          <span><Eye size={16} className="w-4 h-4" /></span>
          <p className="text-sm">Ver informe completo</p>
        </button>
      </DialogTrigger>

      <DialogContent
        open={open}
        setOpen={setOpen}
        className="max-w-md sm:max-w-xl md:max-w-2xl m-auto h-screen"
      >
        <DialogHeader>
          <section className="flex justify-between items-center">
            <DialogTitle>
              <p className="text-lg font-bold">{practiceReport.title}</p>
            </DialogTitle>
          </section>
        </DialogHeader>

        <section className="space-y-4 py-2 flex flex-col justify-center w-full h-full overflow-auto">
          <section>
            <h3 className="text-md font-bold text-left">Resumen</h3>
            <p className="text-sm text-left p-2 text-gray-700">{practiceReport.summary}</p>
          </section>

          <section className="flex gap-6">
            <h3 className="text-md font-bold text-left">Publicación</h3>
            <p className="text-sm text-left">{practiceReport.period}</p>
          </section>

          {Array.isArray(practiceReport.keywords) && (
            <section>
              <h3 className="text-md text-left font-bold">
                Palabra{practiceReport.keywords.length > 1 && 's'} clave{practiceReport.keywords.length > 1 && 's'}
              </h3>
              <ul className="w-fit flex flex-wrap list-disc gap-1 md:gap-8 max-h-72 overflow-auto md:pl-1">
                {practiceReport.keywords.map((keyword: string) => (
                  <li key={`${practiceReport._id}-${keyword.trim()}`} className="ml-5 md:ml-4 text-sm text-gray-600">
                    {keyword.trim()}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {Array.isArray(practiceReport.authors) && (
            <section>
              <h3 className="text-md font-bold text-left">
                Autor{practiceReport.authors.length > 1 && 'es'}
              </h3>
              <ul className="w-fit flex flex-wrap list-disc gap-1 md:gap-10 max-h-72 overflow-auto md:pl-1">
                {practiceReport.authors.map((author: string) => (
                  <li key={`${practiceReport._id}-${author.trim()}`} className="ml-5 md:ml-4 text-sm text-gray-600">
                    {author.trim()}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="text-left">
            <h3 className="text-md font-bold text-left my-4">Ejes temáticos</h3>
            <ul className="flex flex-col list-disc gap-1 md:gap-2 max-h-72 overflow-auto md:pl-1">
              <li className="text-sm">{practiceReport.primaryThematicAxis}</li>
              {practiceReport.secondaryThematicAxis !== 'undefined' && (
                <li className="text-sm">{practiceReport.secondaryThematicAxis}</li>
              )}
            </ul>
          </section>

          {
            institution && <section className='text-left flex flex-col gap-2'>
              <h3 className="text-md font-bold text-left">Institución</h3>
              <p className="text-sm text-left">{institution}</p>
            </section>
          }


          {practiceReport.researchArticle && (
            <section>
              <h3 className="text-md text-left font-bold">
                Articulo relacionado
              </h3>
              <section className="flex items-center gap-2">
                {/* <span className="text-sm">{article.practiceReport}</span> */}
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                  onClick={() => {
                    setIsSubmittingArticle(true)
                    void viewDownloadArticle().then(() => {
                      setIsSubmittingArticle(false)
                      setOpen(false)
                    })
                  }}
                >
                  {isSubmittingArticle ? (
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
                    'Descargar informe'
                  )}
                </button>
              </section>
            </section>
          )}


        </section>

        <section className="flex justify-between mt-4 gap-4 py-4 mx-1">
          <button
            type="button"
            className="btn-outline inline-flex w-full md:w-fit justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSubmittingReport(true)
              void viewDownload().then(() => {
                setIsSubmittingReport(false)
                setOpen(false)
              })
            }}
            disabled={isSubmittingReport}
            className="btn-primary inline-flex w-full md:w-fit justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmittingReport ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z" />
              </svg>
            ) : (
              'Descargar informe'
            )}
          </button>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default PracticeReportView
