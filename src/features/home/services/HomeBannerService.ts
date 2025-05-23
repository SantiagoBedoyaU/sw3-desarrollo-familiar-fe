import { ApiService } from '../../../shared/services/ApiService'

interface PostBanner {
  id: string
  imageUrl: string
  description: string
  externalLink?: string
  approved: boolean
}

const postService = new ApiService<PostBanner>('posts')

export const getVisibleBanners = async (): Promise<PostBanner[]> => {
  const response = await postService.getAllCustom('/public?limit=10&page=1')
  return response.data
}
