import { Download, Edit2, Trash2 } from 'lucide-react'
import Article from '../../../shared/types/entities/Article'
import { useArticles } from '../../../shared/hooks/useArticles'
import ArticleView from './ArticleView'
import { Modal } from '../../../shared/components/common/modal/Modal'
import { useState } from 'react'

interface ArticlesListProps {
  articles: Article[]
  setArticles: (articles: Article[]) => void
}

function ArticlesList({ articles, setArticles }: Readonly<ArticlesListProps>) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const { deleteArticle, editArticle, downloadArticle } = useArticles()

  return articles.map((article) => (
    <section
      key={article._id ?? ''}
      className="grid col-span-1 sm:col-span-2 md:col-span-4 md:grid-flow-col justify-center items-center gap-2 sm:gap-6 md:gap-10 border border-blue-200 rounded-lg p-4 bg-blue-50 h-fit"
    >
      <h3 className="h-fit flex items-center justify-center font-bold text-blue-800 sm:col-span-2 underline text-center text-lg md:text-xl">
        {article.title}
      </h3>
      <section className="sm:col-span-1 text-sm text-center text-gray-600 gap-1 md:gap-2 flex flex-col">
        <span className="underline font-medium w-full ">Eje temático </span>
        <section>
          <span className="mx-2">•</span>
          {article.thematicArea}
        </section>
        {article.thematicArea2 && (
          <section>
            <span className="mx-2">•</span>
            {article.thematicArea2}
          </section>
        )}
      </section>
      <section className=" w-full md:w-fit  sm:col-span-1 text-sm text-center text-gray-600 flex flex-col items-center gap-2 md:gap-4">
        <span className="underline font-medium w-full ">
          Autor{article.authors.split(',').length > 1 ? 'es' : ''}
        </span>
        <ul className="w-fit flex flex-wrap flex-row justify-center items-center list-disc gap-1 md:gap-2 max-h-72 overflow-auto md:pl-1">
          {article.authors.split(',').map((author: string) => {
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
        </ul>
      </section>

      <section className="grid grid-cols-1 col-span-1 sm:col-span-2 sm:grid-cols-2 justify-center gap-4 text-sm text-gray-600 md:mr-4">
        <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:justify-center gap-2">
          <button
            type="button"
            onClick={() => article._id && editArticle(article._id, article)}
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

        <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:flex-col md:justify-center gap-2 relative">
          <button
            type="button"
            onClick={() => {}}
            className="md:h-16 flex w-full md:w-fit  items-center justify-center rounded text-sm "
          >
            <ArticleView article={article} />
          </button>

          <button
            type="button"
            onClick={() => article._id && void downloadArticle(article._id)}
            className="w-full md:w-fit flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 text-gray-800 py-1 px-3 rounded text-sm"
          >
            <Download size={16} className="mr-1" />
            <span>Descargar</span>
          </button>
        </section>
      </section>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4">
          Confirmar Eliminación de articulo
        </h2>
        <p className="mb-4">
          ¿Estás seguro de que deseas eliminar el articulo{' '}
          {article.year ? 'del ' : ''}
          <p className="font-semibold text-red-600 inline-block">
            <strong>{article.year}</strong>
            {article.year ? ' - ' : ''}
            {article.title}
          </p>
          ?
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
              if (article._id) {
                const id = article._id
                void deleteArticle(article._id)
                setArticles(articles.filter((article) => article._id !== id))
                setIsDeleteConfirmOpen(false)
              }
            }}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </section>
      </Modal>
    </section>
  ))
}

export default ArticlesList
