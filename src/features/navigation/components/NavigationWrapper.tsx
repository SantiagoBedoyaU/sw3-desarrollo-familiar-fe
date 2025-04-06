import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'

interface NavigationWrapperProps {
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const NavigationWrapper = ({ open, setOpen }: NavigationWrapperProps) => {
  return (
    <>
      {/* Mobile */}
      {open !== undefined && setOpen !== undefined && (
        <MobileNav open={open} setOpen={setOpen} />
      )}

      {/* Desktop */}
      {open === undefined && setOpen === undefined && <DesktopNav />}
    </>
  )
}

export default NavigationWrapper
