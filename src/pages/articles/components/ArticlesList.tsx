import { Download, Edit2, Trash2 } from 'lucide-react'
import Article from '../../../types/entities/Article'
import { useArticles } from '../../../hooks/useArticles'

interface ArticlesListProps {
  articles: Article[]
}

function ArticlesList(props: Readonly<ArticlesListProps>) {
  const { articles } = props
  const { deleteArticle, editArticle, downloadArticle } = useArticles()

  return articles.map((article: Article) => (
    <div
      key={article.id}
      className="border border-blue-200 rounded-lg p-4 bg-blue-50"
    >
      <h3 className="font-bold text-blue-800">{article.title}</h3>
      <div className="text-sm text-gray-600 md:mb-2 lg:mb-0">
        <span>
          <span>Autor(es):</span>
          <ul className="list-disc ml-4">
            {article.authors.split(',').map((author, index) => (
              <li
                key={`${author}${article.title}${article.id ?? ''}${index.toString()}`}
                className="list-disc ml-4"
              >
                {author.trim()}
              </li>
            ))}
          </ul>
        </span>
        <span className="mx-2">•</span>
        <span>Eje temático: {article.thematicArea}</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-end mt-2 space-x-2 space-y-0.5">
        <button
          type="button"
          onClick={() => article.id && editArticle(article.id, article)}
          className="flex w-full md:w-fit items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition duration-300"
        >
          <Edit2 size={16} className="mr-1" />
          <span>Editar</span>
        </button>
        <button
          type="button"
          onClick={async () => {
            if (article.id) {
              await deleteArticle(article.id) // Manejar la promesa con `await`
            }
          }}
          className="flex w-full md:w-fit items-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition duration-300"
        >
          <Trash2 size={16} className="mr-1" />
          <span>Eliminar</span>
        </button>
        <button
          type="button"
          onClick={() => article.id && downloadArticle(article.id)}
          className="flex w-full md:w-fit items-center border-gray-200 border-2 bg-white hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm transition duration-300"
        >
          <Download size={16} className="mr-1" />
          <span>Descargar</span>
        </button>
      </div>
    </div>
  ))
}

export default ArticlesList
