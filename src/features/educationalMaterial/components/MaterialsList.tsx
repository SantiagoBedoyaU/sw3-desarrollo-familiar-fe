import { useState } from 'react'
import EducationalMaterial from '../entities/EducationalMaterial'
import MaterialCard from './MaterialCard'
// import Pagination from '../../../shared/components/common/pagination/Pagination'

interface MaterialsListProps {
  materials: EducationalMaterial[]
}

const MaterialsList = ({ materials }: MaterialsListProps) => {
  const [currentPage] = useState(1)
  const [updatedMaterials, setUpdatedMaterials] = useState<EducationalMaterial[]>(materials)
  const itemsPerPage = 20 // Según los requerimientos

  // Calcular el índice de inicio y fin para la paginación
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMaterials = updatedMaterials.slice(startIndex, endIndex)
  const totalPages = Math.ceil(updatedMaterials.length / itemsPerPage)

  // Cambiar de página
  // const handlePageChange = (pageNumber: number) => {
  //   setCurrentPage(pageNumber)
  // }

  if (updatedMaterials.length === 0) {
    return (
      <div className="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No hay materiales educativos disponibles</h3>
        <p className="mt-1 text-sm text-gray-500">No se encontraron materiales educativos con los filtros aplicados.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentMaterials.map((material) => (
          <MaterialCard
            key={material._id}
            material={material}
            setUpdatedMaterials={setUpdatedMaterials}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          {/* <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          /> */}
        </div>
      )}
    </div>
  )
}

export default MaterialsList
