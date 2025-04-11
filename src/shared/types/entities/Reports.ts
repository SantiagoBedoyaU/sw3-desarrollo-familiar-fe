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
}
