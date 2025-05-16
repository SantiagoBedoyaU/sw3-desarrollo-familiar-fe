import { X, LogOut, CircleUserRound, LogIn } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../../../app/stores/useAuthStore'
import { commonNavItems, adminTeacherNavItems } from '../constants/NavItems'

interface NavbarMobileProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({ open, setOpen }) => {
  const { isAuthenticated, logout } = useAuthStore()
  const signIn = localStorage.getItem('signIn')
  const userRole: number | null = signIn
    ? (JSON.parse(signIn) as { userRole: number }).userRole
    : null

  if (!open) return null

  const itemsToShow =
    userRole === 1 || userRole === 2
      ? [...commonNavItems, ...adminTeacherNavItems]
      : commonNavItems

  return (
    <section className="fixed top-0 left-0 w-64 h-full z-50 bg-[#e1effa] shadow-xl border-r border-[#b4d3ea] flex flex-col">
      <section className="flex items-center justify-between px-4 h-14 bg-[#5395c1] text-white border-b border-blue-100">
        <h1 className="text-sm font-bold">Escuelas Familiares</h1>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </section>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {itemsToShow.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                isActive
                  ? 'bg-[#c2daf1] text-[#1d3557] font-semibold'
                  : 'text-gray-700 hover:bg-[#dceffc]'
              }`
            }
          >
            {item.icon}
            <span className="text-sm">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <section className="border-t border-[#b4d3ea] bg-[#c2daf1] px-3 py-4 space-y-2 text-[#1d3557]">
        {isAuthenticated ? (
          <>
            <a
              href="/perfil"
              className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-[#dceffc]"
            >
              <CircleUserRound className="h-5 w-5" />
              Perfil
            </a>
            <button
              type="button"
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-red-100"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-[#dceffc]"
            >
              <LogIn className="h-5 w-5" />
              Iniciar Sesión
            </a>
            <a
              href="/registrarse"
              className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-[#dceffc]"
            >
              <CircleUserRound className="h-5 w-5" />
              Registrarse
            </a>
          </>
        )}
      </section>
    </section>
  )
}

export default NavbarMobile
