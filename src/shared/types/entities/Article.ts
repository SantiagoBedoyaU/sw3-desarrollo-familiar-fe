import PracticeReport from './PracticeReport'

export default interface Article {
  _id?: string
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
  practiceReportId?: string

  practiceReport?: PracticeReport
  changeableKeywords?: string[]
  changeableAuthors?: string[]
}
