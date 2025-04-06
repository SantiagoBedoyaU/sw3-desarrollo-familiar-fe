import { Search } from 'lucide-react'
import { thematicOptions } from '@/shared/constants/cts'

interface ArticleFiltersProps {
  searchFilters: {
    title: string
    author: string
    thematicArea: string
    thematicArea2: string
  }
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void
  handleSearch: () => void
}

const formattedThematicOptions = thematicOptions.map((option) => ({
  label: option,
  value: option,
}))

function ArticleFilters({
  searchFilters,
  handleFilterChange,
  handleSearch,
}: Readonly<ArticleFiltersProps>) {
  return (
    <section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Inputs de texto */}
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
            placeholder="Autor(es)"
            value={searchFilters.author}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selects */}
        {['thematicArea', 'thematicArea2'].map((name) => (
          <div key={name} className="relative">
            <select
              name={name}
              value={searchFilters[name as keyof typeof searchFilters]}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">
                {name === 'thematicArea'
                  ? 'Eje temático principal'
                  : 'Eje temático secundario'}
              </option>
              {formattedThematicOptions.map((option) => (
                <option key={`${option.value}-${name}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute top-3 right-0 flex items-center px-2 pointer-events-none">
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
            </div>
          </div>
        ))}

        {/* Botón */}
        <div className="mb-6 md:mb-2 sm:col-span-full md:col-span-1">
          <button
            type="button"
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
