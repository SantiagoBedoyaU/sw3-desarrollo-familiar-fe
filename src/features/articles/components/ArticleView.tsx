import React, { useState } from 'react'
import { Dialog } from '../../../shared/components/common/dialog/Dialog'
import { DialogContent } from '../../../shared/components/common/dialog/DialogContent'
import { DialogHeader } from '../../../shared/components/common/dialog/DialogHeader'
import { DialogTitle } from '../../../shared/components/common/dialog/DialogTitle'
import { DialogTrigger } from '../../../shared/components/common/dialog/DialogTrigger'
import Article from '../../../shared/types/entities/Article'
import { Eye } from 'lucide-react'
import Swal from 'sweetalert2'
import { articleService } from '../../../shared/services/ArticlesService'
import downloadArticle from '../utils/AddDownload'

interface ArticleViewProps {
  article: Article
  incrementCounter: (id: string, article: Article) => void
  incrementDownload: (id: string) => void
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, incrementCounter, incrementDownload }) => {
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false)
  const [open, onClose] = useState(false)
  const viewDownload = async () => {
    await downloadArticle(article, incrementDownload)
  }
  const addView = async (_id: string) => {
    try {
      const resArticle = await articleService.addView(_id)
      incrementCounter(resArticle._id, resArticle)
    } catch (error) {
      console.error('Error adding view:', error)
      void Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo añadir la vista al artículo',
      })
    }
  }
  return (
    <Dialog
      open={open}
      setOpen={onClose}
      className="relative md:absolute md:right-0 flex items-center justify-center w-full md:w-fit"
    >
      <DialogTrigger setOpen={onClose} className="w-full h-fit">
        <button
          type='button'
          className="flex w-full md:w-fit h-fit items-center justify-center gap-2 p-2 border rounded-lg text-white bg-blue-500 border-gray-50 hover:bg-gray-600 hover:border-gray-800"
          onClick={() => article._id && void addView(article._id)}>
          <span>
            <Eye size={16} className="w-4 h-4" />
          </span>
          <p className="text-sm">Ver artículo completo</p>
        </button>
      </DialogTrigger>
      <DialogContent
        open={open}
        setOpen={onClose}
        className="max-w-md sm:max-w-xl md:max-w-2xl m-auto h-screen"
      >
        <DialogHeader>
          <section className="flex justify-between items-center">
            <DialogTitle>
              <p className="text-lg font-bold">{article.title}</p>
            </DialogTitle>
          </section>
        </DialogHeader>

        <section className="space-y-4 py-2 flex flex-col justify-center w-full h-full overflow-auto">
          <section>
            <h3 className="text-md font-bold text-left">Resumen</h3>
            <p className="text-sm text-left p-2 text-gray-700">
              {article.summary}
            </p>
          </section>
          <section className='flex gap-6'>
            <h3 className="text-md font-bold text-left">Año publicación</h3>
            <p className="text-sm text-left">{article.year}</p>
          </section>
          {Array.isArray(article.keywords) &&
            <section>
              <h3 className="text-md text-left font-bold">Palabra{article.keywords.length > 1 && 's'} clave{article.keywords.length > 1 && 's'}</h3>
              <p className="text-sm">{<ul className="w-fit flex flex-wrap flex-row justify-center items-center list-disc gap-1 md:gap-2 max-h-72 overflow-auto md:pl-1">
                {
                  article.keywords.map((keyword: string) => {
                    const trimmed = keyword.trim()
                    return (
                      <li
                        key={`${article._id}-${trimmed}`}
                        className="w-fit ml-5 md:ml-4 text-sm text-gray-600 "
                      >
                        {trimmed}
                      </li>
                    )
                  })}
              </ul>}</p>
            </section>}
          {Array.isArray(article.authors) &&
            <section>
              <h3 className="text-md font-bold text-left">Autor{article.authors.length > 1 && 'es'}</h3>
              <p className="text-sm"><ul className="w-fit flex flex-wrap flex-row justify-center items-center list-disc gap-1 md:gap-2 max-h-72 overflow-auto md:pl-1">
                {
                  article.authors.map((author: string) => {
                    const trimmed = author.trim()
                    return (
                      <li
                        key={`${article._id}-${trimmed}`}
                        className="w-fit ml-5 md:ml-4 text-sm text-gray-600 "
                      >
                        {trimmed}
                      </li>
                    )
                  })}
              </ul></p>
            </section>}

          <section className='text-left'>
            <h3 className="text-md font-bold text-left my-4">Ejes temáticos</h3>
            <section className='text-left w-fit flex flex-col justify-center items-center list-disc gap-1 md:gap-2 max-h-72 overflow-auto md:pl-1'>
              <p className="text-sm">{article.primaryThematicAxis}</p>
              {article.secondaryThematicAxis && (
                <p className="text-sm">{article.secondaryThematicAxis}</p>
              )}
            </section>
          </section>

          {article.file && (
            <section>
              <h3 className="text-md text-left font-bold">
                Informe relacionado
              </h3>
              <section className="flex items-center gap-2">
                <span className="text-sm">{article.file.name}</span>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  Descargar
                </button>
              </section>
            </section>
          )}
        </section>

        <section className="flex justify-between mt-4 gap-4 py-4 mx-1">
          <button
            type="button"
            className="btn-outline inline-flex w-full md:w-fit justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => onClose(false)}
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSubmittingArticle(true)
              void viewDownload().then(() => {
                setIsSubmittingArticle(false)
                onClose(false)
              })
            }}
            disabled={isSubmittingArticle}
            className="btn-primary inline-flex w-full md:w-fit justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmittingArticle ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z" />
              </svg>
            ) : 'Descargar articulo'}

          </button>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default ArticleView
