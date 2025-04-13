import Institution from '../entities/Institution'
import { useInstitutionStore } from '../stores/InstitutionsStore'

interface Props {
  institutions: Institution[]
}

const InstitutionsList = ({ institutions }: Props) => {
  const { deleteInstitution } = useInstitutionStore()

  return (
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
              <button
                onClick={() => deleteInstitution(institution._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default InstitutionsList
