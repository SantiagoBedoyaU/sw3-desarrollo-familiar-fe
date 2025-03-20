import { CircleUserRound, LogIn, LogOut } from 'lucide-react'
import useAuthStore from '../../../stores/useAuthStore'
import Nav from './Navigation/Nav'
import { useState } from 'react'

function Header() {
    const { isAuthenticated, logout } = useAuthStore()
    const [open, setOpen] = useState(false)

    return (
        <section className='flex max-w-screen bg-green-200 justify-between items-center px-2 md:px-4 py-0.5'>
            <section className='flex items-center w-fit mr-4'>
                <h1 className='text-xl font-semibold '>
                    <a href='/'>Escuelas Familiares</a>
                </h1>
            </section>
            <Nav open={open} setOpen={setOpen}></Nav>
            {!isAuthenticated && (
                <a
                    href='/registrarse'
                    className='min-w-fit w-full max-w-60 md:hidden gap-2 flex items-center p-2 mr-12 border rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white '>
                    <CircleUserRound className='h-5 w-5'></CircleUserRound>
                    <span>Registrarse</span>
                </a>
            )}
            <section className='mr-8'>
                {isAuthenticated ? (
                    <section className='hidden md:flex items-center justify-end gap-2'>
                        <a
                            href='/perfil'
                            className='w-fit justify-start gap-3 flex items-center px-2 py-1 rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white'>
                            <CircleUserRound className='h-6 w-6'></CircleUserRound>
                            <span>Perfil</span>
                        </a>
                        <button
                            onClick={logout}
                            className='w-fit justify-start gap-3 flex items-center px-2 py-1 rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white'>
                            <LogOut className='h-5 w-5' />
                            Cerrar Sesión
                        </button>
                    </section>
                ) : (
                    <section className='hidden md:flex w-fit items-center justify-end gap-2'>
                        <a
                            href='/login'
                            className='w-fit justify-start gap-3 flex items-center px-2 py-1 rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white'>
                            <LogIn className='h-5 w-5'></LogIn>
                            <span>Iniciar Sesión</span>
                        </a>
                        <a
                            href='/registrarse'
                            className='w-fit justify-start gap-3 flex items-center px-2 py-1 rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white'>
                            <CircleUserRound className='h-5 w-5'></CircleUserRound>
                            <span>Registrarse</span>
                        </a>
                    </section>
                )}
            </section>
        </section>
    )
}

export default Header
