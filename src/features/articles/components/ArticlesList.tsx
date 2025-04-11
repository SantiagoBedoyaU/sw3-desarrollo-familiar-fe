import { Download, Edit2, Trash2 } from 'lucide-react'
import Article from '../../../shared/types/entities/Article'
import ArticleView from './ArticleView'
import { Modal } from '../../../shared/components/common/modal/Modal'
import { useEffect, useState } from 'react'
import { useArticleStore } from '../stores/ArticlesStore'
import downloadArticle from '../utils/AddDownload'
import useAuthStore from '../../../app/stores/useAuthStore'
import { SignIn } from '../../../shared/types/entities/User'

interface ArticlesListProps {
  articles: Article[]
}

function ArticlesList({ articles }: Readonly<ArticlesListProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const { deleteArticle, editArticle } = useArticleStore()
  const [updatedArticles, setUpdatedArticles] = useState(articles)
  const { checkAuth } = useAuthStore()
  const [userRole, setUserRole] = useState(false)
  useEffect(() => {
    const signInString = localStorage.getItem('signIn')
    const signIn: SignIn | null = signInString ? JSON.parse(signInString) as SignIn : null
    setUserRole(signIn?.userRole === 1 || signIn?.userRole === 2)
  }, [checkAuth])
  const incrementCounter = (id: string, updated_article: Article) => {
    setUpdatedArticles((prevArticles) =>
      prevArticles.map((article) =>
        article._id === id
          ? { ...updated_article, counter: (updated_article.counter ?? 0) + 1 }
          : updated_article
      )
    )
  }

  const incrementDownload = (id: string) => {
    setUpdatedArticles((prevArticles) =>
      prevArticles.map((article) =>
        article._id === id
          ? { ...article, downloadCounter: (article.downloadCounter ?? 0) + 1 }
          : article
      )
    )
  }

  const fromListDownload = (article: Article) => {
    void downloadArticle(article, incrementDownload)
  }
  return updatedArticles.map((article) => (
    <section
      key={article._id + article.title + article.year}
      className="grid col-span-1 sm:col-span-2 md:col-span-4 md:grid-flow-col justify-center items-center gap-2 sm:gap-6 md:gap-10 border border-blue-200 rounded-lg p-2 sm:p-4 bg-blue-50 h-fit"
    >
      <section className='flex flex-col items-center gap-2 md:gap-4 sm:col-span-2 md:col-span-4'>
        <h3 className="h-fit flex items-center justify-center font-bold text-blue-800 sm:col-span-2 underline text-center text-lg md:text-xl">
          {article.title}
        </h3>

      </section>
      <section className="sm:col-span-1 text-sm text-center text-gray-600 gap-1 md:gap-2 flex flex-col">
        <span className="underline font-medium w-full ">Eje temático </span>
        <section>
          <span className="mx-2">•</span>
          {article.primaryThematicAxis}
        </section>
        {article.secondaryThematicAxis && (
          <section>
            <span className="mx-2">•</span>
            {article.secondaryThematicAxis}
          </section>
        )}
      </section>
      <section className=" w-full md:w-fit  sm:col-span-1 text-sm text-center text-gray-600 flex flex-col items-center gap-2 md:gap-4">
        <span className="underline font-medium w-full ">
          Autor{article.authors.length > 1 ? 'es' : ''}
        </span>
        <ul className="w-fit flex flex-wrap flex-row justify-center items-center list-disc gap-1 md:gap-2 max-h-72 overflow-auto md:pl-1">
          {Array.isArray(article.authors) &&
            article.authors.length > 1 &&
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
        </ul>
      </section>



      <section className="grid grid-cols-1 col-span-1 sm:col-span-2 sm:grid-cols-2 justify-center gap-4 text-sm text-gray-600 md:mr-4">

        <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:justify-center gap-2">
          <p>{article.counter} vista{article.counter === 1 ? '' : 's'} </p>
          <p>{article.downloadCounter} descarga{article.downloadCounter === 1 ? '' : 's'}</p>
        </section>
        {userRole && <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:justify-center gap-2">
          <button
            type="button"
            onClick={() => article._id && void editArticle(article._id, article)}
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
        </section>}


        <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:flex-col md:justify-center gap-2 relative">
          <button
            type="button"
            className="md:h-16 flex w-full md:w-fit  items-center justify-center rounded text-sm "
          >
            <ArticleView article={article} incrementCounter={incrementCounter} incrementDownload={incrementDownload} />
          </button>

          <button
            type="button"
            onClick={() => article._id && fromListDownload(article)}
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
              setIsSubmitting(true)
              void deleteArticle(article._id).then(() => {
                setIsDeleteConfirmOpen(false)
                setIsSubmitting(false)
                window.location.reload()
              })
            }}
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isSubmitting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </section>
      </Modal>
    </section>
  ))
}

export default ArticlesList
