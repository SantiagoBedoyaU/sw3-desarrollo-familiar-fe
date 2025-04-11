import axios from 'axios'
import { ApiService } from './ApiService'
import Config from '../../app/config/Config'
import User, { Login, SignIn } from '../types/entities/User'
// import FormData from 'form-data'
// import Swal from 'sweetalert2'

export class UserService extends ApiService<User> {
  constructor() {
    super('research-articles')
  }

  async signIn(signInData: Login): Promise<SignIn> {
    try {
      const response = await axios.post<SignIn>(
        `${Config.LOGIC_URL}auth/sign-in`,
        signInData,
        Config.defaultConfig,
      )
      return response.data
    } catch (error) {
      this.handleError(error, 'Error getting filters')
    }
  }
}
export const userService = new UserService()
