import Config from '../../app/config/Config'

export class ReportsService {
  private readonly endpoint: string
  constructor() {
    this.endpoint = Config.LOGIC_URL + 'reports'
  }
  async getArticlesReports(): Promise<any> {
    const response = await fetch(`${this.endpoint}/research-articles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch reports')
    }
    return response.json()
  }
}
