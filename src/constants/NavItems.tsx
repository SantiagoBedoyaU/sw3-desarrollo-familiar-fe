import {
  // BookOpen,
  FileText,
  GraduationCap,
  Home,
  // Newspaper,
  PenTool,
  Search,
} from 'lucide-react'
import NavItem from '../types/reactTypes/NavItem'

const navItems: NavItem[] = [
  {
    title: 'Inicio',
    href: '/',
    icon: <Home className="h-5 w-5" />,
  },
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
  // {
  //     title: 'Artículos',
  //     href: '/articulos',
  //     icon: <Newspaper className='h-5 w-5' />,
  // },
  // {
  //     title: 'Material educativo',
  //     href: '/material-educativo',
  //     icon: <BookOpen className='h-5 w-5' />,
  // },
]

export default navItems
