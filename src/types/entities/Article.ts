import PracticeReport from './PracticeReport'

export default interface Article {
  id?: string
  title: string
  authors: string
  year: string
  summary: string
  keywords: string
  thematicArea: string
  file: File

  thematicArea2?: string
  practiceReportId?: string

  practiceReport?: PracticeReport
  changeableKeywords?: string[]
  changeableAuthors?: string[]
}
