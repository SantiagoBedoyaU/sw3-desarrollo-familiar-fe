import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'

const NavigationWrapper = ({
  open,
  setOpen,
}: {
  open?: boolean
  setOpen?: any
}) => {
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
