import { create } from 'zustand'
import Swal from 'sweetalert2'
import Article, { ArticleCreate } from '../entities/Article'
import { articleService } from '../services/ArticlesService'
import { ResponseEntity } from '../../../shared/types/reactTypes/ResponseEntity'
// import ArticleMock from '../../../shared/types/mocks/ArticleMock'

interface ArticleState {
  // State
  filteredArticles: Article[]
  articles: Article[]
  topArticles: Article[]
  isLoadingFilters: boolean
  isLoading: boolean
  isLoadingTop: boolean
  error: Error | null
  errorTop: Error | null

  // Actions for regular articles
  fetchArticles: () => Promise<void>
  refreshArticles: () => Promise<void>
  addArticle: (article: Omit<ArticleCreate, '_id'>) => Promise<void>
  deleteArticle: (_id: string) => Promise<void>
  editArticle: (_id: string, updatedArticle: Article) => Promise<void>
  filterArticles: (searchFilters: {
    title: string
    authors: string
    keywords: string
    primaryThematicAxis: string
    secondaryThematicAxis: string
  }) => void
  clearFilters: () => void

  // Actions for top articles
  fetchTopArticles: () => Promise<void>
  refreshTopArticles: () => Promise<void>
}
export const useArticleStore = create<ArticleState>((set, get) => ({
  filteredArticles: [],
  articles: [],
  topArticles: [],
  isLoading: false,
  isLoadingFilters: false,
  isLoadingTop: false,
  error: null,
  errorTop: null,

  fetchArticles: async () => {
    if (get().articles.length > 0 && !get().isLoading) return

    try {
      set({ isLoading: true })

      const responseArticles: ResponseEntity<Article> | null =
        await articleService.getAll().catch((error: unknown) => {
          void Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los artículos.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
          console.error(error)
          return null
        })

      if (!responseArticles) {
        throw new Error('No se encontraron artículos disponibles')
      }

      const articles = responseArticles.data

      if (articles.length === 0) {
        await Swal.fire({
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

      const responseArticles = await articleService
        .getAll()
        .catch((error: unknown) => {
          void Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los artículos.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
          console.error(error)
          return null
        })

      if (!responseArticles) {
        throw new Error('No se encontraron artículos disponibles')
      }

      const articles = responseArticles.data

      if (articles.length === 0) {
        await Swal.fire({
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

  addArticle: async (article: Omit<ArticleCreate, '_id'>) => {
    await articleService.create(article)
    // const newArticle = await articleService.create(article)
    // set((state) => ({
    //   articles: [...state.articles, newArticle],
    // }))
  },

  deleteArticle: async (_id: string) => {
    try {
      // Uncomment this when you're ready to use the actual service
      await articleService.delete(_id).catch(() => {
        void Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al eliminar el artículo.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
        return false
      })
      // set((state) => ({
      //   articles: state.articles.filter((article) => article._id !== _id),
      //   filteredArticles: state.filteredArticles.filter((article) => article._id !== _id),
      //   topArticles: state.topArticles.filter((article) => article._id !== _id),
      // }))
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  },

  editArticle: async (_id: string, updatedArticle: Article) => {
    try {
      // Uncomment this when you're ready to use the actual service
      // const updated = await articleService.update(_id, updatedArticle).catch((error: unknown) => {
      //   void Swal.fire({
      //     title: 'Error',
      //     text: 'Ocurrió un error al actualizar el artículo.',
      //     icon: 'error',
      //     confirmButtonText: 'Cerrar',
      //     confirmButtonColor: '#4B5563',
      //   });
      //   return null;
      // });

      // Since we're not actually awaiting anything in the current implementation,
      // this is just a placeholder to satisfy the require-await rule
      await Promise.resolve()

      // if (updated) {
      set((state) => ({
        articles: state.articles.map((article) =>
          article._id === _id ? { ...updatedArticle } : article,
        ),
        // filteredArticles: state.filteredArticles.filter((article) =>
        //   article._id === _id ? { ...updatedArticle } : article,
        // ),
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
  // Top articles methods
  fetchTopArticles: async () => {
    // If we already have top articles and aren't in a loading state, do nothing
    if (get().topArticles.length > 0 && !get().isLoadingTop) return

    try {
      set({ isLoadingTop: true })

      const topArticles: Article[] = await articleService.getTopArticles()

      if (topArticles.length === 0) {
        await Swal.fire({
          title: 'Sin artículos disponibles',
          text: 'No hay artículos disponibles en este momento.',
          icon: 'info',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#4B5563',
        })
      }
      set({
        topArticles: topArticles,
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
      const topArticles = await articleService.getTopArticles()

      if (topArticles.length === 0) {
        await Swal.fire({
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
      console.error('Error refreshing top articles:', err)
      const errorTop =
        err instanceof Error
          ? err
          : new Error('Error desconocido al obtener artículos del top')
      set({ errorTop, isLoadingTop: false })
    }
  },

  filterArticles: (searchFilters) => {
    const params = new URLSearchParams()
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })
    const queryString = params.toString()
    set({ isLoadingFilters: true })
    articleService
      .getFilters(queryString)
      .then((response) => {
        const articles = response.data
        set({ filteredArticles: articles })
        if (articles.length === 0) {
          void Swal.fire({
            title: 'Sin artículos disponibles',
            text: 'No hay artículos disponibles en este momento.',
            icon: 'info',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#4B5563',
          })
        }
        set({ isLoadingFilters: false })
      })
      .catch((error: unknown) => {
        console.error('Error filtering articles:', error)
        set({
          error: error instanceof Error ? error : new Error('Unknown error'),
          isLoadingFilters: false,
        })
      })
  },

  clearFilters() {
    set({ filteredArticles: [] })
  },
}))
