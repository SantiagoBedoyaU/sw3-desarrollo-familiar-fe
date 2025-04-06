import { NavLink } from 'react-router-dom'
import { navItems } from '@/features/navigation/constants/navItems'

const DesktopNav = () => {
  return (
    <nav className="flex items-center gap-4">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            `flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'text-white border-b-2 border-white'
                : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/70'
            }`
          }
        >
          <span className="hidden lg:inline-block">{item.icon}</span>
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default DesktopNav
