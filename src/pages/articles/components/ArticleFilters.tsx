import { Search } from 'lucide-react'
import { thematicOptions } from '../../../constants/cts'

interface ArticleFiltersProps {
  searchFilters: {
    title: string
    author: string
    thematicArea: string
    thematicArea2: string
  }
  handleFilterChange: (filters: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleSearch: () => void
}

const formattedThematicOptions = thematicOptions.map((option: string) => ({
  label: option,
  value: option,
}))

function ArticleFilters(props: Readonly<ArticleFiltersProps>) {
  const { searchFilters, handleFilterChange, handleSearch } = props
  return (
    <section>
      {/* Filtros de búsqueda */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <input
            type="text"
            name="title"
            placeholder="Título del artículo"
            value={searchFilters.title}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="author"
            placeholder="Autor(es) (ej: Naydú Núñez, Juan Pérez)"
            value={searchFilters.author}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <select
            name="thematicArea"
            value={searchFilters.thematicArea}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Eje temático principal</option>
            {formattedThematicOptions.map(
              (option: { label: string; value: string }) => (
                <option
                  key={option.value + 'thematicArea'}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
          <div className="absolute top-3 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
        <div className="relative">
          <select
            name="thematicArea2"
            value={searchFilters.thematicArea2}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Eje temático secundario</option>
            {formattedThematicOptions.map(
              (option: { label: string; value: string }) => (
                <option key={option.value + 'secondary'} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </select>
          <div className="absolute top-3 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
        {/* Botón de búsqueda */}
        <div className="mb-6 md:mb-2 sm:col-span-full md:col-span-1">
          <button
            type="submit"
            onClick={handleSearch}
            className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
          >
            <Search size={16} className="inline-block mr-2" />
            <span>Buscar</span>
          </button>
        </div>
      </section>
    </section>
  )
}

export default ArticleFilters
