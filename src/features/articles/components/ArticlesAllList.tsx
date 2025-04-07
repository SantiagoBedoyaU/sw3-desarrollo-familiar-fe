import { useArticles } from '../../../shared/hooks/useArticles'
import ArticlesList from './ArticlesList'

function ArticlesAllList() {
  const { articles, setArticles } = useArticles()
  return (
    <section>
      {/* Lista de artículos */}
      <section className="space-y-4">
        <ArticlesList setArticles={setArticles} articles={articles} />
      </section>
    </section>
  )
}

export default ArticlesAllList
