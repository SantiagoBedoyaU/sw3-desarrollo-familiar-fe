import Article from './Article'

export default interface PracticeReport {
  _id?: string
  title: string
  authors: string
  year: string
  summary: string
  keywords: string
  primaryThematicAxis: string
  file: File

  secondaryThematicAxis?: string
  articleId?: string

  article?: Article
}
