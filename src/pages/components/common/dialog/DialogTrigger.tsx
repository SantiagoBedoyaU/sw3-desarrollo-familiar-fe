import { ReactNode } from 'react'

interface DialogTriggerProps {
    children: ReactNode
    className?: string
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const DialogTrigger = ({
    children,
    setOpen,
    className,
}: DialogTriggerProps) => {
    return (
        <button className={className} onClick={() => setOpen(true)}>
            {children}
        </button>
    )
}
