import { NavLink } from 'react-router-dom'
import { navItems } from '../constants/navItems'

const DesktopNav = () => {
  return (
    <nav className="flex items-center gap-3">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            `px-2 py-1 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'text-white border-b-2 border-white'
                : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/70'
            }`
          }
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  )
}

export default DesktopNav
