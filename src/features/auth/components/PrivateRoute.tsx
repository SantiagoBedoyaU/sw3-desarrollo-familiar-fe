import { useState, useEffect, useRef, JSX } from 'react'
import { Navigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { getLocalStorageToken } from '../utils/verifyLocalToken'
import { getSignIn } from '../utils/getSignIn'

interface PrivateRouteProps {
  readonly element: JSX.Element
  readonly requiredRoles?: number[] // Array de roles permitidos
}

function PrivateRoute({ element, requiredRoles }: PrivateRouteProps) {
  let token = getLocalStorageToken()
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
      const hasPermission = signIn.userRole !== undefined && requiredRoles.includes(signIn.userRole)
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
    token = getLocalStorageToken()
    signIn = getSignIn()
    validateAccessToken()
    validatePermissions()
  }, [token, signIn, requiredRoles])

  if (redirect) return <Navigate to="/login" />
  return element
}

export default PrivateRoute
