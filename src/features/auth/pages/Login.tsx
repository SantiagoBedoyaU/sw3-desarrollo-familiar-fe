import { useState } from 'react'
// import bcrypt from "bcryptjs"
import { userService } from '../../../shared/services/UserService'
import { SignIn } from '../../../shared/types/entities/User'
import Swal from 'sweetalert2'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Aquí puedes agregar lógica de autenticación si es necesario
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(formData.password, salt);
    const credentials = {
      email: formData.email,
      // password: hashedPassword,
      password: formData.password,
    }
    console.log(credentials)
    await userService.signIn(credentials).then((data: SignIn) => {
      console.log('====================================')
      console.log(data)
      console.log('====================================')
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('token', data.accessToken)
      window.location.href = '/'
    }).catch(() => {
      Swal.fire({
        title: 'Error de autenticación',
        text: 'Credenciales incorrectas.',
        icon: 'warning',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      })
    })
  }

  return (


    <section className="bg-gray-50 dark:bg-gray-900 h-screen">
      <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <section className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <section className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Inicia Sesión en tu cuenta
            </h1>
            <form className="space-y-4 md:space-y-6"
              onSubmit={(e) => void handleSubmit(e)}
              action="#">
              <section>
                <label htmlFor="email" className="inline-flex gap-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <svg className='w-5 h-5 fill-current text-gray-400'>
                    <use xlinkHref='#icon-user' />
                  </svg>
                  <span>Tu email</span>
                </label>
                <input
                  autoComplete='email'
                  value={formData.email}
                  onChange={handleChangeForm}
                  type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="correo@electronico.com" required />
              </section>
              <section>
                <label htmlFor="password" className="inline-flex gap-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <svg className='w-5 h-5 fill-current text-gray-400'>
                    <use xlinkHref='#icon-lock' />
                  </svg>
                  <span>Contraseña</span>
                </label>
                <input
                  autoComplete="current-password"
                  minLength={8}
                  pattern="[a-zA-Z0-9!@#$%^&*]{8,20}"
                  title="La contraseña debe tener entre 8 y 20 caracteres y puede incluir letras, números y símbolos especiales."
                  value={formData.password}
                  onChange={handleChangeForm}
                  type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </section>
              {/* <section className="flex items-center justify-between">
                  <section className="flex items-start">
                    <section className="flex items-center h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                    </section>
                    <section className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </section>
                  </section>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">¿Olvidaste tu contraseña?</a>
                </section> */}
              <button type="submit" className="w-full  bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center p-4 bg-gray-800 dark:bg-blue-600 hover:bg-gray-700 dark:hover:bg-blue-500 text-white  uppercase  cursor-pointer transition dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                <p>
                  Ingresar
                </p>
              </button>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ¿Eres nuevo?{' '}
                <a href='/registrarse' className='text-blue-600 underline'>
                  <span >Regístrate</span>
                  <svg className='w-4 h-4 inline-block ml-1 fill-current text-blue-600'>
                    <use xlinkHref='#icon-arrow-right' />
                  </svg>
                  <svg xmlns='http://www.w3.org/2000/svg' className='hidden'>
                    <symbol id='icon-arrow-right' viewBox='0 0 1792 1792'>
                      <path d='M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z' />
                    </symbol>
                    <symbol id='icon-lock' viewBox='0 0 1792 1792'>
                      <path d='M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z' />
                    </symbol>
                    <symbol id='icon-user' viewBox='0 0 1792 1792'>
                      <path d='M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z' />
                    </symbol>
                  </svg>
                </a>

              </p>
            </form>
          </section>
        </section>
      </section>
    </section>
  )

}

export default Login
