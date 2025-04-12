import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Swal from 'sweetalert2'
import Label from '../../../shared/components/common/Label'
import Input from '../../../shared/components/common/Input'
import Select from '../../../shared/components/common/Select'
import { UserCreate } from '../../../shared/types/entities/User'
import { userService } from '../../../shared/services/UserService'

interface UserFormProps {
  close: (open: boolean) => void
}

const UserForm: React.FC<UserFormProps> = ({ close }) => {
  // Initial form state aligned with the User interface
  const [formData, setFormData] = useState<UserCreate>({
    name: '',
    email: '',
    password: '',
    role: 1,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    password: false,
  })

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = (): boolean => {
    const errors = {
      name: !formData.name.trim(),
      email:
        !formData.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      password: !formData.password.trim() || formData.password.length < 6,
    }

    setFormErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)


    // Complete user object matching the User interface
    const completeUser: UserCreate = {
      ...formData,
    }

    await userService.create(completeUser).then(async () => {
      await Swal.fire({
        title: 'Usuario creado exitosamente',
        text: `${formData.name} ha sido registrado como ${formData.role === 1 ? 'Administrador' : 'Usuario'}.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      })
      window.location.reload()
    }).catch(() => {
      void Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el usuario. Por favor, inténtelo de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        window.location.reload()
      })
    })
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 1,
    })
    setIsSubmitting(false)
    close(false)
  }

  return (
    <section className="w-full max-w-md mx-auto ">
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-6 bg-white rounded-lg shadow-md p-1"
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

          <section className="relative h-fit">
            <button
              type="button"
              className="absolute right-3 -top-1/2 md:top-1/2 transform -translate-y-1/2 w-fit z-30"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <section className="w-full md:flex md:items-center md:justify-between md:space-x-4">
              <Label
                htmlFor="password"
                text="Contraseña"
                error={formErrors.password}
              />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa una contraseña segura"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10"
                error={formErrors.password}
                errorString="La contraseña debe tener al menos 6 caracteres"
              />
            </section>
          </section>

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
                { value: '1', label: 'Administrador', key: 'admin' },
                { value: '2', label: 'Docente', key: 'docente' },
                { value: '3', label: 'Estudiante', key: 'estudiante' },
                { value: '4', label: 'Visitante', key: 'visitante' },
              ]}
            />
          </section>
        </section>
        <section className="pt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando usuario...' : 'Crear Usuario'}
          </button>
        </section>
      </form>
    </section>
  )
}

export default UserForm
