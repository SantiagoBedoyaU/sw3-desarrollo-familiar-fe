import { useEffect, useState, useCallback } from 'react'
import PracticeReportForm from './components/PracticeReportForm'
import PracticeReportFilters from './components/PracticeReportFilters'
import PracticeReportsTop from './components/PracticeReportsTop'
import PracticeReportsAllList from './components/PracticeReportsAllList'
import PracticeReportsFilterList from './components/PracticeReportsFilterList'
import useAuthStore from '../../app/stores/useAuthStore'
import { SignIn } from '../users/entities/User'
// import { usePracticeReportStore } from './stores/PracticeReportsStore'

const PracticeReports = () => {
  // const { filteredPracticeReports } = usePracticeReportStore()
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
    const signInString = localStorage.getItem('signIn')
    const signIn: SignIn | null = signInString
      ? (JSON.parse(signInString) as SignIn)
      : null
    setUserRole(signIn?.userRole === 1 || signIn?.userRole === 2)
  }, [checkAuth])

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
        {userRole && <PracticeReportForm mode="add" />}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Filtrar reportes de práctica
        </h2>
      </section>

      <PracticeReportFilters
        setSearchFilters={setSearchFilters}
        handleFilterChange={handleFilterChange}
        searchFilters={searchFilters}
      />
      {countFilters === 0 && (
        <section>
          <section className="mb-4 flex flex-col items-center justify-between gap-4 bg-gray-50 p-1 rounded-md shadow-md">
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              <span className="text-blue-500">Top Reportes destacados</span>
            </h4>
            <PracticeReportsTop />
          </section>
          <PracticeReportsAllList />
        </section>
      )}

      {countFilters > 0 && <PracticeReportsFilterList />}
    </section>
  )
}

export default PracticeReports
