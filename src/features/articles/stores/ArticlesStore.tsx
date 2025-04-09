import { create } from 'zustand'
import Swal from 'sweetalert2'
import Article from '../../../shared/types/entities/Article'
import { articleService } from '../../../shared/services/ArticlesService'
import { ResponseEntity } from '../../../shared/types/reactTypes/ResponseEntity'
import mockArticle from '../../../shared/types/mocks/ArticleMock'

interface ArticleState {
  // State
  articles: Article[]
  topArticles: Article[]
  isLoading: boolean
  isLoadingTop: boolean
  error: Error | null
  errorTop: Error | null

  // Actions for regular articles
  fetchArticles: () => Promise<void>
  refreshArticles: () => Promise<void>
  addArticle: (article: Omit<Article, '_id'>) => Promise<void>
  deleteArticle: (_id: string) => Promise<void>
  editArticle: (_id: string, updatedArticle: Article) => Promise<void>
  downloadArticle: (_id: string) => Promise<void>

  // Actions for top articles
  fetchTopArticles: () => Promise<void>
  refreshTopArticles: () => Promise<void>
}
export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  topArticles: [],
  isLoading: false,
  isLoadingTop: false,
  error: null,
  errorTop: null,

  // Regular articles methods
  fetchArticles: async () => {
    // If we already have articles and aren't in a loading state, do nothing
    if (get().articles.length > 0 && !get().isLoading) return

    try {
      set({ isLoading: true })

      const responseArticles: ResponseEntity<Article> | void =
        await articleService.getAll().catch(() => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los artículos.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
        })

      if (!responseArticles) {
        throw new Error('No se encontraron artículos disponibles')
      }

      const articles = responseArticles.data

      if (articles.length === 0) {
        Swal.fire({
          title: 'Sin artículos disponibles',
          text: 'No hay artículos disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        articles: articles,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error fetching articles:', err)
      const error =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener artículos')
      set({ error, isLoading: false })
    }
  },

  refreshArticles: async () => {
    try {
      set({ isLoading: true })

      const responseArticles = await articleService.getAll().catch(() => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al obtener los artículos.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      })

      if (!responseArticles) {
        throw new Error('No se encontraron artículos disponibles')
      }

      const articles = responseArticles.data

      if (articles.length === 0) {
        Swal.fire({
          title: 'Sin artículos disponibles',
          text: 'No hay artículos disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        articles: articles,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      console.error('Error refreshing articles:', err)
      const error =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener artículos')
      set({ error, isLoading: false })
    }
  },

  addArticle: async (article: Omit<Article, '_id'>) => {
    try {
      const newArticle = await articleService.create(article).catch(() => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al agregar el artículo.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
        return null
      })

      if (newArticle) {
        set((state) => ({
          articles: [...state.articles, newArticle],
        }))
      }
    } catch (error) {
      console.error('Error adding article:', error)
    }
  },

  deleteArticle: async (_id: string) => {
    try {
      // Uncomment this when you're ready to use the actual service
      // await articleService.delete(_id).catch(() => {
      //   Swal.fire({
      //     title: 'Error',
      //     text: 'Ocurrió un error al eliminar el artículo.',
      //     icon: 'error',
      //     confirmButtonText: 'Cerrar',
      //     confirmButtonColor: '#4B5563',
      //   })
      //   return false
      // })

      set((state) => ({
        articles: state.articles.filter((article) => article._id !== _id),
        // Also remove from top articles if present
        topArticles: state.topArticles.filter((article) => article._id !== _id),
      }))
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  },

  editArticle: async (_id: string, updatedArticle: Article) => {
    try {
      // Uncomment this when you're ready to use the actual service
      // const updated = await articleService.update(_id, updatedArticle).catch(() => {
      //   Swal.fire({
      //     title: 'Error',
      //     text: 'Ocurrió un error al actualizar el artículo.',
      //     icon: 'error',
      //     confirmButtonText: 'Cerrar',
      //     confirmButtonColor: '#4B5563',
      //   })
      //   return null
      // })

      // if (updated) {
      set((state) => ({
        articles: state.articles.map((article) =>
          article._id === _id ? { ...updatedArticle } : article,
        ),
        // Also update in top articles if present
        topArticles: state.topArticles.map((article) =>
          article._id === _id ? { ...updatedArticle } : article,
        ),
      }))
      // }
    } catch (error) {
      console.error('Error editing article:', error)
    }
  },

  downloadArticle: async (_id: string) => {
    try {
      const { articles } = get()
      const article = articles.find((article) => article._id === _id)

      if (!article) {
        throw new Error('Artículo no encontrado')
      }

      // Simulación de descarga de archivo (replace with actual implementation)
      // const file = await articleService.download(_id)
      const file = new File([], 'file.pdf')

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulación de espera

      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = article.title // Nombre del archivo a descargar
      link.target = '_blank' // Abre el archivo en una nueva pestaña
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Limpia el objeto URL para liberar memoria
    } catch (error) {
      console.error('Error downloading article:', error)
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al descargar el artículo.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4B5563',
      })
    }
  },

  // Top articles methods
  fetchTopArticles: async () => {
    // If we already have top articles and aren't in a loading state, do nothing
    if (get().topArticles.length > 0 && !get().isLoadingTop) return

    try {
      set({ isLoadingTop: true })

      // In your actual implementation, replace this with your API call
      // const articulosTop = await articleService.getTopArticles().catch(() => {...})

      // Using mockArticle temporarily
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      // const articulosTop = mockArticle

      const responseArticles: ResponseEntity<Article> | void =
        await articleService.getTopArticles().catch(() => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los artículos.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
        })

      if (!responseArticles) {
        throw new Error('No se encontraron artículos disponibles')
      }

      const topArticles = responseArticles.data

      if (topArticles.length === 0) {
        Swal.fire({
          title: 'Sin artículos disponibles',
          text: 'No hay artículos disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        topArticles: topArticles.slice(0, 5), // Only the top 5 articles
        isLoadingTop: false,
        errorTop: null,
      })
    } catch (err) {
      console.error('Error fetching top articles:', err)
      const errorTop =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener artículos del top')
      set({ errorTop, isLoadingTop: false })
    }
  },

  refreshTopArticles: async () => {
    try {
      set({ isLoadingTop: true })

      // In your actual implementation, replace this with your API call
      // const articulosTop = await articleService.getTopArticles().catch(() => {...})

      // Using mockArticle temporarily
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const articulosTop = mockArticle

      if (articulosTop.length === 0) {
        Swal.fire({
          title: 'Sin artículos disponibles',
          text: 'No hay artículos disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }

      set({
        topArticles: articulosTop.slice(0, 5), // Only the top 5 articles
        isLoadingTop: false,
        errorTop: null,
      })
    } catch (err) {
      console.error('Error refreshing top articles:', err)
      const errorTop =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener artículos del top')
      set({ errorTop, isLoadingTop: false })
    }
  },
}))
