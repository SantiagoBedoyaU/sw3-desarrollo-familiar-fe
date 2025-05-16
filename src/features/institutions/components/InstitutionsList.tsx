import { useEffect, useState } from 'react'
import Institution from '../entities/Institution'
import { useInstitutionStore } from '../stores/InstitutionsStore'
import { Modal } from '../../../shared/components/common/modal/Modal'
import InstitutionEditForm from './InstitutionEditForm'
import useAuthStore from '../../../app/stores/useAuthStore'
import { getSignIn } from '../../auth/utils/getSignIn'
import { ADMIN_ROLE, TEACHER_ROLE } from '../../../shared/constants/cts'

interface Props {
  institutions: Institution[]
}

const InstitutionsList = ({ institutions }: Props) => {
  const { deleteInstitution } = useInstitutionStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null)
  const { checkAuth } = useAuthStore()
  const [userRole, setUserRole] = useState<number | undefined>(undefined)

  useEffect(() => {
    const signIn = getSignIn()
    if (signIn?.userRole) setUserRole(signIn.userRole)
  }, [checkAuth])

  const canManage = userRole === ADMIN_ROLE || userRole === TEACHER_ROLE

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
