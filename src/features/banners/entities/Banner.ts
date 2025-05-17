export interface Banner {
  _id: string
  imageUrl: string
  description: string
  eventDate?: string
  externalLink?: string
  approved?: boolean
}
export interface BannerCreate {
  imageUrl: string
  description: string
  eventDate?: Date | null
  externalLink?: string
}
