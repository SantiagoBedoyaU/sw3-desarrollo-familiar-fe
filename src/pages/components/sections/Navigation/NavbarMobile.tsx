import { X, LogOut, CircleUserRound, LogIn } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import navItems from '../../../../constants/NavItems'
import useAuthStore from '../../../../stores/useAuthStore'

interface NavbarMobileProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({ open, setOpen }) => {
    const location = useLocation().pathname
    const { isAuthenticated, logout } = useAuthStore()

    return (
        <section className='flex-1'>
            {open && (
                <section className='fixed inset-0 z-50 flex'>
                    <section className='w-64 bg-green-200 shadow-lg h-full flex flex-col'>
                        <section className='flex items-center justify-between h-16 px-4 border-b'>
                            <h1 className='text-lg font-semibold'>
                                <a href='/'>Escuelas Familiares</a>
                            </h1>
                            <button
                                onClick={() => setOpen(false)}
                                className='px-2 bg-transparent'>
                                <X className='h-5 w-5' />
                            </button>
                        </section>
                        <nav className='flex-1 space-y-1 px-4 py-2  overflow-y-auto bg-green-50'>
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setOpen(false)}>
                                    <p
                                        className={
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-emerald-900' +
                                            (location === item.href
                                                ? 'bg-green-300 text-green-900 font-semibold'
                                                : '')
                                        }>
                                        {item.icon}
                                        {item.title}
                                    </p>
                                </NavLink>
                            ))}
                        </nav>
                        <section className='flex flex-col'>
                            {isAuthenticated ? (
                                <section className='p-4 border-t space-y-2'>
                                    <a
                                        href='/perfil'
                                        className='w-full justify-start gap-2 flex items-center p-2 rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white'>
                                        <CircleUserRound className='h-5 w-5'></CircleUserRound>
                                        <span>Perfil</span>
                                    </a>
                                    <button
                                        onClick={() => {
                                            setOpen(false)
                                            logout()
                                        }}
                                        className='w-full gap-2 flex items-center p-2 border rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white'>
                                        <LogOut className='h-5 w-5' />
                                        Cerrar Sesión
                                    </button>
                                </section>
                            ) : (
                                <section className='p-4 border-t space-y-2'>
                                    <a
                                        href='/login'
                                        className='w-full gap-2 flex items-center p-2 border rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white'>
                                        <LogIn className='h-5 w-5'></LogIn>
                                        <span>Iniciar Sesión</span>
                                    </a>
                                    <a
                                        href='/registrarse'
                                        className='w-full gap-2 flex items-center p-2 border rounded-lg hover:bg-green-600 hover:border-green-800 hover:text-white'>
                                        <CircleUserRound className='h-5 w-5'></CircleUserRound>
                                        <span>Registrarse</span>
                                    </a>
                                </section>
                            )}
                        </section>
                    </section>

                    <button
                        // backdrop-filter backdrop-blur-xl
                        className='flex-1 bg-black opacity-50 '
                        onClick={() => setOpen(false)}
                    />
                </section>
            )}
        </section>
    )
}

export default NavbarMobile
