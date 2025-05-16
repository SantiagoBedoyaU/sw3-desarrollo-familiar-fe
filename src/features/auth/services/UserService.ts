import axios from 'axios'
import { ApiService } from '../../../shared/services/ApiService'
import Config from '../../../app/config/Config'
import User, { Login, UserCreate } from '../../users/entities/User'
import { SignIn } from '../entities/SingIn'
// import FormData from 'form-data'
// import Swal from 'sweetalert2'

export class UserService extends ApiService<User> {
  constructor() {
    super('users')
  }

  async signIn(signInData: Login): Promise<SignIn> {
    const response = await axios.post<SignIn>(
      `${Config.LOGIC_URL}auth/sign-in`,
      signInData,
      Config.defaultConfig,
    )
    return response.data
  }

  async create(user: UserCreate): Promise<User> {
    const headers = {
      ...Config.defaultConfig.headers,
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    }

    const response = await axios.post<User>(this.getUrl(), user, {
      headers,
    })
    return response.data
  }

  async update(id: string, user: User): Promise<User> {
    const headers = {
      ...Config.defaultConfig.headers,
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    }
    console.log('====================================')
    console.log('headers', headers)
    console.log('====================================')

    const response = await axios.patch<User>(`${this.getUrl()}/${id}`, user, {
      headers,
    })
    return response.data
  }
}
export const userService = new UserService()
