import { CircleUserRound, LogIn, LogOut, Menu } from 'lucide-react'
import useAuthStore from '../../../app/stores/useAuthStore'
import NavigationWrapper from '../../../features/navigation/components/NavigationWrapper'
import { useState } from 'react'

function Header() {
  const { isAuthenticated, logout } = useAuthStore()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-[#5395c1] text-white shadow-md w-full">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src="/icon.jpg" alt="logo" className="h-10 w-10 rounded-full" />
          <span className="text-lg font-semibold hidden md:inline">
            Escuelas Familiares
          </span>
        </a>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationWrapper />
        </div>

        {/* Auth options */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <a
                href="/perfil"
                className="flex items-center gap-1 hover:underline"
              >
                <CircleUserRound className="h-6 w-6" />
                Perfil
              </a>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 hover:underline"
              >
                <LogOut className="h-5 w-5" />
                Salir
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="flex items-center gap-1 hover:underline"
              >
                <LogIn className="h-5 w-5" />
                Iniciar Sesión
              </a>
              <a
                href="/registrarse"
                className="flex items-center gap-1 hover:underline"
              >
                <CircleUserRound className="h-5 w-5" />
                Registrarse
              </a>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu (Nav + Auth) */}
      {open && <NavigationWrapper open={open} setOpen={setOpen} />}
    </header>
  )
}

export default Header
