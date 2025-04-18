import { useEffect } from 'react'
import ArticlesList from './ArticlesList'
import { useArticleStore } from '../stores/ArticlesStore'

function ArticlesAllList() {
  // const { articles, loading, error, refreshArticles } = useArticles()
  const { isLoading, error, articles, fetchArticles, refreshArticles } =
    useArticleStore()

  useEffect(() => {
    void fetchArticles()
  }, [fetchArticles])

  if (isLoading) return <section>Cargando articulos...</section>
  if (error) return <section>Error: {error.message}</section>
  if (!articles.length) return <section>No se encontraron articulos disponibles </section>

  return (
    <section className='mt-14'>
      <section className='flex flex-col md:flex-row items-center justify-center md:justify-between'>
        <section className="w-full md:w-fit mb-4 flex flex-col items-center justify-between gap-4 bg-gray-50 p-4 rounded-md shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-2 md:w-fit text-center">
            <span className="text-blue-600 w-full md:w-fit">Nuestros articulos</span>
          </h4>
        </section>
        <button
          onClick={() => void refreshArticles()}
          className="w-full md:w-fit bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out mb-2"
        >
          Refrescar Articulos
        </button>
      </section>
      {/* Lista de artículos */}

      <section className="space-y-4">
        <ArticlesList articles={articles} />
      </section>

    </section>
  )
}

export default ArticlesAllList
