import { useArticlesTop } from '../../../shared/hooks/useArticlesTop'
import ArticlesList from './ArticlesList'

function ArticlesTop() {
  const { articles, setArticles } = useArticlesTop()

  return (
    <ArticlesList articles={articles} setArticles={setArticles} />
  )
}

export default ArticlesTop
