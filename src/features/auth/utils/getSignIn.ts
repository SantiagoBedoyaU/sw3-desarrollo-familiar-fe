import { SignIn } from '../entities/SingIn'

export const getSignIn = () => {
  const signInString = localStorage.getItem('signIn')
  const signIn: SignIn | null = signInString
    ? (JSON.parse(signInString) as SignIn)
    : null
  return signIn
}
