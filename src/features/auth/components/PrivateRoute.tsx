import { useState, useEffect, useRef, JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { SignIn } from '../../users/entities/User'
import Swal from 'sweetalert2'

interface PrivateRouteProps {
  readonly element: JSX.Element
  readonly requiredRoles?: number[] // Array de roles permitidos
}

function PrivateRoute({ element, requiredRoles }: PrivateRouteProps) {
  const [redirect, setRedirect] = useState(false)
  const alertShown = useRef(false)

  // Verificamos el token y opcionalmente obtenemos el usuario
  const token = localStorage.getItem('token')
  const signInSring = localStorage.getItem('signIn')
  const signIn: SignIn | null = signInSring
    ? (JSON.parse(signInSring) as SignIn)
    : null

  useEffect(() => {
    // Verificamos si no hay token
    if (!token && !alertShown.current) {
      void Swal.fire({
        title: 'No estás autenticado',
        text: 'Por favor, inicia sesión para acceder a esta página.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      })
      alertShown.current = true
      setRedirect(true)
      return
    }

    // Verificamos si se requieren roles específicos
    if (requiredRoles && requiredRoles.length > 0 && signIn) {
      // Comprobamos si el rol del usuario está en el array de roles permitidos
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
  }, [token, signIn, requiredRoles])

  if (redirect) return <Navigate to="/login" />

  return element
}

export default PrivateRoute
