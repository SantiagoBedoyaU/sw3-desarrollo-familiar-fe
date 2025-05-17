import { useState } from 'react'
import { userService } from '../services/UserService'
import Swal from 'sweetalert2'
import useAuthStore from '../../../app/stores/useAuthStore'
import { SignIn } from '../entities/SingIn'

function Login() {
  const { checkAuth } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    const credentials = {
      email: formData.email,
      password: formData.password,
    }

    if (!credentials.email || !credentials.password) {
      void Swal.fire({
        title: 'Error de autenticación',
        text: 'Por favor completa todos los campos.',
        icon: 'warning',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      })
      setIsSubmitting(false)
      return
    }

    await userService
      .signIn(credentials)
      .then((data: SignIn) => {
        localStorage.setItem('signIn', JSON.stringify(data))
        if (data.accessToken) localStorage.setItem('token', data.accessToken)
        checkAuth()
        window.location.href = '/'
      })
      .catch(() => {
        void Swal.fire({
          title: 'Error de autenticación',
          text: 'Credenciales incorrectas.',
          icon: 'warning',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        })
      })

    setIsSubmitting(false)
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
      <section className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-[#dfe3e8]">
        <h1 className="text-2xl font-bold text-[#333] mb-6 text-center">
          Inicia sesión en tu cuenta
        </h1>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[#333]">
              Correo electrónico
            </label>
            <input
              autoComplete="email"
              value={formData.email}
              onChange={handleChangeForm}
              type="email"
              name="email"
              id="email"
              placeholder="correo@electronico.com"
              className="mt-1 w-full px-4 py-2 border rounded-md border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#5395c1]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#333]"
            >
              Contraseña
            </label>
            <input
              autoComplete="current-password"
              minLength={8}
              value={formData.password}
              onChange={handleChangeForm}
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border rounded-md border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#5395c1]"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <a
              href="/recuperar-contraseña"
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-medium rounded-lg py-2.5 hover:bg-gray-700 uppercase transition"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 4V1L8 5l4 4V4zm0 16v3l4-4-4-4v3zm8-8h3l-4-4-4 4h3v2h2v-2zm-16 0H1l4 4 4-4H4v2H2v-2z" />
              </svg>
            ) : (
              'Ingresar'
            )}
          </button>

          <div className="text-sm text-center mt-4">
            <a
              href="/restablecer-contraseña"
              className="text-blue-600 underline"
            >
              Restablece tu contraseña con el código enviado a tu correo
            </a>
          </div>

          <p className="text-sm font-normal text-gray-500 text-center mt-2">
            ¿Eres nuevo?{' '}
            <a href="/registrarse" className="text-blue-600 underline">
              Regístrate
            </a>
          </p>
        </form>
      </section>
    </section>
  )
}

export default Login
