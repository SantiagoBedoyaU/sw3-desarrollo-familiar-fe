import { ApiService } from '../../../shared/services/ApiService'
import { Banner, BannerCreate } from '../entities/Banner'

class BannerService extends ApiService<BannerCreate> {
  constructor() {
    super('posts') // usado para POST
  }

  async createBanner(data: BannerCreate) {
    return this.post('', data)
  }

  /**
   * 🔓 Obtener publicaciones públicas aprobadas
   */
  async getAllPublic(): Promise<{ data: Banner[] }> {
    return this.getPublic<{ data: Banner[] }>('posts/public', {
      page: 1,
      limit: 100,
    })
  }

  async getAllAuthenticated(): Promise<{ data: Banner[] }> {
    return this.getPrivate<{ data: Banner[] }>('', {
      page: 1,
      limit: 100,
    })
  }

  async approveBanner(id: string): Promise<{ message: string }> {
    return this.patch(`${id}/approve`, {})
  }

  async deleteBanner(id: string): Promise<void> {
    await this.delete(id)
  }
}

export const bannerService = new BannerService()
