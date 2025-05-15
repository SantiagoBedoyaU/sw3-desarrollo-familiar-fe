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

  async updateInstitution(data: Institution): Promise<Institution> {
    return this.handleResponse(
      axios.patch(
        this.getUrl(data._id),
        { name: data.name },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
          },
        },
      ),
      'Institución actualizada correctamente',
    )
  }
}

export const institutionService = new InstitutionService()
