import { useEffect, useState } from 'react'
import ArticleForm from './components/ArticleForm'
import ArticleFilters from './components/ArticleFilters'
import ArticlesTop from './components/ArticlesTop'
import Article from '../../types/entities/Article'
import ArticlesAllList from './components/ArticlesAllList'

const Articles = () => {
  // Estado para los filtros de búsqueda
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    author: '',
    thematicArea: '',
    thematicArea2: '',
  })

  const [countFilters, setCountFilters] = useState(0)
  const manageCount = () => {
    let count = 0
    if (searchFilters.title !== '') {
      count++
    }
    if (searchFilters.author !== '') {
      count++
    }
    if (searchFilters.thematicArea !== '') {
      count++
    }
    if (searchFilters.thematicArea2 !== '') {
      count++
    }
    setCountFilters(count)
  }

  useEffect(() => {
    manageCount()
  }, [searchFilters, setSearchFilters, manageCount])

  // Estado para los artículos
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'Artículo de aceite enriquecido en niñas',
      authors: 'Naydú Núñez',
      thematicArea: 'Pediatría',
      thematicArea2: 'Pediatría',
      keywords: 'aceite, enriquecido, niñas',
      summary: 'Resumen del artículo',
      file: new File([], 'file.pdf'),
      year: '2023',
    },
    {
      id: '2',
      title: 'Artículo de aceite enriquecido en niñas',
      authors: 'Naydú Núñez, Juan Perez',
      thematicArea: 'Nutrición',
      thematicArea2: 'Pediatría',
      keywords: 'aceite, enriquecido, niñas',
      summary: 'Resumen del artículo',
      file: new File([], 'file.pdf'),
      year: '2023',
    },
    {
      id: '3',
      title: 'Artículo de aceite enriquecido en niñas',
      authors: 'Naydú Núñez',
      thematicArea: 'Pediatría',
      thematicArea2: 'Pediatría',
      keywords: 'aceite, enriquecido, niñas',
      summary: 'Resumen del artículo',
      file: new File([], 'file.pdf'),
      year: '2023',
    },
    {
      id: '4',
      title: 'Artículo de aceite enriquecido en niñas',
      authors: 'Naydú Núñez',
      thematicArea: 'Nutrición',
      thematicArea2: 'Pediatría',
      keywords: 'aceite, enriquecido, niñas',
      summary: 'Resumen del artículo',
      file: new File([], 'file.pdf'),
      year: '2023',
    },
  ])

  // Manejadores de eventos
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    // Aquí iría la lógica de búsqueda real
    console.log('Buscando con filtros:', searchFilters)
  }

  const handleEdit = (id: string) => {
    console.log('Editando artículo:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Eliminando artículo:', id)
    setArticles(articles.filter((article) => article.id !== id))
  }

  const handleDownload = (id: string) => {
    console.log('Descargando artículo:', id)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <section className="md:relative md:flex md:items-center md:justify-between mb-4">
        <ArticleForm mode="add" />
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Filtrar artículos de investigación
        </h2>
      </section>
      <ArticleFilters
        handleFilterChange={handleFilterChange}
        handleSearch={handleSearch}
        searchFilters={searchFilters}
      />
      {countFilters === 0 && (
        <ArticlesTop
          articles={articles}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleDownload={handleDownload}
        />
      )}
      {countFilters > 0 && (
        <ArticlesAllList
          articles={articles}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleDownload={handleDownload}
        />
      )}
    </div>
  )
}

export default Articles
