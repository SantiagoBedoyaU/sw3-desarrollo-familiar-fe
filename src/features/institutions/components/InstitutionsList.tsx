import { useState } from 'react'
import Institution from '../entities/Institution'
import { useInstitutionStore } from '../stores/InstitutionsStore'
import { Modal } from '../../../shared/components/common/modal/Modal'
import InstitutionEditForm from './InstitutionEditForm'
import useAuthStore from '../../../app/stores/useAuthStore'

interface Props {
  institutions: Institution[]
}

const InstitutionsList = ({ institutions }: Props) => {
  const { deleteInstitution } = useInstitutionStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null)
  const { checkAuth } = useAuthStore()
  const [userRole, setUserRole] = useState<number | undefined>(undefined)

  // Verificar el rol del usuario para controlar permisos
  useState(() => {
    const signInString = localStorage.getItem('signIn')
    if (signInString) {
      const signIn = JSON.parse(signInString)
      setUserRole(signIn?.userRole)
    }
  })

  // Determinar si el usuario puede editar/eliminar (admin o docente)
  const canManage = userRole === 1 || userRole === 2 // 1: admin, 2: docente

  const handleEditClick = (institution: Institution) => {
    setSelectedInstitution(institution)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <section className="mt-2">
        {institutions.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No se encontraron instituciones con ese nombre.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {institutions.map((institution) => (
              <li
                key={institution._id}
                className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded transition"
              >
                <span className="text-gray-800 font-medium">
                  {institution.name}
                </span>
                {canManage && (
                  <div className='flex gap-2'>
                    <button
                      type="button"
                      onClick={() => handleEditClick(institution)}
                      className="text-sm text-yellow-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteInstitution(institution._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal de edición */}
      {selectedInstitution && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <InstitutionEditForm 
            institution={selectedInstitution} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        </Modal>
      )}
    </>
  )
}

export default InstitutionsList
