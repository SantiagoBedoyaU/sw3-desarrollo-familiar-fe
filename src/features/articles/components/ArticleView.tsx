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
  incrementCounter: (id: string) => void
  incrementDownload: (id: string) => void
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, incrementCounter, incrementDownload }) => {
  const [open, onClose] = useState(false)
  const viewDownload = () => {
    void downloadArticle(article, incrementDownload)
  }
  const addView = async (_id: string) => {
    try {
      await articleService.addView(_id)
      incrementCounter(_id)
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
          <div className="flex justify-between items-center">
            <DialogTitle>
              <p className="text-lg font-bold">{article.title}</p>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 flex flex-col justify-center w-full h-full overflow-auto">
          <section>
            <h3 className="text-md font-bold text-left">Resumen</h3>
            <p className="text-sm text-left p-2 text-gray-700">
              {article.summary}
            </p>
          </section>

          <section>
            <h3 className="text-md font-bold">Palabras claves</h3>
            <p className="text-sm">{article.keywords}</p>
          </section>

          <section>
            <h3 className="text-md font-bold">Año publicación</h3>
            <p className="text-sm">{article.year}</p>
          </section>

          <section>
            <h3 className="text-md font-bold">Autores:</h3>
            <p className="text-sm">{article.authors}</p>
          </section>

          <section>
            <h3 className="text-md font-bold">Ejes temáticos</h3>
            <p className="text-sm">{article.primaryThematicAxis}</p>
          </section>

          {article.file && (
            <section>
              <h3 className="text-md text-left font-bold">
                Informe relacionado
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm">{article.file.name}</span>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  Descargar
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="flex justify-between mt-4 gap-4 py-4 mx-1">
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
              viewDownload()
              onClose(false)
            }}
            className="btn-primary inline-flex w-full md:w-fit justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Descargar articulo
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ArticleView
