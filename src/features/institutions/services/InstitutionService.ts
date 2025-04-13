import axios from 'axios'
import { ApiService } from '../../../shared/services/ApiService'
import Institution, { InstitutionCreate } from '../entities/Institution'

export class InstitutionService extends ApiService<Institution> {
  constructor() {
    super('educational-institutions')
  }

  // Crear institución educativa con token
  async createInstitution(data: InstitutionCreate): Promise<Institution> {
    return this.handleResponse(
      axios.post(this.getUrl(), data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
      }),
      'Institución creada exitosamente',
    )
  }

  // (Opcional) puedes sobreescribir delete si deseas personalizarlo
  // pero el heredado de ApiService ya incluye el token correctamente
}

export const institutionService = new InstitutionService()
