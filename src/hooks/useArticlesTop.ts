import { useState, useEffect } from 'react'
import Article from '../types/entities/Article'
import { ArticleService } from '../services/ArticlesService'
import mockArticle from '../types/mocks/ArticleMock'

// Caché global a nivel de módulo (persiste entre renders)
let articlesCache: Article[] | null = null
let isLoading = false
let loadError: Error | null = null
let listeners: Function[] = []
const articleService = new ArticleService()
const mockarticle = mockArticle

// Función para notificar a todos los suscriptores
const notifyListeners = () => {
  listeners.forEach((listener) => listener())
}

export const useArticlesTop = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Si ya tenemos datos en caché, los usamos inmediatamente
    if (articlesCache) {
      setArticles(articlesCache.slice(0, 5)) // Tomar solo los primeros 5 artículos
      setLoading(false)
      return
    }

    // Si ya hay una carga en progreso, esperamos
    if (isLoading) {
      // Nos suscribimos a actualizaciones
      const updateState = () => {
        setArticles((articlesCache || []).slice(0, 5)) // Tomar solo los primeros 5 artículos
        setLoading(isLoading)
        setError(loadError)
      }

      listeners.push(updateState)

      // Limpieza al desmontar
      return () => {
        listeners = listeners.filter((fn) => fn !== updateState)
      }
    }

    // Si no hay caché ni carga en progreso, iniciamos la carga
    const fetchArticles = async () => {
      if (isLoading || articlesCache) return

      try {
        isLoading = true
        setLoading(true)

        // Simulación o llamada real a API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const articulosDisponibles: Article[] = mockarticle
        await articleService.getTopArticles()
        // Actualizar la caché global
        articlesCache = articulosDisponibles
        loadError = null

        // Actualizar estado local con los primeros 5 artículos
        setArticles(articlesCache.slice(0, 5))
        setError(null)
      } catch (err) {
        console.error('Error fetching articles:', err)
        loadError =
          err instanceof Error
            ? err
            : new Error('Error desconocido al obtener artículos')
        setError(loadError)
      } finally {
        isLoading = false
        setLoading(false)
        notifyListeners()
      }
    }

    fetchArticles()
  }, [])

  // Función para forzar actualización (limpia la caché)
  const refreshArticles = () => {
    articlesCache = null
    isLoading = false
    loadError = null

    // Iniciamos una nueva carga
    const fetchArticles = async () => {
      try {
        isLoading = true
        setLoading(true)

        // Simulación o llamada real a API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const articulosDisponibles: Article[] = mockarticle // await articleService.getAll();
        // Actualizar caché global
        articlesCache = articulosDisponibles
        loadError = null

        // Actualizar estado local con los primeros 5 artículos
        setArticles(articlesCache.slice(0, 5))
        setError(null)
      } catch (err) {
        console.error('Error refreshing articles:', err)
        loadError =
          err instanceof Error
            ? err
            : new Error('Error desconocido al obtener artículos')
        setError(loadError)
      } finally {
        isLoading = false
        setLoading(false)
        notifyListeners()
      }
    }

    fetchArticles()
  }

  return { articles, loading, error, refreshArticles }
}
