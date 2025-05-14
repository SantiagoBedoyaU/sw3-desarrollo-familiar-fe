import { useState } from 'react'
import EducationalMaterial, { EducationalMaterialType, EducationalMaterialUpdate } from '../entities/EducationalMaterial'
import { useEducationalMaterialStore } from '../stores/EducationalMaterialStore'

interface MaterialEditProps {
  material: EducationalMaterial
  onClose: () => void
  setUpdatedMaterials?: React.Dispatch<React.SetStateAction<EducationalMaterial[]>>
}

const MaterialEdit = ({ material, onClose, setUpdatedMaterials }: MaterialEditProps) => {
  const { editMaterial } = useEducationalMaterialStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EducationalMaterialUpdate>({
    _id: material._id,
    title: material.title,
    description: material.description || '',
    minAge: material.minAge?.toString(),
    maxAge: material.maxAge?.toString(),
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Maneja cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    // Validación de tamaño para descripción
    if (name === 'description' && value.length > 120) {
      return // No actualizar si excede el límite
    }

    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar errores al cambiar el valor
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validación de título (requerido)
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    }

    // Validación de rango de edad (opcional, pero debe ser válido si se proporciona)
    if (
      formData.minAge !== undefined &&
      formData.maxAge !== undefined &&
      parseInt(formData.minAge) > 0 &&
      parseInt(formData.maxAge) > 0
    ) {
      if (parseInt(formData.minAge) < 4 || parseInt(formData.minAge) > 12) {
        newErrors.minAge = 'La edad mínima debe estar entre 4 y 12 años'
      }
      if (parseInt(formData.maxAge) < 4 || parseInt(formData.maxAge) > 12) {
        newErrors.maxAge = 'La edad máxima debe estar entre 4 y 12 años'
      }
      if (parseInt(formData.minAge) > parseInt(formData.maxAge)) {
        newErrors.ageRange = 'La edad mínima no puede ser mayor que la edad máxima'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    try {
      setIsSubmitting(true)

      // Asegurarse de que minAge y maxAge sean strings o undefined
      const materialData: EducationalMaterialUpdate = {
        ...formData,
        minAge: formData.minAge !== undefined ? String(formData.minAge) : undefined,
        maxAge: formData.maxAge !== undefined ? String(formData.maxAge) : undefined,
      }
      const updatedMaterial = await editMaterial(material._id, materialData)

      // Actualizar la lista local si se proporciona la función setUpdatedMaterials
      if (updatedMaterial && setUpdatedMaterials) {
        setUpdatedMaterials((prevMaterials) =>
          prevMaterials.map((m) =>
            m._id === updatedMaterial._id ? updatedMaterial : m
          )
        )
      }
      onClose()
    } catch (error) {
      console.error('Error updating material:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMaterialTypeLabel = (type: EducationalMaterialType): string => {
    switch (type) {
      case EducationalMaterialType.Document:
        return 'Documento'
      case EducationalMaterialType.Image:
        return 'Imagen'
      case EducationalMaterialType.Resource:
        return 'Recurso Web'
      case EducationalMaterialType.Other:
        return 'Otro'
      default:
        return 'Desconocido'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Información del archivo (no editable) */}
      <div className="bg-gray-100 p-3 rounded-md">
        <p className="text-sm font-medium text-gray-700">
          Tipo de material: <span className="font-normal">
            {getMaterialTypeLabel(material.type)}
          </span>
        </p>
        {material.type === EducationalMaterialType.Resource ? (
          <p className="text-sm font-medium text-gray-700 mt-1">
            URL: <span className="font-normal">{material.fileAddress}</span>
          </p>
        ) : (
          <p className="text-sm font-medium text-gray-700 mt-1">
            Archivo: <span className="font-normal">{material.fileAddress.split('/').pop()}</span>
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2">El tipo de material y el archivo no se pueden modificar</p>
      </div>

      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Nombre del material educativo"
          required
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-gray-500">(opcional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Breve descripción del material (máximo 120 caracteres)"
          maxLength={120}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.description?.length || 0}/120 caracteres
        </p>
      </div>

      {/* Rango de edad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-1">
            Edad Mínima <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            type="number"
            id="minAge"
            name="minAge"
            value={formData.minAge === undefined ? '' : formData.minAge}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : e.target.value
              setFormData({
                ...formData,
                minAge: value,
              })
              // Limpiar errores
              if (errors.minAge || errors.ageRange) {
                const { minAge, ageRange, ...rest } = errors
                setErrors(rest)
              }
            }}
            min={4}
            max={12}
            className={`w-full px-3 py-2 border ${errors.minAge ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="4"
          />
          {errors.minAge && <p className="mt-1 text-sm text-red-500">{errors.minAge}</p>}
        </div>
        <div>
          <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700 mb-1">
            Edad Máxima <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            type="number"
            id="maxAge"
            name="maxAge"
            value={formData.maxAge === undefined ? '' : formData.maxAge}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : e.target.value
              setFormData({
                ...formData,
                maxAge: value,
              })
              // Limpiar errores
              if (errors.maxAge || errors.ageRange) {
                const { maxAge, ageRange, ...rest } = errors
                setErrors(rest)
              }
            }}
            min={4}
            max={12}
            className={`w-full px-3 py-2 border ${errors.maxAge ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="12"
          />
          {errors.maxAge && <p className="mt-1 text-sm text-red-500">{errors.maxAge}</p>}
        </div>
      </div>
      {errors.ageRange && <p className="mt-1 text-sm text-red-500">{errors.ageRange}</p>}

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}

export default MaterialEdit
