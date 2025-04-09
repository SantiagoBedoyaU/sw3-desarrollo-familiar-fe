import { useEffect } from 'react'
import ArticlesList from './ArticlesList'
import { useArticleStore } from '../stores/ArticlesStore'

function ArticlesAllList() {
  // const { articles, loading, error, refreshArticles } = useArticles()
  const { isLoading, error, articles, fetchArticles, refreshArticles } =
    useArticleStore()

  useEffect(() => {
    void fetchArticles()
  }, [])

  if (isLoading) return <div>Cargando articulos...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!articles.length) return <div>No se encontraron articulos disponibles </div>

  return (
    <section>
      <section className='flex flex-col md:flex-row items-center justify-center md:justify-between'>
        <h3 className='text-2xl font-bold my-4 text-gray-800 dark:text-white text-center'>Nuestros Articulos</h3>
        <button
          onClick={() => void refreshArticles()}
          className="w-full md:w-fit bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out mb-2"
        >
          Refresh Articles
        </button>
      </section>
      {/* Lista de artículos */}
      {
        articles.length > 0 && (
          <section className="space-y-4">
            <ArticlesList articles={articles} />
          </section>
        )
      }
    </section>
  )
}

export default ArticlesAllList
