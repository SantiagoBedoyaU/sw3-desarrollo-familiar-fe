export interface ArticleReport {
  _id: string
  title: string
  period: string
  authors: string[]
  keywords: string[]
  primaryThematicAxis: string
  secondaryThematicAxis: string
  institution: string
  fileAddress: string
  counter: number
  downloadCounter: number
}
export interface ReportArticleStatistics {
  mostDownloaded: ArticleReport
  mostInteracted: ArticleReport
  totalViews: number
  totalDownloads: number
  totalArticles: number
}

export interface ReportArticleThematic {
  _id: string
  count:number
}


export type ReportArticleThematics = ReportArticleThematic[];
