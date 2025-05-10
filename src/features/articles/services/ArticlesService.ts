import axios from 'axios'
import Article, { ArticleCreate, ArticleUpdate } from '../entities/Article'
import { ApiService } from '../../../shared/services/ApiService'
import Config from '../../../app/config/Config'
import { ResponseEntity } from '../../../shared/types/reactTypes/ResponseEntity'
import FormData from 'form-data'
import Swal from 'sweetalert2'

export class ArticleService extends ApiService<Article> {
  constructor() {
    super('research-articles')
  }

  // Métodos específicos para articulos
  async getTopArticles(): Promise<Article[]> {
    try {
      const response = await axios.get(
        this.getUrl('top-5'),
        Config.defaultConfig,
      )
      return response.data
    } catch (error) {
      return this.handleError(error, 'Error getting articles top')
    }
  }

  async getFilters(queryString: string): Promise<ResponseEntity<Article>> {
    try {
      const response = await axios.get<ResponseEntity<Article>>(
        this.getUrl(`?${queryString}`),
        Config.defaultConfig,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Error getting filters')
    }
  }

  async create(data: Omit<ArticleCreate, '_id'>): Promise<Article> {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('year', data.year.toString())
    formData.append('authors', data.authors)
    formData.append('primaryThematicAxis', data.primaryThematicAxis)
    formData.append('secondaryThematicAxis', data.secondaryThematicAxis)
    formData.append('keywords', data.keywords)
    formData.append('summary', data.summary)
    if (data.practiceReport) {
      formData.append('practiceReport', data.practiceReport)
    }
    const cleanName = data.file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita acentos
    const safeFileName = cleanName.replace(/[^a-zA-Z0-9-.]/g, '-')
    const renamedFile = new File([data.file], safeFileName, {
      type: data.file.type,
    })
    formData.append('file', renamedFile)

    const url = this.getUrl('')

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
      body: formData,
    }

    try {
      const response = await fetch(url, {
        ...options,
        body: formData as unknown as BodyInit,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${String(response.status)}`)
      }
      const article = (await response.json()) as Article
      console.log(article)

      return article
    } catch (err: unknown) {
      console.error('Error:', err)
      void Swal.fire({
        title: 'Error',
        text:
          'Ocurrió un error al agregar el artículo. ' +
          (err instanceof Error
            ? err.message
            : 'Inténtalo de nuevo más tarde.'),
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4B5563',
      })
      throw err
    }
  }

  // download specific article
  async downloadArticle(article: Article): Promise<void> {
    try {
      const response = await axios.get(this.getUrl(`${article._id}/download`), {
        ...Config.defaultConfig,
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `article-${article.title}-${article._id}.pdf`,
      )
      link.target = '_blank' // Abre el archivo en una nueva pestaña
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Limpia el objeto URL para liberar memoria
    } catch (error) {
      this.handleError(error, 'Error downloading article')
    }
  }

  addView = async (id: string): Promise<Article> => {
    try {
      const response = await axios.get(this.getUrl(id), Config.defaultConfig)
      if (response.status !== 200) {
        void Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir la vista al artículo',
        })
        throw new Error('Failed to add view to the article')
      }
      return response.data as Article
    } catch (error) {
      console.error('Error adding view:', error)
      throw error
    }
  }

  /**
   * Actualiza un registro existente
   * @param id - Identificador del registro
   * @param data - Datos parciales para actualizar
   * @returns Entidad actualizada
   */
  async update(id: string, data: Partial<ArticleUpdate>): Promise<Article> {
    // const formData = new FormData()
    // if (data.title) formData.append('title', data.title)
    // if (data.year) formData.append('year', data.year.toString())
    // if (data.authors) formData.append('authors', data.authors)
    // if (data.primaryThematicAxis)
    //   formData.append('primaryThematicAxis', data.primaryThematicAxis)
    // if (data.secondaryThematicAxis)
    //   formData.append('secondaryThematicAxis', data.secondaryThematicAxis)
    // if (data.keywords) formData.append('keywords', data.keywords)
    // if (data.summary) formData.append('summary', data.summary)
    // if (data.practiceReport)
    //   formData.append('practiceReport', data.practiceReport)

    // if (data.file) {
    //   const cleanName = data.file.name
    //     .normalize('NFD')
    //     .replace(/[\u0300-\u036f]/g, '') // quita acentos
    //   const safeFileName = cleanName.replace(/[^a-zA-Z0-9-.]/g, '-')
    //   const renamedFile = new File([data.file], safeFileName, {
    //     type: data.file.type,
    //   })
    //   formData.append('file', renamedFile)
    // }

    try {
      const response = await axios.patch(this.getUrl(id), data, {
        ...Config.defaultConfig,
        headers: {
          ...Config.defaultConfig.headers,
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error updating article:', error)
      throw error
    }
  }
}
export const articleService = new ArticleService()
