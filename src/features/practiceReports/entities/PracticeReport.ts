export default interface PracticeReport {
  _id: string
  title: string
  authors: string[]
  period: string
  keywords: string[]
  institution: string
  primaryThematicAxis: string
  file?: File
  fileAddress?: string
  counter?: number
  downloadCounter?: number

  secondaryThematicAxis?: string
  researchArticle?: string
  changeableKeywords?: string[]
  changeableAuthors?: string[]
}

export interface PracticeReportUpdate {
  _id: string
  title: string
  authors: string
  period: string
  keywords: string
  institutionId: string
  primaryThematicAxis: string
  secondaryThematicAxis?: string
  researchArticle?: string
}

export interface PracticeReportCreate {
  _id?: string
  title: string
  authors: string[]
  period: string
  keywords: string[]
  institutionId: string
  primaryThematicAxis: string
  file?: File
  fileAddress?: string
  counter?: number
  downloadCounter?: number

  secondaryThematicAxis?: string
  researchArticle?: string
  changeableKeywords?: string[]
  changeableAuthors?: string[]
}
