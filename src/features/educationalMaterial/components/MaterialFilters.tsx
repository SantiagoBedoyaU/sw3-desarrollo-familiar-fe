import { useState } from 'react'
import { materialTypes } from '../entities/EducationalMaterial'
import { useEducationalMaterialStore } from '../stores/EducationalMaterialStore'

const MaterialFilters = () => {
  const { filterMaterials, clearFilters } = useEducationalMaterialStore()
  
  const [filters, setFilters] = useState({
    title: '',
    type: '',
    minAge: '',
    maxAge: ''
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
    
    // Validar que minAge y maxAge sean números o estén vacíos
    const minAge = filters.minAge ? parseInt(filters.minAge) : undefined
    const maxAge = filters.maxAge ? parseInt(filters.maxAge) : undefined
    
    // Validar rango de edades (si ambos están definidos)
    if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
      alert('La edad mínima no puede ser mayor que la edad máxima')
      return
    }
    
    // Aplicar filtros
    filterMaterials({
      title: filters.title || undefined,
      type: filters.type || undefined,
      minAge,
      maxAge
    })
  }

  const handleClear = () => {
    setFilters({
      title: '',
      type: '',
      minAge: '',
      maxAge: ''
    })
    clearFilters()
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Filtrar Materiales</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={filters.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por título"
            />
          </div>
          
          {/* Filtro por tipo */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Material
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
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
          
          {/* Filtro por edad mínima */}
          <div>
            <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-1">
              Edad Mínima
            </label>
            <input
              type="number"
              id="minAge"
              name="minAge"
              value={filters.minAge}
              onChange={handleInputChange}
              min="4"
              max="12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Desde edad"
            />
          </div>
          
          {/* Filtro por edad máxima */}
          <div>
            <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700 mb-1">
              Edad Máxima
            </label>
            <input
              type="number"
              id="maxAge"
              name="maxAge"
              value={filters.maxAge}
              onChange={handleInputChange}
              min="4"
              max="12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hasta edad"
            />
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
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
      </form>
    </div>
  )
}

export default MaterialFilters
