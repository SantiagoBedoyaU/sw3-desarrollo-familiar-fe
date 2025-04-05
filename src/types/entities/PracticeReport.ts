import Article from './Article'

export default interface PracticeReport {
    id?: string
    title: string
    authors: string
    year: string
    summary: string
    keywords: string
    thematicArea: string
    file: File

    thematicArea2?: string
    articleId?: string

    article?: Article
}
