import { useState, useEffect } from 'react'
import { ArticleService } from '../services/ArticlesService'
import Article from '../types/entities/Article'
import mockArticle from '../types/mocks/ArticleMock'

let articlesCache: Article[] | null = null
let isLoading = false
let loadError: Error | null = null
let listeners: (() => void)[] = []
const articleService = new ArticleService()

const notifyListeners = () => {
  listeners.forEach((listener) => listener())
}

export const useArticlesTop = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const updateState = () => {
      setArticles(articlesCache?.slice(0, 5) ?? [])
      setLoading(false)
      setError(loadError)
    }

    if (articlesCache) {
      updateState()
      return
    }

    if (isLoading) {
      listeners.push(updateState)
      return () => {
        listeners = listeners.filter((fn) => fn !== updateState)
      }
    }

    const fetchArticles = async () => {
      try {
        isLoading = true
        setLoading(true)
        await new Promise((res) => setTimeout(res, 1000))
        await articleService.getTopArticles() // Simulación
        articlesCache = mockArticle
        updateState()
      } catch (err) {
        const typedError =
          err instanceof Error ? err : new Error('Unknown error')
        loadError = typedError
        setError(typedError)
      } finally {
        isLoading = false
        notifyListeners()
      }
    }

    void fetchArticles()
  }, [])

  const refreshArticles = async () => {
    articlesCache = null
    isLoading = false
    loadError = null
    setLoading(true)

    try {
      await new Promise((res) => setTimeout(res, 1000))
      articlesCache = mockArticle
      setArticles(articlesCache.slice(0, 5))
      setError(null)
    } catch (err) {
      const typedError = err instanceof Error ? err : new Error('Unknown error')
      setError(typedError)
    } finally {
      setLoading(false)
      notifyListeners()
    }
  }

  return { articles, loading, error, refreshArticles }
}
