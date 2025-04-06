import { useArticles } from '@/shared/hooks/useArticles'
import ArticlesList from './ArticlesList'

function ArticlesAllList() {
  const { articles } = useArticles()
  return (
    <section className="space-y-4">
      <ArticlesList articles={articles} />
    </section>
  )
}

export default ArticlesAllList
