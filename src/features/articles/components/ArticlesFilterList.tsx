import ArticlesList from './ArticlesList'
import { useArticleStore } from '../stores/ArticlesStore'

function ArticlesFilterList() {
  const { isLoadingFilters, error, filteredArticles } =
    useArticleStore()
  if (isLoadingFilters) return <section>Cargando articulos...</section>
  if (error) return <section>Error: {error.message}</section>
  return <section>
    <section className="mb-4 flex flex-col items-center justify-between gap-4 bg-gray-50 p-4 rounded-md shadow-md">
      <h4 className="text-lg font-bold text-gray-800 mb-2">
        <span className="text-blue-500">Artículos destacados</span>
      </h4>
    </section>
    {
      !filteredArticles.length && <section className="flex flex-col items-center justify-center gap-4 bg-gray-50 p-4 rounded-md shadow-md">
        <h4 className="text-lg font-bold text-gray-800 mb-2">
          <span className="text-blue-500">No se encontraron artículos</span>
        </h4>
        <p className="text-sm text-gray-600">No hay artículos en este momento.</p>
      </section>
    }
    {
      filteredArticles.length > 0 && <section className="space-y-4">
        <ArticlesList articles={filteredArticles} />
      </section>
    }
  </section>

}

export default ArticlesFilterList
