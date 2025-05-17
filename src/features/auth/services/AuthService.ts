import axios from 'axios'
import Config from '../../../app/config/Config'
// import FormData from 'form-data'
// import Swal from 'sweetalert2'

export class AuthService {
  async sendPasswordRecoveryEmail(email: string): Promise<void> {
    const headers = {
      ...Config.defaultConfig.headers,
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    }

    await axios.post(
      `${Config.LOGIC_URL}auth/recovery-password`,
      { email },
      { headers },
    )
  }

  async resetPassword(data: {
    code: string
    newPassword: string
  }): Promise<void> {
    const headers = {
      ...Config.defaultConfig.headers,
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    }

    await axios.post(`${Config.LOGIC_URL}auth/reset-password`, data, {
      headers,
    })
  }
}
export const authService = new AuthService()
