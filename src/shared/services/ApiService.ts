import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import Config from '../../app/config/Config'

// Base URL para todas las peticiones
const API_BASE_URL = Config.LOGIC_URL

// Configuración por defecto para todas las peticiones
const defaultConfig: AxiosRequestConfig = Config.defaultConfig

// Clase base para servicios API
export class ApiService<T> {
  private readonly endpoint // Eliminada la anotación redundante `: string`

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  // Método para obtener la URL completa
  protected getUrl(path: string = ''): string {
    return `${API_BASE_URL}${this.endpoint}${path ? '/' + path : ''}`
  }

  // Método genérico para manejar errores con mensajes contextualizados
  protected handleError(error: unknown, errorMessage: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError

      if (axiosError.response) {
        const status = axiosError.response.status.toString() // Convertir a cadena
        const statusText = axiosError.response.statusText

        // Intentar extraer mensaje de error del cuerpo de la respuesta
        if (
          axiosError.response.data &&
          typeof axiosError.response.data === 'object'
        ) {
          const errorData = axiosError.response.data as Record<string, unknown>
          if (typeof errorData.message === 'string') {
            console.error(`${errorMessage}: ${errorData.message}`)
            throw new Error(`${errorMessage}: ${errorData.message}`)
          }
        }

        console.error(`${errorMessage}: ${status} ${statusText}`)
        throw new Error(`${errorMessage}: Error HTTP ${status} ${statusText}`)
      } else if (axiosError.request) {
        console.error(`${errorMessage}: No se recibió respuesta del servidor`)
        throw new Error(`${errorMessage}: No se recibió respuesta del servidor`)
      } else {
        console.error(`${errorMessage}: ${axiosError.message}`)
        throw new Error(`${errorMessage}: ${axiosError.message}`)
      }
    }

    // Para errores que no son de Axios
    console.error(errorMessage, error)
    throw new Error(`${errorMessage}: Error inesperado`)
  }

  // Método genérico para procesar respuestas
  protected async handleResponse<R>(
    promise: Promise<AxiosResponse<R>>,
  ): Promise<R> {
    try {
      const response = await promise
      return response.data
    } catch (error) {
      console.error('Error processing response:', error)
      throw error
    }
  }

  // Métodos CRUD genéricos
  async getAll(): Promise<T[]> {
    try {
      return await this.handleResponse<T[]>(
        axios.get(this.getUrl(), defaultConfig),
      )
    } catch (error) {
      this.handleError(error, `Error getting all ${this.endpoint}`)
    }
  }

  async getById(id: string): Promise<T> {
    try {
      return await this.handleResponse<T>(
        axios.get(this.getUrl(id), defaultConfig),
      )
    } catch (error) {
      this.handleError(error, `Error getting ${this.endpoint} with id ${id}`)
    }
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    try {
      return await this.handleResponse<T>(
        axios.post(this.getUrl(), data, defaultConfig),
      )
    } catch (error) {
      this.handleError(error, `Error creating ${this.endpoint}`)
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      return await this.handleResponse<T>(
        axios.put(this.getUrl(id), data, defaultConfig),
      )
    } catch (error) {
      this.handleError(error, `Error updating ${this.endpoint} with id ${id}`)
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.handleResponse(axios.delete(this.getUrl(id), defaultConfig)) // Eliminado el uso incorrecto de `void`
    } catch (error) {
      this.handleError(error, `Error deleting ${this.endpoint} with id ${id}`)
    }
  }
}
