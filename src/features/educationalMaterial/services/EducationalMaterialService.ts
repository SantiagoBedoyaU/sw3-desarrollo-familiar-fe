import axios from 'axios'
import EducationalMaterial, {
  EducationalMaterialCreate,
  EducationalMaterialUpdate,
} from '../entities/EducationalMaterial'
import { ApiService } from '../../../shared/services/ApiService'
import Config from '../../../app/config/Config'
import { ResponseEntity } from '../../../shared/types/reactTypes/ResponseEntity'
import FormData from 'form-data'
import Swal from 'sweetalert2'

export class EducationalMaterialService extends ApiService<EducationalMaterial> {
  constructor() {
    super('educational-material')
  }

  async getFilters(
    queryString: string,
  ): Promise<ResponseEntity<EducationalMaterial>> {
    try {
      const response = await axios.get<ResponseEntity<EducationalMaterial>>(
        this.getUrl(`?${queryString}`),
        Config.defaultConfig,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Error getting filtered materials')
      throw error
    }
  }

  async create(data: EducationalMaterialCreate): Promise<EducationalMaterial> {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('type', data.type)

    if (data.description) {
      formData.append('description', data.description)
    }

    if (data.minAge !== undefined) {
      formData.append('minAge', data.minAge.toString())
    }

    if (data.maxAge !== undefined) {
      formData.append('maxAge', data.maxAge.toString())
    }

    if (data.type === 'resource' && data.url) {
      formData.append('url', data.url)
    } else if (data.file) {
      const cleanName = data.file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita acentos
      const safeFileName = cleanName.replace(/[^a-zA-Z0-9-.]/g, '-')
      const renamedFile = new File([data.file], safeFileName, {
        type: data.file.type,
      })
      formData.append('file', renamedFile)
    }

    const url = this.getUrl()

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
      body: formData,
    }

    try {
      const response = await fetch(url, {
        ...options,
        body: formData as unknown as BodyInit,
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string }
        throw new Error(
          errorData.message ?? `HTTP error! status: ${String(response.status)}`,
        )
      }

      const material = (await response.json()) as EducationalMaterial
      return material
    } catch (err: unknown) {
      console.error('Error:', err)
      Swal.fire({
        title: 'Error',
        text:
          'Ocurrió un error al subir el material educativo. ' +
          (err instanceof Error
            ? err.message
            : 'Inténtalo de nuevo más tarde.'),
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4B5563',
      })
      throw err
    }
  }

  async downloadMaterial(material: EducationalMaterial): Promise<void> {
    try {
      // Si es un recurso web, abrimos la URL en una nueva pestaña
      if (material.type === 'resource') {
        window.open(material.url, '_blank')
        return
      }

      // Para otros tipos, descargamos el archivo
      const response = await axios.get(material.url, {
        ...Config.defaultConfig,
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url

      // Determinar la extensión basada en el tipo MIME o usar una genérica
      let extension = 'file'
      const contentType = response.headers['content-type'] as string | undefined

      if (contentType) {
        if (typeof contentType === 'string' && contentType.includes('pdf')) extension = 'pdf'
        else if (typeof contentType === 'string' && contentType.includes('document')) extension = 'docx'
        else if (typeof contentType === 'string' && contentType.includes('image')) extension = 'jpg'
        else if (typeof contentType === 'string' && contentType.includes('zip')) extension = 'zip'
      }

      link.setAttribute(
        'download',
        `${material.title.replace(/[^a-zA-Z0-9-.]/g, '-')}.${extension}`,
      )

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      this.handleError(error, 'Error downloading material')
    }
  }

  async update(
    id: string,
    data: EducationalMaterialUpdate,
  ): Promise<EducationalMaterial> {
    try {
      const response = await axios.put(this.getUrl(`/${id}`), data, {
        ...Config.defaultConfig,
        headers: {
          ...Config.defaultConfig.headers,
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error updating educational material:', error)
      throw error
    }
  }
}

export const educationalMaterialService = new EducationalMaterialService()
