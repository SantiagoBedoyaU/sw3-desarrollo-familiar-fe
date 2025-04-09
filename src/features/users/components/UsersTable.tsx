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

const headersTable = ['Nombre', 'Email', 'Rol', 'Acciones']

const fetchUsers = async () => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return sample_users
}

export default function UsersTable() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>(sample_users[0])
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
    <section className="relative overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {headersTable.map((header) => (
            <th key={'UserHeader' + header} className="px-6 py-3">
              {header}
            </th>
          ))}
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="text-sm sm:text-base bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              onClick={() => setSelectedUser(user)}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              {/* Dropdown Menu for Actions */}
              <td className="px-6 py-4 whitespace-nowrap">
                <section className="px-6 py-4">
                  <button className="flex items-center gap-2">
                    <Pencil className="mr-2 h-4 w-4" />
                    <p>Editar</p>
                  </button>
                  <button
                    className="flex items-center gap-2"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </button>
                </section>
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
