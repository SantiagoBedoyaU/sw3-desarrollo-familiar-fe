import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center h-screen my-auto w-screen">
      <button
        className="fixed inset-0 bg-gray-400 opacity-50"
        onClick={onClose}
      />
      <section className="relative flex flex-col min-w-[320px] max-w-fit bg-white rounded shadow-lg max-h-[99vh] ">
        <section className="flex justify-end">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </section>
        <section className="overflow-x-auto w-full p-4">{children}</section>
      </section>
    </section>
  )
}
