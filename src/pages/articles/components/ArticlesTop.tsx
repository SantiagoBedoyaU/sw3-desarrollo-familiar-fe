import { useArticlesTop } from '../../../hooks/useArticlesTop'
import ArticlesList from './ArticlesList'

function ArticlesTop() {
  const { articles } = useArticlesTop()

  return <ArticlesList articles={articles} />
}

export default ArticlesTop
