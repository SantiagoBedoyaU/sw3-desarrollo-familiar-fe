import { useState, useEffect } from 'react'
import Article from '../types/entities/Article'
import { ArticleService } from '../services/ArticlesService'
import mockArticle from '../types/mocks/ArticleMock'

// Caché global a nivel de módulo (persiste entre renders)
let articlesCache: Article[] = []
let isLoading = false
let loadError: Error | null = null
let listeners: (() => void)[] = []
const articleService = new ArticleService()
const mockarticle = mockArticle

// Función para notificar a todos los suscriptores
const notifyListeners = () => {
  listeners.forEach((listener) => listener())
}

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Si ya tenemos datos en caché, los usamos inmediatamente
    if (articlesCache) {
      setArticles(articlesCache)
      setLoading(false)
      return
    }

    // Si ya hay una carga en progreso, esperamos
    if (isLoading) {
      // Nos suscribimos a actualizaciones
      const updateState = () => {
        setArticles(articlesCache)
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
        const articulosDisponibles: Article[] = mockarticle //await articleService.getAll()
        // Actualizar la caché global
        articlesCache = articulosDisponibles
        loadError = null

        // Actualizar estado local
        setArticles(articlesCache)
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

    void fetchArticles()
  }, [])

  // Función para forzar actualización (limpia la caché)
  const refreshArticles = () => {
    articlesCache = []
    isLoading = false
    loadError = null

    // Iniciamos una nueva carga
    const fetchArticles = async () => {
      try {
        isLoading = true
        setLoading(true)

        // Simulación o llamada real a API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const articulosDisponibles = mockarticle

        // Actualizar caché global
        articlesCache = articulosDisponibles
        loadError = null

        // Actualizar estado local
        setArticles(articlesCache)
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

    void fetchArticles()
  }

  const deleteArticle = async (id: string) => {
    await articleService.delete(id)
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== id),
    )

    // // Apply any existing filters to the updated list
    // applyFilters(
    //   articles.filter((article) => article.id !== id),
    //   searchTerm,
    //   selectedThematicArea,
    // )

    // toast({
    //   title: 'Artículo eliminado',
    //   description: 'El artículo ha sido eliminado exitosamente.',
    // })
  }

  const editArticle = (id: string, updatedArticle: Article) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id ? { ...updatedArticle, id } : article,
      ),
    )

    // // Apply any existing filters to the updated list
    // applyFilters(
    //   articles.map((article) =>
    //     article.id === id
    //       ? { ...updatedArticle, id, createdAt: article.createdAt }
    //       : article,
    //   ),
    //   searchTerm,
    //   selectedThematicArea,
    // )

    // toast({
    //   title: 'Artículo actualizado',
    //   description: 'El artículo ha sido actualizado exitosamente.',
    // })
  }

  const downloadArticle = async (id: string) => {
    const article = articles.find((article) => article.id === id)
    if (!article) {
      throw new Error('Artículo no encontrado')
    }
    // Simulación de descarga de archivo
    // const file = await articleService.download(id)
    const file = new File([], 'file.pdf')
    article.file = file
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulación de espera
    const url = URL.createObjectURL(article.file)
    const link = document.createElement('a')
    link.href = url
    link.download = article.title // Nombre del archivo a descargar
    link.target = '_blank' // Abre el archivo en una nueva pestaña
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Limpia el objeto URL para liberar memoria
  }

  return {
    articles,
    loading,
    error,
    refreshArticles,
    downloadArticle,
    deleteArticle,
    editArticle,
  }
}
