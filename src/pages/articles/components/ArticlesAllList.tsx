import { useArticles } from '../../../hooks/useArticles'
import ArticlesList from './ArticlesList'

function ArticlesAllList() {
  const { articles } = useArticles()
  return (
    <section>
      {/* Lista de artículos */}
      <div className="space-y-4">
        <ArticlesList articles={articles} />
      </div>
    </section>
  )
}

export default ArticlesAllList
