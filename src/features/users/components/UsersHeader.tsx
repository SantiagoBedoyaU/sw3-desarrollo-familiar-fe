import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Dialog } from '../../../shared/components/common/dialog/Dialog'
import { DialogTrigger } from '../../../shared/components/common/dialog/DialogTrigger'
import { DialogContent } from '../../../shared/components/common/dialog/DialogContent'
import { DialogHeader } from '../../../shared/components/common/dialog/DialogHeader'
import { DialogTitle } from '../../../shared/components/common/dialog/DialogTitle'
import { DialogDescription } from '../../../shared/components/common/dialog/DialogDescription'

function UsersHeader() {
  const [open, setOpen] = useState(false)
  return (
    <section className="flex items-center justify-between gap-4 p-2 mr-10 md:mr-5 max-w-fit">
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
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Completa los detalles del usuario. Todos los campos son
              requeridos.
            </DialogDescription>
          </DialogHeader>
          {/* <UserCreate /> */}
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default UsersHeader
