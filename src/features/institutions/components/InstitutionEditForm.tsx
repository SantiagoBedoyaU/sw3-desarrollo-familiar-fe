import { useState, useEffect } from 'react'
import { useInstitutionStore } from '../stores/InstitutionsStore'
import Institution from '../entities/Institution'
import Input from '../../../shared/components/common/Input'
import Button from '../../../shared/components/common/Button'
import Swal from 'sweetalert2'

interface InstitutionEditFormProps {
  institution: Institution
  onClose: () => void
}

const InstitutionEditForm = ({ institution, onClose }: InstitutionEditFormProps) => {
  const [name, setName] = useState(institution.name)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { editInstitution, institutions } = useInstitutionStore()

  useEffect(() => {
    setName(institution.name)
  }, [institution])


  const verifyInstitutionName = (value: string) => {
    const institutionExists = institutions.some(
      (inst) => inst.name.toLowerCase() === value.toLowerCase() && inst._id !== institution._id
    )
    if (institutionExists) {
      setError('Ya existe una institución con este nombre')
      return false
    }
    return true
  }

  const verifyCharacters = (value: string) => {
    const validPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()-]+$/
    if (!validPattern.test(value)) {
      setError('El nombre contiene caracteres especiales no permitidos')
      return false
    }
    return true
  }

  const verifySpaces = (value: string) => {
    if (value !== value.trim()) {
      setError('El nombre no debe comenzar ni terminar con espacios')
      return false
    }
    return true
  }

  const verifyEmpty = (value: string) => {
    if (!value.trim()) {
      setError('El nombre de la institución es obligatorio')
      return false
    }
    return true
  }

  const validateName = (value: string): boolean => {
    if (!verifyEmpty(value)) return false
    if (!verifySpaces(value)) return false
    if (!verifyCharacters(value)) return false
    if (!verifyInstitutionName(value)) return false
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateName(name)) return
    try {
      setIsSubmitting(true)
      await editInstitution({
        _id: institution._id,
        name: name
      })
      void Swal.fire({
        icon: 'success',
        title: 'Actualizada',
        text: 'La institución fue actualizada correctamente.',
        timer: 1500,
        showConfirmButton: false
      })
      onClose()
    } catch (error) {
      console.error('Error updating institution:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setName(value)
    validateName(value)
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Editar Institución</h2>

      <div className="space-y-2">
        <label htmlFor="edit-institution-name" className="block text-sm font-medium text-gray-700">
          Nombre de la institución <span className="text-red-500">*</span>
        </label>
        <Input
          id="edit-institution-name"
          name="name"
          type="text"
          value={name}
          onChange={handleChange}
          required
          placeholder="Nombre de la institución"
          error={!!error}
          className="w-full"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-800 text-gray-800"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting || !!error}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}

export default InstitutionEditForm
