import { Download, Edit2, Trash2, FileText } from 'lucide-react'
import Article from '../entities/Article'
import ArticleView from './ArticleView'
import { Modal } from '../../../shared/components/common/modal/Modal'
import { useEffect, useState } from 'react'
import { useArticleStore } from '../stores/ArticlesStore'
import downloadArticle from '../utils/AddDownload'
import useAuthStore from '../../../app/stores/useAuthStore'
import ArticleEdit from './ArticleEdit'
import { getSignIn } from '../../auth/utils/getSignIn'
import { ADMIN_ROLE, TEACHER_ROLE } from '../../../shared/constants/cts'

interface ArticlesListProps {
  articles: Article[]
}

function ArticlesList({ articles }: Readonly<ArticlesListProps>) {
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false)
  const [isSubmittingDownload, setIsSubmittingDownload] = useState(false)
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const { deleteArticle } = useArticleStore()
  const [updatedArticles, setUpdatedArticles] = useState(articles)
  const { checkAuth } = useAuthStore()
  const [userRole, setUserRole] = useState(false)
  useEffect(() => {
    const signIn = getSignIn()
    setUserRole(signIn?.userRole === ADMIN_ROLE || signIn?.userRole === TEACHER_ROLE)
  }, [checkAuth])

  const fromListDownload = async (article: Article) => {
    await downloadArticle(article)
    const id = article._id
    setUpdatedArticles((prevArticles) =>
      prevArticles.map((article) =>
        article._id === id
          ? { ...article, downloadCounter: (article.downloadCounter ?? 0) + 1 }
          : article,
      ),
    )
  }
  return updatedArticles.map((article) => (
    <section
      key={article._id + article.title + article.year}
      className="grid col-span-1 sm:col-span-2 md:col-span-4 md:grid-flow-col justify-center items-center gap-2 sm:gap-6 md:gap-10 border border-blue-200 rounded-lg p-2 sm:p-4 bg-blue-50 h-fit"
    >
      <section className="flex flex-col items-center gap-2 md:gap-4 sm:col-span-2 md:col-span-4">
        <h3 className="h-fit flex flex-col gap-2 items-center justify-center font-bold text-blue-800 sm:col-span-2 underline text-center text-lg md:text-xl">
          <span>{article.title}</span>
          {article.practiceReport && (
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
          {article.primaryThematicAxis}
        </section>
        {article.secondaryThematicAxis && (
          <section>
            <span className="mx-2">•</span>
            {article.secondaryThematicAxis}
          </section>
        )}
      </section>
      {Array.isArray(article.authors) && (
        <section className=" w-full md:w-fit  sm:col-span-1 text-sm text-center text-gray-600 flex flex-col items-center gap-2 md:gap-4">
          <span className="underline font-medium w-full ">
            Autor{article.authors.length > 1 ? 'es' : ''}
          </span>
          <ul className="w-fit flex flex-wrap flex-row justify-center items-center list-disc gap-1 md:gap-2 max-h-72 overflow-auto md:pl-1">
            {article.authors.map((author: string) => {
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
      )}

      <section className="grid grid-cols-1 col-span-1 sm:col-span-2 sm:grid-cols-2 justify-center gap-4 text-sm text-gray-600 md:mr-4">
        <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:justify-center gap-2">
          <p>
            {article.counter} vista{article.counter === 1 ? '' : 's'}{' '}
          </p>
          <p>
            {article.downloadCounter} descarga
            {article.downloadCounter === 1 ? '' : 's'}
          </p>
        </section>
        {userRole && (
          <section className="flex flex-col sm:flex-row md:col-span-4 items-center justify-between md:justify-center gap-2 px-4">
            <button
              type="button"
              onClick={() => {
                setSelectedArticle(article)
                setIsEditConfirmOpen(true)
              }
              }
              className="w-full md:w-fit flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
            >
              <Edit2 size={16} className="mr-1" />
              <span>Editar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsDeleteConfirmOpen(true)
                setSelectedArticle(article)
              }}
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
            <ArticleView
              article={article}
              setUpdatedArticles={setUpdatedArticles}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSubmittingDownload(true)
              setSelectedArticle(article)
              void fromListDownload(article).then(() => {
                setIsSubmittingDownload(false)
                setSelectedArticle(null)
              })
            }}
            className={
              'w-full md:w-fit flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-100 text-gray-900 rounded text-sm ' +
              (isSubmittingDownload ? 'cursor-not-allowed py-1 px-3' : '')
            }
          >
            {isSubmittingDownload && selectedArticle?._id === article._id ? (
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

      {selectedArticle?._id === article._id && <Modal isOpen={isEditConfirmOpen} onClose={() => setIsEditConfirmOpen(false)}>
        {isEditConfirmOpen && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Editar articulo</h2>
            <ArticleEdit
              onClose={() => setIsEditConfirmOpen(false)}
              article={selectedArticle}
              setUpdatedArticles={setUpdatedArticles}
            />
          </div>
        )}
      </Modal>}

      {/* Delete Confirmation Modal */}
      {selectedArticle?._id === article._id && <Modal
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
              setIsSubmittingDelete(true)
              void deleteArticle(article._id).then(() => {
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
      </Modal>}
    </section>
  ))
}

export default ArticlesList
