import ArticlesList from './ArticlesList'
import { useArticleStore } from '../stores/ArticlesStore'

function ArticlesFilterList() {
  // const { articles, loading, error, refreshArticles } = useArticles()
  const { isLoadingFilters, error, filteredArticles } =
    useArticleStore()
  const displayArticles = filteredArticles.length > 0 ? filteredArticles : []


  if (isLoadingFilters) return <div>Cargando articulos...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!filteredArticles.length) return <div>No se encontraron articulos disponibles </div>
  return <section>
    {displayArticles.length > 0 && (<section>
      {/* Lista de artículos */}
      <section className="mb-4 flex flex-col items-center justify-between gap-4 bg-gray-50 p-4 rounded-md shadow-md">
        <h4 className="text-lg font-bold text-gray-800 mb-2">
          <span className="text-blue-500">Artículos destacados</span>
        </h4>
      </section>
      <section className="space-y-4">
        <ArticlesList articles={filteredArticles} />
      </section>
    </section>)}

    {displayArticles.length === 0 && (
      <section className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">No hay artículos disponibles</h2>
        <p className="text-lg">No se encontraron artículos en este momento.</p>
      </section>
    )}
  </section>

}

export default ArticlesFilterList
