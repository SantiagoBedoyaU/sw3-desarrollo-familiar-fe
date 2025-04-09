import { useEffect, useState, useCallback } from 'react'
import ArticleForm from './components/ArticleForm'
import ArticleFilters from './components/ArticleFilters'
import ArticlesTop from './components/ArticlesTop'
import ArticlesAllList from './components/ArticlesAllList'

const Articles = () => {
  // Estado para los filtros de búsqueda
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    author: '',
    primaryThematicAxis: '',
    secondaryThematicAxis: '',
  })

  const [countFilters, setCountFilters] = useState(0)

  // Memoiza manageCount para evitar warning en useEffect
  const manageCount = useCallback(() => {
    let count = 0
    if (searchFilters.title !== '') count++
    if (searchFilters.author !== '') count++
    if (searchFilters.primaryThematicAxis !== '') count++
    if (searchFilters.secondaryThematicAxis !== '') count++
    setCountFilters(count)
  }, [searchFilters])

  useEffect(() => {
    manageCount()
  }, [manageCount])

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
    console.log('Buscando con filtros:', searchFilters)
  }

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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

      {countFilters === 0 && <ArticlesTop />}
      {countFilters > 0 && <ArticlesAllList />}
    </section>
  )
}

export default Articles
