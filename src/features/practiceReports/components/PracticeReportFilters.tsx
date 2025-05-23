import { Search, Trash2 } from 'lucide-react'
import { thematicOptions } from '../../../shared/constants/cts'
import { usePracticeReportStore } from '../stores/PracticeReportsStore'
import { institutionService } from '../../institutions/services/InstitutionService'
import { useEffect, useState } from 'react'
import Institution from '../../institutions/entities/Institution'

interface PracticeReportFiltersProps {
  searchFilters: {
    title: string
    authors: string
    keywords: string
    primaryThematicAxis: string
    secondaryThematicAxis: string
    period: string
    year: string
    semester: string
    institution: string
  }
  setSearchFilters: React.Dispatch<
    React.SetStateAction<{
      title: string
      authors: string
      keywords: string
      primaryThematicAxis: string
      secondaryThematicAxis: string
      year: string
      period: string
      semester: string
      institution: string
    }>
  >
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void
}

const formattedThematicOptions = thematicOptions.map((option: string) => ({
  label: option,
  value: option,
}))

function PracticeReportFilters({
  searchFilters,
  handleFilterChange,
  setSearchFilters,
}: Readonly<PracticeReportFiltersProps>) {
  const { filterPracticeReports, clearFilters } = usePracticeReportStore()
  const [institutions, setInstitutions] = useState<Institution[]>([])

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await institutionService.getAll()
        setInstitutions(response.data)
      } catch (error) {
        console.error('Error fetching institutions:', error)
      }
    }

    void fetchInstitutions()
  }, [])

  return (
    <section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Inputs de texto */}
        <section className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <input
            type="text"
            name="title"
            placeholder="Título del reporte de práctica"
            value={searchFilters.title}
            onChange={handleFilterChange}
            className="order-2 sm:order-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="year"
            placeholder="Año de publicación (YYYY)"
            value={searchFilters.year}
            onChange={handleFilterChange}
            className="order-3 sm:order-2 w-full md:w-fit whitespace-nowrap px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="semester"
            placeholder="semestre (1 o 2)"
            value={searchFilters.semester}
            onChange={handleFilterChange}
            className="order-3 sm:order-2 w-full md:w-fit whitespace-nowrap px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className='order-1 sm:order-3 w-full md:w-fit'
            type="button"
            onClick={() => {
              clearFilters()
              setSearchFilters({
                title: '',
                authors: '',
                keywords: '',
                period: '',
                year: '',
                semester: '',
                institution: '',
                primaryThematicAxis: '',
                secondaryThematicAxis: '',
              })
            }}>
            <span className="text-blue-500 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 flex items-center justify-center transition duration-300">
              <Trash2 size={16} className="inline-block mr-2" />
              Limpiar filtros
            </span>
          </button>
        </section>

        <section className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <input
            type="text"
            name="keywords"
            placeholder="Palabras clave, separadas por comas"
            value={searchFilters.keywords}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="authors"
            placeholder="Autor(es) ej: Naydú Núñez, Juan Pérez"
            value={searchFilters.authors}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </section>

        {/* Selects */}
        {(['primaryThematicAxis', 'secondaryThematicAxis'] as const).map(
          (name) => (
            <section key={name} className="relative">
              <select
                name={name}
                value={searchFilters[name]}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">
                  {name === 'primaryThematicAxis'
                    ? 'Eje temático principal'
                    : 'Eje temático secundario'}
                </option>
                {formattedThematicOptions.map((option) => (
                  <option key={`${option.value}-${name}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <section className="absolute top-3 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </section>
            </section>
          ),
        )}

        <section className="relative">
          <select
            name="institution"
            value={searchFilters.institution}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Institución</option>
            {
              institutions.length === 0 && (
                <option value="">Cargando instituciones...</option>
              )}
            {institutions.map((institution) => (
              <option key={institution._id} value={institution._id}>
                {institution.name}
              </option>
            ))}
          </select>
          <section className="absolute top-3 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </section>
        </section>

        {/* Botón */}
        <section className="mb-6 md:mb-2 sm:col-span-full md:col-span-1">
          <button
            type="button"
            onClick={() => {
              if (searchFilters.title ||
                searchFilters.authors ||
                searchFilters.keywords ||
                searchFilters.primaryThematicAxis ||
                searchFilters.secondaryThematicAxis ||
                searchFilters.period ||
                searchFilters.institution
              ) {
                filterPracticeReports({
                  title: searchFilters.title,
                  authors: searchFilters.authors,
                  keywords: searchFilters.keywords,
                  primaryThematicAxis: searchFilters.primaryThematicAxis,
                  secondaryThematicAxis: searchFilters.secondaryThematicAxis,
                  period: searchFilters.period,
                  institution: searchFilters.institution,
                })
              }
            }
            }
            className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
          >
            <Search size={16} className="inline-block mr-2" />
            <span>Buscar</span>
          </button>
        </section>
      </section>
    </section>
  )
}

export default PracticeReportFilters
