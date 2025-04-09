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

  if (isLoading) return <div>Loading articles...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!articles.length) return <div>No articles available </div>

  return (
    <section>
      <button
        onClick={() => void refreshArticles()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Refresh Articles
      </button>
      {/* Lista de artículos */}
      <section className="space-y-4">
        <ArticlesList articles={articles} />
      </section>
    </section>
  )
}

export default ArticlesAllList
