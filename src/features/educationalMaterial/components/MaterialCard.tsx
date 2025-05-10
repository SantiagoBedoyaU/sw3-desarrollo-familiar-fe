import { useEffect, useState } from 'react'
import { Download, Edit2, ExternalLink, Trash2 } from 'lucide-react'
import EducationalMaterial from '../entities/EducationalMaterial'
import { educationalMaterialService } from '../services/EducationalMaterialService'
import { Modal } from '../../../shared/components/common/modal/Modal'
import MaterialEdit from './MaterialEdit'
import { useEducationalMaterialStore } from '../stores/EducationalMaterialStore'
import useAuthStore from '../../../app/stores/useAuthStore'

interface MaterialCardProps {
  material: EducationalMaterial
  setUpdatedMaterials?: React.Dispatch<React.SetStateAction<EducationalMaterial[]>>
}

const MaterialCard = ({ material, setUpdatedMaterials }: MaterialCardProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { deleteMaterial } = useEducationalMaterialStore()
  // const { checkAuth } = useAuthStore()
  const [userRole, setUserRole] = useState<number | undefined>(undefined)

  // Obtener el rol del usuario para mostrar/ocultar botones de edición y eliminación
  useEffect(() => {
    const signInString = localStorage.getItem('signIn')
    if (signInString) {
      const signIn: { userRole?: number } = JSON.parse(signInString)
      setUserRole(signIn.userRole)
    }
  }, [])

  // Determinar si el usuario puede editar y eliminar (admin o docente)
  const canEditDelete = userRole === 1 || userRole === 2 // 1: admin, 2: docente

  // Determinar si el usuario puede subir material (admin, docente o estudiante)
  const canUpload = userRole === 1 || userRole === 2 || userRole === 3 // 3: estudiante

  // Manejar descarga o redirección
  const handleDownload = async () => {
    try {
      setIsLoading(true)
      await educationalMaterialService.downloadMaterial(material)
    } catch (error) {
      console.error('Error downloading material:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar eliminación
  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleteMaterial(material._id)

      // Actualizar la lista local si se proporciona la función setUpdatedMaterials
      if (setUpdatedMaterials) {
        setUpdatedMaterials((prevMaterials) =>
          prevMaterials.filter((m) => m._id !== material._id)
        )
      }

      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting material:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener iconos según el tipo de material
  const getIcon = () => {
    switch (material.type) {
    case 'document':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case 'image':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'resource':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center justify-center mb-4">
          {getIcon()}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{material.title}</h3>

        {material.description && (
          <p className="text-sm text-gray-600 mb-4">{material.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {material.type === 'document' && 'Documento'}
            {material.type === 'image' && 'Imagen'}
            {material.type === 'resource' && 'Recurso Web'}
            {material.type === 'other' && 'Otro'}
          </span>

          {material.minAge !== undefined && material.maxAge !== undefined && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {material.minAge === material.maxAge
                ? `${material.minAge} años`
                : `${material.minAge}-${material.maxAge} años`}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* Botón de descarga o visita */}
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded ${
              material.type === 'resource'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition-colors duration-300`}
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
            ) : material.type === 'resource' ? (
              <>
                <ExternalLink size={16} />
                <span>Ir al sitio</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Descargar</span>
              </>
            )}
          </button>

          {/* Botones de edición y eliminación (solo para admin y docente) */}
          {canEditDelete && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors duration-300"
              >
                <Edit2 size={14} />
                <span>Editar</span>
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-300"
              >
                <Trash2 size={14} />
                <span>Eliminar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Editar Material Educativo</h2>
        <MaterialEdit
          material={material}
          onClose={() => setIsEditModalOpen(false)}
          setUpdatedMaterials={setUpdatedMaterials}
        />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Confirmar Eliminación</h2>
        <p className="mb-4">
          ¿Está seguro de que desea eliminar este material educativo?
          <br />
          <span className="font-semibold">{material.title}</span>
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default MaterialCard
