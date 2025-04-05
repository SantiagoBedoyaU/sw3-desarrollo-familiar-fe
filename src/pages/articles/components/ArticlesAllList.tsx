import Article from "../../../types/entities/Article";
import ArticlesList from "./ArticlesList";

interface ArticlesAllListProps {
  articles: Array<Article>;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleDownload: (id: string) => void;
}

function ArticlesAllList(props: Readonly<ArticlesAllListProps>) {
  const { articles, handleEdit, handleDelete, handleDownload } = props;
  return (
    <section>
      {/* Lista de artículos */}
      <div className="space-y-4">
        <ArticlesList
          articles={articles}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleDownload={handleDownload}
        />
      </div>
    </section>
  );
}

export default ArticlesAllList;
