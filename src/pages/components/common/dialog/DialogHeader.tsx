import { ReactNode } from 'react'

interface DialogHeaderProps {
  children: ReactNode
}

export const DialogHeader = ({ children }: DialogHeaderProps) => {
  return <section className="mb-4 h-fit mr-8">{children}</section>
}
