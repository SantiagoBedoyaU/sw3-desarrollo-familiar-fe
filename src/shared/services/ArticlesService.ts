import axios from 'axios'
import Article from '../types/entities/Article'
import { ApiService } from './ApiService'
import Config from '@/app/config/Config'

export class ArticleService extends ApiService<Article> {
  constructor() {
    super('article')
  }

  // Métodos específicos para articulos
  async getTopArticles(): Promise<Article[]> {
    try {
      const response = await axios.get(this.getUrl('top'), Config.defaultConfig)
      return response.data
    } catch (error) {
      return this.handleError(error, 'Error getting articles top')
    }
  }
}
export const articleService = new ArticleService()
