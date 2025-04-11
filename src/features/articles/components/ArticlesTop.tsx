import { useEffect, useState } from 'react'
import { useArticleStore } from '../stores/ArticlesStore'
import ArticlesList from './ArticlesList'

function ArticlesTop() {
  const { topArticles, fetchTopArticles, refreshArticles } = useArticleStore()

  const [countArticles, setCountArticles] = useState(topArticles.length)

  useEffect(() => {
    void fetchTopArticles()
  }, [fetchTopArticles])

  useEffect(() => {
    setCountArticles(topArticles.length)
  }, [topArticles])

  return (
    countArticles > 0 ? (
      <ArticlesList articles={topArticles} />
    ) : (
      <section className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">No hay artículos destacados</h2>
        <p className="text-lg">No se encontraron artículos destacados en este momento.</p>
        <button type='button' onClick={refreshArticles}>
          <span className="text-blue-500 hover:text-blue-700 underline" >
            Actualizar
          </span>
        </button>
      </section>
    )
  )
}

export default ArticlesTop
