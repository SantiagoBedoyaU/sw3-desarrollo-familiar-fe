import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '../../components/dropdown/DropdownMenu'
import { useEffect, useState } from 'react'
import { Modal } from '../../../shared/components/common/modal/Modal'
import User from '../../../shared/types/entities/User'

const sample_users: User[] = [
  {
    _id: '1',
    email: 'admin@text.com',
    name: 'admin',
    role: 1,
    password: '123456789',
    __v: 0,
  },
  {
    _id: '1',
    email: 'juju@gmail.com',
    name: 'admin',
    role: 1,
    password: '123456789',
    __v: 0,
  },
]

const headersTable = ['Usuario', 'Rol', 'Acciones']

const fetchUsers = async () => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return sample_users
}

export default function UsersTable() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>({} as User)
  const [users, setUsers] = useState<User[]>([])
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data)
      })
      .catch((error) => {
        console.error('Error al cargar los usuarios', error)
        setUsers([])
        alert('Error al cargar los usuarios')
      })
  }, [])

  const handleDelete = (_id: string) => {
    setUsers(users.filter((user) => user._id !== _id))
    setIsDeleteConfirmOpen(false)
  }

  return (
    <section className="px-2 py-4 overflow-x-auto sm:overflow-visible">
      <table className="w-full border border-gray-50 rounded-xl table-auto text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-600 uppercase text-xs sm:text-sm">
            {headersTable.map((header) => (
              <th key={'UserHeader' + header} className="p-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="text-sm sm:text-base">
              <td className="p-2 whitespace-nowrap">{user.name}</td>
              <td className="p-2 whitespace-nowrap">{user.role}</td>
              <td className="p-2 cursor-pointer text-center">
                <button>
                  <Pencil className="mr-2 h-4 w-4" />
                  <p>Editar</p>
                </button>
                <button>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4">
          Confirmar Eliminación de Usuario
        </h2>
        <p className="mb-4">
          ¿Estás seguro de que deseas eliminar al usuario{' '}
          <p className="font-semibold text-red-600 inline-block">
            {selectedUser.name}
          </p>
          ?
        </p>
        <section className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsDeleteConfirmOpen(false)}
            className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => selectedUser._id && handleDelete(selectedUser._id)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar
          </button>
        </section>
      </Modal>
    </section>
  )
}
