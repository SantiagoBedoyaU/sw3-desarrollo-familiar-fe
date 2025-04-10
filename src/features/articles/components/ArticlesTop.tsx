import { useEffect } from 'react'
import { useArticleStore } from '../stores/ArticlesStore'
import ArticlesList from './ArticlesList'

function ArticlesTop() {
  const { topArticles, fetchTopArticles } = useArticleStore()

  useEffect(() => {
    void fetchTopArticles()
  }, [])

  return <ArticlesList articles={topArticles} />
}

export default ArticlesTop
