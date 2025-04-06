import { useState, useEffect } from 'react'
import { ArticleService } from '@/shared/services/ArticlesService'
import mockArticle from '@/shared/types/mocks/ArticleMock'
import Article from '@/shared/types/entities/Article'

let articlesCache: Article[] = []
let isLoading = false
let loadError: Error | null = null
let listeners: (() => void)[] = []
const articleService = new ArticleService()

const notifyListeners = () => {
  listeners.forEach((listener) => listener())
}

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const updateState = () => {
      setArticles(articlesCache)
      setLoading(false)
      setError(loadError)
    }

    if (articlesCache.length > 0) {
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
        await new Promise((res) => setTimeout(res, 1000)) // Simulación
        articlesCache = mockArticle
        loadError = null
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
    articlesCache = []
    isLoading = false
    loadError = null
    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 1000))
      articlesCache = mockArticle
      setArticles(articlesCache)
      setError(null)
    } catch (err) {
      const typedError = err instanceof Error ? err : new Error('Unknown error')
      setError(typedError)
    } finally {
      setLoading(false)
      notifyListeners()
    }
  }

  const deleteArticle = async (id: string) => {
    await articleService.delete(id)
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  const editArticle = (id: string, updated: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...updated, id } : a)),
    )
  }

  const downloadArticle = async (id: string) => {
    const article = articles.find((a) => a.id === id)
    if (!article) throw new Error('Artículo no encontrado')

    // Simulación de descarga
    const file = new File([], 'file.pdf')
    article.file = file
    await new Promise((res) => setTimeout(res, 1000))
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = article.title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    articles,
    loading,
    error,
    refreshArticles,
    deleteArticle,
    editArticle,
    downloadArticle,
  }
}
