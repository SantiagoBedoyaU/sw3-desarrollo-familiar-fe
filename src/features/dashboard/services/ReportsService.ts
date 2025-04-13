import axios from 'axios'
import Config from '../../../app/config/Config'
import {
  ReportArticleStatistics,
  ReportArticleThematics,
} from '../entities/Reports'

export class ReportsService {
  private readonly endpoint: string
  constructor() {
    this.endpoint = Config.LOGIC_URL + 'reports'
  }
  async getArticlesReports(): Promise<ReportArticleStatistics> {
    const response = await axios.get(`${this.endpoint}/research-articles`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
    return response.data
  }

  async getArticlesThematics(): Promise<ReportArticleThematics> {
    const response = await axios.get(`${this.endpoint}/thematic-axis`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
    return response.data
  }
}
export const reportsService = new ReportsService()
