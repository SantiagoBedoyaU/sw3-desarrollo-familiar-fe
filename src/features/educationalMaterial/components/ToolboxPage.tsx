import { useEffect, useState } from 'react'
import { useEducationalMaterialStore } from '../stores/EducationalMaterialStore'
import MaterialFilters from './MaterialFilters'
import MaterialsList from './MaterialsList'
import { Modal } from '../../../shared/components/common/modal/Modal'
import MaterialForm from './MaterialForm'
import useAuthStore from '../../../app/stores/useAuthStore'
import { getSignIn } from '../../auth/utils/getSignIn'
import { ADMIN_ROLE, STUDENT_ROLE, TEACHER_ROLE } from '../../../shared/constants/cts'

const ToolboxPage = () => {
  const {
    materials,
    filteredMaterials,
    isLoading,
    isLoadingFilters,
    fetchMaterials
  } = useEducationalMaterialStore()

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const { checkAuth } = useAuthStore()
  const [userRole, setUserRole] = useState<number | undefined>(undefined)

  // Cargar materiales al montar el componente
  useEffect(() => {
    void fetchMaterials()
  }, [fetchMaterials])

  // Obtener el rol del usuario para mostrar/ocultar botón de subida
  useEffect(() => {
    const signIn = getSignIn()
    if (signIn) setUserRole(signIn.userRole)
  }, [checkAuth])

  // Determinar si el usuario puede subir material (admin, docente o estudiante)
  const canUpload = userRole === ADMIN_ROLE || userRole === TEACHER_ROLE || userRole === STUDENT_ROLE

  // Determinar qué materiales mostrar (filtrados o todos)
  const materialsToShow = filteredMaterials.length > 0 ? filteredMaterials : materials

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nuestra caja de herramientas</h1>
          <p className="text-gray-600 mt-1">
            Explora y descarga materiales educativos para enriquecer tu proceso de aprendizaje
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Subir Material
          </button>
        )}
      </div>

      <MaterialFilters />

      {isLoading || isLoadingFilters ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <MaterialsList materials={materialsToShow} />
      )}

      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Subir Material Educativo</h2>
        <MaterialForm onClose={() => setIsUploadModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default ToolboxPage
