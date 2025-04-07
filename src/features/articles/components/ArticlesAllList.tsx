import { useArticles } from "../../../shared/hooks/useArticles"
import ArticlesList from "./ArticlesList"

function ArticlesAllList() {
  const { articles, setArticles } = useArticles()
  return (
    <section>
      {/* Lista de artículos */}
      <div className="space-y-4">
        <ArticlesList
          setArticles={setArticles}
          articles={articles}
          type="all"
        />
      </div>
    </section>
  )
}

export default ArticlesAllList
