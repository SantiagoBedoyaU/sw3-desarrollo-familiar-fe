// import PracticeReport from './PracticeReport'

export default interface Article {
  _id: string
  title: string
  authors: string[]
  year: string
  summary: string
  keywords: string[]
  primaryThematicAxis: string
  file?: File
  fileAddress?: string
  counter?: number
  downloadCounter?: number

  secondaryThematicAxis?: string
  practiceReport?: string
  changeableKeywords?: string[]
  changeableAuthors?: string[]
}

export interface ArticleCreate {
  _id?: string
  title: string
  authors: string
  year: string
  summary: string
  keywords: string
  primaryThematicAxis: string
  file: File
  fileAddress?: string
  counter?: number
  downloadCounter?: number
  practiceReport: string

  secondaryThematicAxis?: string
}
