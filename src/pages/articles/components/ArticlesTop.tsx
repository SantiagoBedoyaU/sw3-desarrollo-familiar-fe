import Article from '../../../types/entities/Article'
import ArticlesList from './ArticlesList'

interface ArticlesTopProps {
    articles: Array<Article>
    handleEdit: (id: string) => void
    handleDelete: (id: string) => void
    handleDownload: (id: string) => void
}

function ArticlesTop(props: Readonly<ArticlesTopProps>) {
    const { articles, handleEdit, handleDelete, handleDownload } = props

    return (
        <ArticlesList
            articles={articles}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDownload={handleDownload}
        />
    )
}

export default ArticlesTop
