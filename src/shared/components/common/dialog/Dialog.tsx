import React, { Dispatch, SetStateAction, ReactElement } from 'react'

interface DialogChildProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

interface DialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
  children: ReactElement<DialogChildProps> | ReactElement<DialogChildProps>[]
}

export const Dialog = ({ children, className, open, setOpen }: DialogProps) => {
  return (
    <section
      className={
        className ?? 'fixed inset-0 z-50 flex items-center justify-center'
      }
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { open, setOpen })
        }
        return child
      })}
    </section>
  )
}
