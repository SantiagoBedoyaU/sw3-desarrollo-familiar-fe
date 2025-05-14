import { useState, useEffect, useRef, JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { SignIn } from '../../users/entities/User'
import Swal from 'sweetalert2'

interface PrivateRouteProps {
  readonly element: JSX.Element
  readonly requiredRoles?: number[] // Array de roles permitidos
}

const verifyToken = () => {
  return localStorage.getItem('token')
}

const getSignIn = () => {
  let signInString = localStorage.getItem('signIn')
  let signIn: SignIn | null = signInString
    ? (JSON.parse(signInString) as SignIn)
    : null
  return signIn
}

function PrivateRoute({ element, requiredRoles }: PrivateRouteProps) {
  let token = verifyToken()
  let signIn = getSignIn()
  const [redirect, setRedirect] = useState(false)
  const alertShown = useRef(false)

  const validateAccessToken = () => {
    if (!token && !alertShown.current) {
      void Swal.fire({
        title: 'No estás autenticado',
        text: 'Por favor, inicia sesión para acceder a esta página.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      })
      alertShown.current = true
      setRedirect(true)
    }
  }

  const validatePermissions = () => {
    if (requiredRoles && requiredRoles.length > 0 && signIn) {
      const hasPermission = requiredRoles.includes(signIn.userRole)
      if (!hasPermission) {
        void Swal.fire({
          title: 'Acceso denegado',
          text: 'No tienes permisos suficientes para acceder a esta página.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
        alertShown.current = true
        setRedirect(true)
      }
    }
  }

  useEffect(() => {
    token = verifyToken()
    signIn = getSignIn()
    validateAccessToken()
    validatePermissions()
  }, [token, signIn, requiredRoles])

  if (redirect) return <Navigate to="/login" />
  return element
}

export default PrivateRoute
