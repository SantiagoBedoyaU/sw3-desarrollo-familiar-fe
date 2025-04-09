import ArticlesList from './ArticlesList'
import { useArticleStore } from '../stores/ArticlesStore'

function ArticlesFilterList() {
  // const { articles, loading, error, refreshArticles } = useArticles()
  const { isLoadingFilters, error, filteredArticles } =
    useArticleStore()

  if (isLoadingFilters) return <div>Cargando articulos...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!filteredArticles.length) return <div>No se encontraron articulos disponibles </div>
  return (
    <section>
      {/* Lista de artículos */}
      <section className="mb-4 flex flex-col items-center justify-between gap-4 bg-gray-50 p-4 rounded-md shadow-md">
        <h4 className="text-lg font-bold text-gray-800 mb-2">
          <span className="text-blue-500">Artículos destacados</span>
        </h4>
      </section>
      <section className="space-y-4">
        <ArticlesList articles={filteredArticles} />
      </section>
    </section>
  )
}

export default ArticlesFilterList
