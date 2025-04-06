import { Download, Edit2, Trash2 } from 'lucide-react'
import Article from '../../../shared/types/entities/Article'
import { useArticles } from '../../../shared/hooks/useArticles'

interface ArticlesListProps {
  articles: Article[]
}

function ArticlesList({ articles }: Readonly<ArticlesListProps>) {
  const { deleteArticle, editArticle, downloadArticle } = useArticles()

  return articles.map((article) => (
    <div
      key={article.id}
      className="border border-blue-200 rounded-lg p-4 bg-blue-50"
    >
      <h3 className="font-bold text-blue-800">{article.title}</h3>
      <div className="text-sm text-gray-600">
        <div>
          <span>Autor(es):</span>
          <ul className="list-disc ml-4">
            {article.authors.split(',').map((author, index) => (
              <li key={`${article.id}-${index}`}>{author.trim()}</li>
            ))}
          </ul>
        </div>
        <span className="mx-2">•</span>
        <span>Eje temático: {article.thematicArea}</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-end mt-2 gap-2">
        <button
          onClick={() => article.id && editArticle(article.id, article)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
        >
          <Edit2 size={16} className="mr-1" />
          Editar
        </button>

        <button
          onClick={() => article.id && void deleteArticle(article.id)}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
        >
          <Trash2 size={16} className="mr-1" />
          Eliminar
        </button>

        <button
          onClick={() => article.id && void downloadArticle(article.id)}
          className="flex items-center border border-gray-200 bg-white hover:bg-gray-100 text-gray-800 py-1 px-3 rounded text-sm"
        >
          <Download size={16} className="mr-1" />
          Descargar
        </button>
      </div>
    </div>
  ))
}

export default ArticlesList
