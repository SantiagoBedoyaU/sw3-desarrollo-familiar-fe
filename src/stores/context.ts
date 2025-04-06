// import React, { createContext, useState, useContext, ReactNode } from "react";
// import { Article, ThematicArea } from "@/types";
// import { initialArticles } from "@/utils/articleUtils";
// import { v4 as uuidv4 } from "uuid";
// import { toast } from "@/components/ui/use-toast";

// interface ArticleContextType {
//   articles: Article[];
//   filteredArticles: Article[];
//   searchTerm: string;
//   selectedThematicArea: string | null;
//   addArticle: (article: Omit<Article, "id" | "createdAt">) => void;
//   deleteArticle: (id: string) => void;
//   editArticle: (id: string, article: Omit<Article, "id" | "createdAt">) => void;
//   searchArticles: (term: string) => void;
//   filterByThematicArea: (area: string | null) => void;
// }

// const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [articles, setArticles] = useState<Article[]>(initialArticles);
//   const [filteredArticles, setFilteredArticles] = useState<Article[]>(initialArticles);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedThematicArea, setSelectedThematicArea] = useState<string | null>(null);

//   const addArticle = (article: Omit<Article, "id" | "createdAt">) => {
//     const newArticle: Article = {
//       ...article,
//       id: uuidv4(),
//       createdAt: new Date(),
//     };

//     setArticles((prevArticles) => [...prevArticles, newArticle]);

//     // Apply any existing filters to the updated list
//     applyFilters([...articles, newArticle], searchTerm, selectedThematicArea);

//     toast({
//       title: "Artículo agregado",
//       description: "El artículo ha sido agregado exitosamente.",
//     });
//   };

//   const deleteArticle = (id: string) => {
//     setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));

//     // Apply any existing filters to the updated list
//     applyFilters(
//       articles.filter((article) => article.id !== id),
//       searchTerm,
//       selectedThematicArea
//     );

//     toast({
//       title: "Artículo eliminado",
//       description: "El artículo ha sido eliminado exitosamente.",
//     });
//   };

//   const editArticle = (id: string, updatedArticle: Omit<Article, "id" | "createdAt">) => {
//     setArticles((prevArticles) =>
//       prevArticles.map((article) =>
//         article.id === id
//           ? { ...updatedArticle, id, createdAt: article.createdAt }
//           : article
//       )
//     );

//     // Apply any existing filters to the updated list
//     applyFilters(
//       articles.map((article) =>
//         article.id === id
//           ? { ...updatedArticle, id, createdAt: article.createdAt }
//           : article
//       ),
//       searchTerm,
//       selectedThematicArea
//     );

//     toast({
//       title: "Artículo actualizado",
//       description: "El artículo ha sido actualizado exitosamente.",
//     });
//   };

//   const searchArticles = (term: string) => {
//     setSearchTerm(term);
//     applyFilters(articles, term, selectedThematicArea);
//   };

//   const filterByThematicArea = (area: string | null) => {
//     setSelectedThematicArea(area);
//     applyFilters(articles, searchTerm, area);
//   };

//   const applyFilters = (
//     articleList: Article[],
//     term: string,
//     area: string | null
//   ) => {
//     let filtered = articleList;

//     // Apply search term filter
//     if (term) {
//       filtered = filtered.filter(
//         (article) =>
//           article.title.toLowerCase().includes(term.toLowerCase()) ||
//           article.authors.some((author) =>
//             author.toLowerCase().includes(term.toLowerCase())
//           )
//       );
//     }

//     // Apply thematic area filter
//     if (area) {
//       filtered = filtered.filter((article) => article.thematicArea === area);
//     }

//     setFilteredArticles(filtered);
//   };

//   return (
//     <ArticleContext.Provider
//       value={{
//         articles,
//         filteredArticles,
//         searchTerm,
//         selectedThematicArea,
//         addArticle,
//         deleteArticle,
//         editArticle,
//         searchArticles,
//         filterByThematicArea,
//       }}
//     >
//       {children}
//     </ArticleContext.Provider>
//   );
// };

// export const useArticles = () => {
//   const context = useContext(ArticleContext);
//   if (!context) {
//     throw new Error("useArticles must be used within an ArticleProvider");
//   }
//   return context;
// };
