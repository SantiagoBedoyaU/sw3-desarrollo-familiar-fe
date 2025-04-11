import { useState } from 'react'
import { Plus, UserPlus } from 'lucide-react'
import { Dialog } from '../../../shared/components/common/dialog/Dialog'
import { DialogTrigger } from '../../../shared/components/common/dialog/DialogTrigger'
import { DialogContent } from '../../../shared/components/common/dialog/DialogContent'
import { DialogHeader } from '../../../shared/components/common/dialog/DialogHeader'
import { DialogTitle } from '../../../shared/components/common/dialog/DialogTitle'
import { DialogDescription } from '../../../shared/components/common/dialog/DialogDescription'
import UserForm from './UserForm'

function UsersHeader() {
  const [open, setOpen] = useState(false)
  return (
    <section className="flex items-center justify-between gap-4 mr-10 md:mr-5 max-w-fit px-4 py-2 sm:px-6 lg:px-8">
      <section>
        <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
      </section>
      <Dialog className="relative" open={open} setOpen={setOpen}>
        <DialogTrigger setOpen={setOpen}>
          <section className="flex items-center justify-center gap-2 p-2 border rounded-lg text-white bg-blue-500 border-gray-50 hover:bg-gray-600 hover:border-gray-800">
            <Plus className="md:mr-2 h-4 w-4" />
            <p>Nuevo usuario</p>
          </section>
        </DialogTrigger>
        <DialogContent
          open={open}
          setOpen={setOpen}
          className="sm:max-w-[600px] m-auto"
        >
          <DialogHeader>
            <DialogTitle>
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-2">
                <UserPlus className="h-5 w-5" />
                Crear Nuevo Usuario
              </h3>
            </DialogTitle>
            <DialogDescription>
              <section className="mb-6">
                <p className="text-gray-600">
                  Ingresa los datos del nuevo usuario para registrarlo en el
                  sistema.
                </p>
              </section>
            </DialogDescription>
          </DialogHeader>
          <UserForm close={setOpen} />
        </DialogContent >
      </Dialog>
    </section>
  )
}

export default UsersHeader
