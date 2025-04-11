import axios from 'axios'
import Config from '../../app/config/Config'
import { ReportArticleStatistics } from '../types/entities/Reports'

export class ReportsService {
  private readonly endpoint: string
  constructor() {
    this.endpoint = Config.LOGIC_URL + 'reports'
  }
  async getArticlesReports(): Promise<ReportArticleStatistics> {
    const response = await axios.post(`${this.endpoint}/research-articles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
    return response.data
  }
}
export const reportsService = new ReportsService()
