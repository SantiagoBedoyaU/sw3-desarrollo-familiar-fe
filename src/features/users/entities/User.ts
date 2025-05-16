export default interface User {
  _id: string
  name: string
  email: string
  password: string
  role: number
  status?: number
  __v: number
}

export interface UserCreate {
  name: string
  email: string
  // password: string
  role: number
}

export interface Login {
  email: string
  password: string
}
