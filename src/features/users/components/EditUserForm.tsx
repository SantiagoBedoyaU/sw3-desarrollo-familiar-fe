import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Label from '../../../shared/components/common/Label'
import Input from '../../../shared/components/common/Input'
import Select from '../../../shared/components/common/Select'
import User from '../entities/User'
import { userService } from '../../auth/services/UserService'
import { SignIn } from '../../auth/entities/SingIn'
import { ADMIN_ROLE, STUDENT_ROLE, TEACHER_ROLE, VISITOR_ROLE } from '../../../shared/constants/cts'

interface EditUserFormProps {
  user: User
  signIn: SignIn | null
  close: (open: boolean) => void
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, signIn, close }) => {
  const [formData, setFormData] = useState<User>({
    _id: '',
    name: '',
    email: '',
    password: '',
    role: 0,
    __v: 0
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
  })


  useEffect(() => {
    setFormData({
      ...user
    })
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    // Clear error when user starts typing
    if (formErrors[e.target.name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: false,
      })
    }
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      role: parseInt(e.target.value),
    })
  }

  // const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setFormData({
  //     ...formData,
  //     status: parseInt(e.target.value),
  //   })
  // }

  const validateForm = (): boolean => {
    const errors = {
      name: !formData.name.trim(),
      email:
        !formData.email.trim() ||
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email),
    }

    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (signIn?.userRole === ADMIN_ROLE && formData.role === ADMIN_ROLE) {
      await Swal.fire({
        title: 'Operación no permitida',
        text: 'No puedes modificar tu propio usuario.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      })
      close(false)
      return
    }

    setIsSubmitting(true)

    try {
      await userService.update(formData._id, formData)
      await Swal.fire({
        title: 'Usuario actualizado exitosamente',
        text: `Los datos de ${formData.name} han sido actualizados.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      })
      window.location.reload()
    } catch (error: unknown) {
      let errorMessage = 'No se pudo actualizar el usuario. Por favor, inténtelo de nuevo más tarde.'
      if (error instanceof Error && error.message) {
        errorMessage = error.message
      }
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      })
    }

    setIsSubmitting(false)
    close(false)
  }

  return (
    <section className="w-full max-w-md mx-auto">
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-6 bg-white p-1"
      >
        <section className="space-y-4">
          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label htmlFor="name" text="Nombre" error={formErrors.name} />
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre Completo"
              value={formData.name}
              onChange={handleChange}
              required
              error={formErrors.name}
              errorString="El nombre es requerido"
            />
          </section>

          <section className="md:flex md:items-center md:justify-between md:space-x-4">
            <Label
              htmlFor="email"
              text="Correo Electrónico"
              error={formErrors.email}
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
              error={formErrors.email}
              errorString="Ingrese un correo electrónico válido"
            />
          </section>

          {
            user.role !== ADMIN_ROLE && (
              <section className="md:flex md:items-center md:justify-between md:space-x-4">
                <Label htmlFor="role" text="Rol" error={false} />
                <Select
                  id="role"
                  name="role"
                  value={formData.role.toString()}
                  onChange={handleRoleChange}
                  required
                  error={false}
                  optionDefaultText="Seleccione un rol"
                  options={[
                    { value: ADMIN_ROLE.toString(), label: 'Administrador', key: 'admin' },
                    { value: TEACHER_ROLE.toString(), label: 'Docente', key: 'docente' },
                    { value: STUDENT_ROLE.toString(), label: 'Estudiante', key: 'estudiante' },
                    { value: VISITOR_ROLE.toString(), label: 'Visitante', key: 'visitante' },
                  ]}
                />
              </section>
            )
          }


          {/*
          // <section className="md:flex md:items-center md:justify-between md:space-x-4">
          //   <Label htmlFor="status" text="Estado" error={false} />
          //   <Select
          //     id="status"
          //     name="status"
          //     value={formData.status?.toString() || '1'}
          //     onChange={handleStatusChange}
          //     required
          //     error={false}
          //     optionDefaultText="Seleccione un estado"
          //     options={[
          //       { value: '1', label: 'Activo', key: 'activo' },
          //       { value: '2', label: 'Inactivo', key: 'inactivo' },
          //     ]}
          //   />
          // </section>
          */}

        </section>
        <section className="pt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Actualizando usuario...' : 'Actualizar Usuario'}
          </button>
        </section>
      </form>
    </section>
  )
}

export default EditUserForm
