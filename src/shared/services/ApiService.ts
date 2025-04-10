import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import Swal from 'sweetalert2'
import Config from '../../app/config/Config'
import { ResponseEntity } from '../types/reactTypes/ResponseEntity'

// Constantes
const API_BASE_URL = Config.LOGIC_URL
const DEFAULT_CONFIG: AxiosRequestConfig = Config.defaultConfig

// Interfaces
interface ErrorResponse {
  message?: string
  [key: string]: unknown
}

/**
 * Clase base para servicios API con manejo de errores mejorado
 * @template T - Tipo de entidad que maneja el servicio
 */
export class ApiService<T> {
  private readonly endpoint: string
  private readonly entityName: string

  /**
   * Constructor del servicio API
   * @param endpoint - Ruta del endpoint sin la URL base
   * @param entityName - Nombre legible de la entidad (opcional, por defecto usa el endpoint)
   */
  constructor(endpoint: string, entityName?: string) {
    this.endpoint = endpoint
    this.entityName = entityName ?? this.formatEntityName(endpoint)
  }

  /**
   * Formatea el nombre de la entidad para mensajes al usuario
   */
  private formatEntityName(endpoint: string): string {
    if (endpoint) {
      const lastSegment = endpoint.split('/').pop()
      if (lastSegment) {
        return lastSegment
          .replace(/-/g, ' ')
          .replace(/^./, (str) => str.toUpperCase())
      }
    }
    return endpoint.replace(/-/g, ' ').replace(/^./, (str) => str.toUpperCase())
  }

  /**
   * Construye la URL completa para las peticiones
   * @param path - Ruta adicional (generalmente un ID)
   * @returns URL completa
   */
  protected getUrl(path = ''): string {
    return `${API_BASE_URL}${this.endpoint}${path ? '/' + path : ''}`
  }

  /**
   * Maneja y muestra errores con SweetAlert
   * @param error - Error capturado
   * @param context - Contexto de la operación para el mensaje
   */
  protected handleError(error: unknown, context: string): never {
    let title = 'Error'
    let message = `${context}: Error inesperado`

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError

      if (axiosError.response) {
        const status = axiosError.response.status
        const statusText = axiosError.response.statusText

        // Personalización de mensaje según el código de estado
        /* eslint-disable indent */
        switch (status) {
          case 400:
            title = 'Datos incorrectos'
            break
          case 401:
            title = 'No autorizado'
            break
          case 403:
            title = 'Acceso denegado'
            break
          case 404:
            title = 'No encontrado'
            break
          case 500:
            title = 'Error del servidor'
            break
          default:
            title = 'Error de comunicación'
        }
        /* eslint-enable indent */

        // Extraer mensaje del cuerpo de la respuesta si existe
        if (axiosError.response.data) {
          const errorData = axiosError.response.data as ErrorResponse
          if (typeof errorData.message === 'string') {
            message = errorData.message
          } else {
            message = `${context}: Error ${String(status)} - ${statusText}`
          }
        } else {
          message = `${context}: Error ${String(status)} - ${statusText}`
        }
      } else if (axiosError.request) {
        title = 'Sin conexión'
        message =
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      } else {
        message = axiosError.message
      }
    }

    // Mostrar alerta
    void Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#3085d6',
    })

    console.error(`[API Error] ${title}: ${message}`, error)
    throw new Error(message)
  }

  /**
   * Muestra mensaje de éxito
   * @param message - Mensaje a mostrar
   */
  protected showSuccess(message: string): void {
    void Swal.fire({
      icon: 'success',
      title: 'Operación exitosa',
      text: message,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  /**
   * Solicita confirmación al usuario para acciones destructivas
   * @param action - Descripción de la acción a confirmar
   * @returns Promesa con la respuesta del usuario
   */
  protected async confirmAction(action: string): Promise<boolean> {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `${action} ${this.entityName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    })

    return result.isConfirmed
  }

  /**
   * Procesa respuestas HTTP y maneja errores
   * @param promise - Promesa de la petición Axios
   * @param successMessage - Mensaje opcional para mostrar en caso de éxito
   * @returns Datos de la respuesta
   */
  protected async handleResponse<R>(
    promise: Promise<AxiosResponse<R>>,
    successMessage?: string,
  ): Promise<R> {
    const response = await promise
    if (successMessage) {
      this.showSuccess(successMessage)
    }
    return response.data
  }

  /**
   * Obtiene todos los registros
   * @returns Lista paginada de entidades
   */
  async getAll(): Promise<ResponseEntity<T>> {
    try {
      return await this.handleResponse<ResponseEntity<T>>(
        axios.get(this.getUrl(), DEFAULT_CONFIG),
      )
    } catch (error) {
      return this.handleError(error, `Error al obtener ${this.entityName}`)
    }
  }

  /**
   * Obtiene un registro por su ID
   * @param id - Identificador del registro
   * @returns Entidad solicitada
   */
  async getById(id: string): Promise<T> {
    try {
      return await this.handleResponse<T>(
        axios.get(this.getUrl(id), DEFAULT_CONFIG),
      )
    } catch (error) {
      return this.handleError(
        error,
        `Error al obtener ${this.entityName} #${id}`,
      )
    }
  }

  /**
   * Crea un nuevo registro
   * @param data - Datos para crear la entidad
   * @returns Entidad creada
   */
  // async create(data: Omit<T, '_id'>): Promise<T> {
  //   try {
  //     return await this.handleResponse<T>(
  //       axios.post(this.getUrl(), data, DEFAULT_CONFIG),
  //       `${this.entityName} creado correctamente`,
  //     )
  //   } catch (error) {
  //     return this.handleError(error, `Error al crear ${this.entityName}`)
  //   }
  // }

  /**
   * Actualiza un registro existente
   * @param id - Identificador del registro
   * @param data - Datos parciales para actualizar
   * @returns Entidad actualizada
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      return await this.handleResponse<T>(
        axios.put(this.getUrl(id), data, DEFAULT_CONFIG),
        `${this.entityName} actualizado correctamente`,
      )
    } catch (error) {
      return this.handleError(
        error,
        `Error al actualizar ${this.entityName} #${id}`,
      )
    }
  }

  /**
   * Elimina un registro
   * @param id - Identificador del registro
   * @returns Void
   */
  async delete(id: string): Promise<void> {
    try {
      // const confirmed = await this.confirmAction(`¿Deseas eliminar este`)
      // if (!confirmed) {
      //   return
      // }
      await this.handleResponse(
        axios.delete(this.getUrl(id), DEFAULT_CONFIG),
        `${this.entityName} eliminado correctamente`,
      )
    } catch (error) {
      this.handleError(error, `Error al eliminar ${this.entityName} #${id}`)
    }
  }
}
