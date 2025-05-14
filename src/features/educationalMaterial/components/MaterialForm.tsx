import { useState } from 'react'
import { EducationalMaterialCreate, EducationalMaterialType, materialTypes } from '../entities/EducationalMaterial'
import { useEducationalMaterialStore } from '../stores/EducationalMaterialStore'

interface MaterialFormProps {
  onClose: () => void
}

const MaterialForm = ({ onClose }: MaterialFormProps) => {
  const { addMaterial } = useEducationalMaterialStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EducationalMaterialCreate>({
    title: '',
    type: EducationalMaterialType.Document,
    description: '',
    minAge: undefined,
    maxAge: undefined,
    file: undefined,
    fileAddress: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fileSize, setFileSize] = useState<number | null>(null)

  // Maneja cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  // Manejo de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const fileSizeMB = file.size / (1024 * 1024)
      setFileSize(fileSizeMB)

      // Validar tamaño máximo (20 MB)
      if (fileSizeMB > 20) {
        setErrors({
          ...errors,
          file: 'El archivo excede el tamaño máximo permitido (20 MB)',
        })
        e.target.value = '' // Limpiar el input
        return
      }

      // Validar tipo de archivo según el tipo seleccionado
      if (formData.type === EducationalMaterialType.Document) {
        const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!validDocTypes.includes(file.type)) {
          setErrors({
            ...errors,
            file: 'Solo se permiten archivos PDF o Word',
          })
          e.target.value = ''
          return
        }
      } else if (formData.type === EducationalMaterialType.Image) {
        if (!file.type.startsWith('image/')) {
          setErrors({
            ...errors,
            file: 'Solo se permiten archivos de imagen',
          })
          e.target.value = ''
          return
        }
      } else if (formData.type === EducationalMaterialType.Other) {
        // Para 'other', permitimos archivos comprimidos y otros
        const validOtherTypes = ['application/zip', 'application/x-zip-compressed']
        if (!validOtherTypes.includes(file.type)) {
          setErrors({
            ...errors,
            file: 'Solo se permiten archivos comprimidos (.zip)',
          })
          e.target.value = ''
          return
        }
      }

      setFormData({
        ...formData,
        file: file,
      })

      // Limpiar error de archivo
      if (errors.file) {
        setErrors({
          ...errors,
          file: '',
        })
      }
    }
  }

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validación de título (requerido)
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    }

    // Validación de URL o archivo
    if (formData.type === EducationalMaterialType.Resource) {
      if (!formData.fileAddress) {
        newErrors.url = 'La URL es obligatoria para recursos web'
      } else if (!/^https?:\/\/.+/.test(formData.fileAddress)) {
        newErrors.url = 'Ingresa una URL válida (debe comenzar con http:// o https://)'
      }
    } else if (!formData.file) {
      newErrors.file = 'El archivo es obligatorio'
    }

    // Validación de rango de edad (opcional, pero debe ser válido si se proporciona)
    if (formData.minAge !== undefined && formData.maxAge !== undefined) {
      if (formData.minAge < 4 || formData.minAge > 12) {
        newErrors.minAge = 'La edad mínima debe estar entre 4 y 12 años'
      }
      if (formData.maxAge < 4 || formData.maxAge > 12) {
        newErrors.maxAge = 'La edad máxima debe estar entre 4 y 12 años'
      }
      if (formData.minAge > formData.maxAge) {
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

      // Convertir edades a números si están definidas
      const materialData: EducationalMaterialCreate = {
        ...formData,
        minAge: formData.minAge !== undefined ? Number(formData.minAge) : undefined,
        maxAge: formData.maxAge !== undefined ? Number(formData.maxAge) : undefined,
      }

      await addMaterial(materialData)
      onClose()
    } catch (error) {
      console.error('Error uploading material:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
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

      {/* Tipo de material */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Material <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required
        >
          {materialTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
      </div>

      {/* Archivo o URL (según el tipo) */}
      {formData.type === EducationalMaterialType.Resource ? (
        <div>
          <label htmlFor="fileAddress" className="block text-sm font-medium text-gray-700 mb-1">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="fileAddress"
            name="fileAddress"
            value={formData.fileAddress ?? ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.fileAddress ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="https://ejemplo.com/recurso"
            required
          />
          {errors.fileAddress && <p className="mt-1 text-sm text-red-500">{errors.fileAddress}</p>}
        </div>
      ) : (
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Archivo <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            className={`w-full px-3 py-2 border ${errors.file ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {fileSize && (
            <p className="mt-1 text-sm text-gray-500">
              Tamaño: {fileSize.toFixed(2)} MB {fileSize > 20 && <span className="text-red-500">(Excede el límite de 20 MB)</span>}
            </p>
          )}
          {errors.file && <p className="mt-1 text-sm text-red-500">{errors.file}</p>}
          <p className="mt-1 text-xs text-gray-500">Tamaño máximo: 20 MB</p>
        </div>
      )}

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
          {formData.description?.length ?? 0}/120 caracteres
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
            value={formData.minAge ?? ''}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : parseInt(e.target.value)
              setFormData({
                ...formData,
                minAge: value,
              })
              // Limpiar errores
              if (errors.minAge || errors.ageRange) {
                setErrors({
                  ...errors,
                  minAge: '',
                  ageRange: '',
                })
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
            value={formData.maxAge ?? ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : undefined
              setFormData({
                ...formData,
                maxAge: value,
              })

              // Limpiar errores
              if (errors.maxAge || errors.ageRange) {
                setErrors({
                  ...errors,
                  maxAge: '',
                  ageRange: '',
                })
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
          {isSubmitting ? 'Subiendo...' : 'Subir Material'}
        </button>
      </div>
    </form>
  )
}

export default MaterialForm
