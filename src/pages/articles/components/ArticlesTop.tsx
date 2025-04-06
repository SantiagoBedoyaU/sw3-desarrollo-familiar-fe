import { useArticlesTop } from '../../../hooks/useArticlesTop'
import ArticlesList from './ArticlesList'

function ArticlesTop() {
  const { articles, setArticles } = useArticlesTop()

  return (
    <ArticlesList articles={articles} setArticles={setArticles} type="top" />
  )
}

export default ArticlesTop
