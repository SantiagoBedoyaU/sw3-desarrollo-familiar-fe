import {
  Home,
  FileText,
  PenTool,
  Search,
  GraduationCap,
  User,
} from 'lucide-react'

export const navItems = [
  { title: 'Inicio', href: '/', icon: <Home className="h-5 w-5" /> },
  {
    title: 'Nuestras prácticas',
    href: '/informes-practicas',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Caja de herramientas',
    href: '/caja-de-herramientas',
    icon: <PenTool className="h-5 w-5" />,
  },
  {
    title: 'Investigación',
    href: '/articulos',
    icon: <Search className="h-5 w-5" />,
  },
  {
    title: 'Formación docente',
    href: '/formacion-docente',
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: 'Usuarios',
    href: '/usuarios',
    icon: <User className="h-5 w-5" />,
  },
]
