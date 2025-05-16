import { useEffect, useState, useCallback } from 'react'
import ArticleForm from './components/ArticleForm'
import ArticleFilters from './components/ArticleFilters'
import ArticlesTop from './components/ArticlesTop'
import ArticlesAllList from './components/ArticlesAllList'
import ArticlesFilterList from './components/ArticlesFilterList'
import useAuthStore from '../../app/stores/useAuthStore'
import { getSignIn } from '../auth/utils/getSignIn'
import { ADMIN_ROLE, TEACHER_ROLE } from '../../shared/constants/cts'

const Articles = () => {
  const { checkAuth } = useAuthStore()
  const [userRole, setUserRole] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    authors: '',
    keywords: '',
    year: '',
    primaryThematicAxis: '',
    secondaryThematicAxis: '',
  })
  const [countFilters, setCountFilters] = useState(0)

  useEffect(() => {
    const signIn = getSignIn()
    setUserRole(signIn?.userRole === ADMIN_ROLE || signIn?.userRole === TEACHER_ROLE)
  }, [checkAuth])

  // Memoiza manageCount para evitar warning en useEffect
  const manageCount = useCallback(() => {
    let count = 0
    if (searchFilters.title !== '') count++
    if (searchFilters.authors !== '') count++
    if (searchFilters.keywords !== '') count++
    if (searchFilters.year !== '') count++
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

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <section className="md:relative md:flex md:items-center md:justify-between mb-4">
        {userRole && <ArticleForm />}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Filtrar artículos de investigación
        </h2>
      </section>

      <ArticleFilters
        setSearchFilters={setSearchFilters}
        handleFilterChange={handleFilterChange}
        searchFilters={searchFilters}
      />
      {countFilters === 0 && (
        <section>
          <section className="mb-4 flex flex-col items-center justify-between gap-4 bg-gray-50 p-1 rounded-md shadow-md">
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              <span className="text-blue-500">Top Artículos destacados</span>
            </h4>
            <ArticlesTop />
          </section>
          <ArticlesAllList />
        </section>
      )}

      {countFilters > 0 && <ArticlesFilterList />}
    </section>
  )
}

export default Articles
