import axios from 'axios'
import Article, { ArticleCreate } from '../types/entities/Article'
import { ApiService } from './ApiService'
import Config from '../../app/config/Config'
import { ResponseEntity } from '../types/reactTypes/ResponseEntity'
export class ArticleService extends ApiService<Article> {
  constructor() {
    super('research-articles')
  }

  // Métodos específicos para articulos
  // async getTopArticles(): Promise<ResponseEntity<Article>> {
  //   try {
  //     const response = await axios.get(this.getUrl('top'), Config.defaultConfig)
  //     return response.data
  //   } catch (error) {
  //     return this.handleError(error, 'Error getting articles top')
  //   }
  // }

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

  async create(data: Omit<ArticleCreate, '_id'>): Promise<ArticleCreate> {
    try {
      return await this.handleResponse<ArticleCreate>(
        axios.post(this.getUrl(), data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
      )
    } catch (error) {
      this.handleError(error, `Error creating ${this.getUrl()}`)
    }
  }

  // download specific article
  async downloadArticle(_id: string): Promise<void> {
    try {
      const response = await axios.get(this.getUrl(`${_id}/download`), {
        ...Config.defaultConfig,
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `article-${_id}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      this.handleError(error, 'Error downloading article')
    }
  }
}
export const articleService = new ArticleService()
