import { useState } from 'react'
import { materialTypes } from '../entities/EducationalMaterial'
import { useEducationalMaterialStore } from '../stores/EducationalMaterialStore'

const Title = (
  title: string,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
  return <div>
    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
      Título
    </label>
    <input
      type="text"
      id="title"
      name="title"
      value={title}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Buscar por título"
    />
  </div>
}

const TypeMaterial = (
  type: string,
  handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
) => {
  return <div>
    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
      Tipo de Material
    </label>
    <select
      id="type"
      name="type"
      value={type}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Todos los tipos</option>
      {materialTypes.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </select>
  </div>
}

const MinimalAge = (
  minAge: string,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
  return <div>
    <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-1">
      Edad Mínima
    </label>
    <input
      type="number"
      id="minAge"
      name="minAge"
      value={minAge}
      onChange={handleInputChange}
      min="4"
      max="12"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Desde edad"
    />
  </div>
}

const MaximalAge = (
  maxAge: string,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
  return <div>
    <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700 mb-1">
      Edad Máxima
    </label>
    <input
      type="number"
      id="maxAge"
      name="maxAge"
      value={maxAge}
      onChange={handleInputChange}
      min="4"
      max="12"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Hasta edad"
    />
  </div>
}

const ActionButtons = (
  handleClear: () => void,
) => {
  return <div className="flex justify-end space-x-3">
    <button
      type="button"
      onClick={handleClear}
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      Limpiar
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Aplicar Filtros
    </button>
  </div>
}

const MaterialFilters = () => {
  const { filterMaterials, clearFilters } = useEducationalMaterialStore()
  const [filters, setFilters] = useState({
    title: '',
    type: '',
    minAge: '',
    maxAge: '',
    page: 1,
    limit: 10
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { minAge, maxAge } = getAges()
    validateAgeRange(minAge, maxAge)
    applyFilters(minAge, maxAge)
  }

  const getAges = () => {
    const minAge = filters.minAge ? parseInt(filters.minAge) : undefined
    const maxAge = filters.maxAge ? parseInt(filters.maxAge) : undefined
    return { minAge, maxAge }
  }

  const validateAgeRange = (minAge: number | undefined, maxAge: number | undefined) => {
    if (minAge !== undefined && (minAge < 4 || minAge > 12)) {
      alert('La edad mínima debe estar entre 4 y 12 años')
      return
    }
    if (maxAge !== undefined && (maxAge < 4 || maxAge > 12)) {
      alert('La edad máxima debe estar entre 4 y 12 años')
      return
    }
    if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
      alert('La edad mínima no puede ser mayor que la edad máxima')
    }
  }

  const applyFilters = (minAge: number | undefined, maxAge: number | undefined) => {
    filterMaterials({
      title: filters.title || undefined,
      type: filters.type || undefined,
      minAge,
      maxAge,
      page: filters.page,
      limit: filters.limit
    })
  }

  const handleClear = () => {
    setFilters({
      title: '',
      type: '',
      minAge: '',
      maxAge: '',
      page: 1,
      limit: 10
    })
    clearFilters()
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Filtrar Materiales</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Title(filters.title, handleInputChange)}
          {TypeMaterial(filters.type, handleInputChange)}
          {MinimalAge(filters.minAge, handleInputChange)}
          {MaximalAge(filters.maxAge, handleInputChange)}
        </div>
        {ActionButtons(
          handleClear,
        )}
      </form>
    </div>
  )
}

export default MaterialFilters
