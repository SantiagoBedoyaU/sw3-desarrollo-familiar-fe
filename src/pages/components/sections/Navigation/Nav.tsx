import { Menu, X } from 'lucide-react'
import NavbarMobile from './NavbarMobile'

interface NavProps {
  readonly open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function Nav({ open, setOpen }: Readonly<NavProps>) {
  return (
    <section className={open ? ' min-h-8 relative inset-0 z-50 ' : ''}>
      {open && <NavbarMobile open={open} setOpen={setOpen}></NavbarMobile>}
      {!open ? (
        <Menu
          className="h-6 w-6 absolute top-3 md:top-1.5 right-3 p-0.5 hover:bg-blue-100 rounded-lg"
          onClick={() => setOpen(true)}
        />
      ) : (
        <X
          className="h-6 w-6 fixed top-3 md:top-1.5 right-3 p-0.5 hover:bg-blue-100 rounded-lg"
          onClick={() => setOpen(false)}
        />
      )}
    </section>
  )
}

export default Nav
