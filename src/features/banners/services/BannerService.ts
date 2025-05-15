import { ApiService } from '../../../shared/services/ApiService'
import { BannerCreate } from '../entities/Banner'

class BannerService extends ApiService<BannerCreate> {
  constructor() {
    super('posts')
  }

  async createBanner(data: BannerCreate) {
    return this.post('', data)
  }
}

export const bannerService = new BannerService()
