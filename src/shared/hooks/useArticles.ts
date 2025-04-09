import { useState, useEffect } from 'react'
import Article from '../types/entities/Article'
import mockArticle from '../types/mocks/ArticleMock'
import Swal from 'sweetalert2'

let articlesCache: Article[] | null = null
let isLoading = false
let loadError: Error | null = null
let listeners: (() => void)[] = []
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
        setArticles(articlesCache ?? [])
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
        const articulosDisponibles: Article[] = mockarticle //
        // await articleService.getAll().catch(() => {
        //   Swal.fire({
        //     title: 'Error',
        //     text: 'Ocurrió un error al obtener los artículos.',
        //     icon: 'error',
        //     confirmButtonText: 'Cerrar',
        //     confirmButtonColor: '#4B5563',
        //   })
        // })

        if (articulosDisponibles.length === 0) {
          Swal.fire({
            title: 'Sin artículos disponibles',
            text: 'No hay artículos disponibles en este momento.',
            icon: 'info',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
        }

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
        // await articleService.getAll().catch(() => {
        //   Swal.fire({
        //     title: 'Error',
        //     text: 'Ocurrió un error al obtener los artículos.',
        //     icon: 'error',
        //     confirmButtonText: 'Cerrar',
        //     confirmButtonColor: '#4B5563',
        //   })
        // })
        if (articulosDisponibles.length === 0) {
          Swal.fire({
            title: 'Sin artículos disponibles',
            text: 'No hay artículos disponibles en este momento.',
            icon: 'info',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
        }

        // Actualizar caché global
        articlesCache = articulosDisponibles
        loadError = null

        // Actualizar estado local
        setArticles(articlesCache ?? [])
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

  const addArticle = async (article: Omit<Article, '_id'>) => {
    // await articleService
    //   .create(article)
    //   .catch(() => {
    //     Swal.fire({
    //       title: 'Error',
    //       text: 'Ocurrió un error al agregar el artículo.',
    //       icon: 'error',
    //       confirmButtonText: 'Cerrar',
    //       confirmButtonColor: '#4B5563',
    //     })
    //   })
    setArticles((prevArticles) => [...prevArticles, article])
    // // Apply any existing filters to the updated list
    // applyFilters([...articles, newArticle], searchTerm, selectedThematicArea)
  }

  const deleteArticle = async (_id: string) => {
    // await articleService
    //   .delete(id)
    //   .catch(() => {
    //     Swal.fire({
    //       title: 'Error',
    //       text: 'Ocurrió un error al eliminar el artículo.',
    //       icon: 'error',
    //       confirmButtonText: 'Cerrar',
    //       confirmButtonColor: '#4B5563',
    //     })
    //   })
    const prevarticles = articles.filter((article) => article._id !== _id)
    articlesCache = prevarticles
    setArticles(prevarticles)
    console.log('====================================')
    console.log(articles)
    console.log('====================================')
    // // Apply any existing filters to the updated list
    // applyFilters(
    //   articles.filter((article) => article.id !== id),
    //   searchTerm,
    //   selectedThematicArea,
    // )
  }

  const editArticle = async (_id: string, updatedArticle: Article) => {
    // await articleService
    //   .update(id, updatedArticle)
    //   .catch(() => {
    //     Swal.fire({
    //       title: 'Error',
    //       text: 'Ocurrió un error al actualizar el artículo.',
    //       icon: 'error',
    //       confirmButtonText: 'Cerrar',
    //       confirmButtonColor: '#4B5563',
    //     })
    //   })
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
    console.log('====================================')
    console.log('editArticle', updatedArticle)
  }

  const downloadArticle = async (_id: string) => {
    const article = articles.find((article) => article._id === _id)
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
    setArticles,
    loading,
    error,
    refreshArticles,
    downloadArticle,
    deleteArticle,
    editArticle,
    addArticle,
  }
}
