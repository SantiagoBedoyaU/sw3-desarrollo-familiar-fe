interface InputProps {
    id: string
    error: boolean
    errorString?: string
    name: string
    value: string
    type: string
    requierd: boolean
    placeholder?: string
    className?: string
    defaultValue?: string
    disabled?: boolean
    readOnly?: boolean
    autoFocus?: boolean
    autoComplete?: string
    maxLength?: number
    minLength?: number
    pattern?: string
    size?: number
    step?: number
    min?: number
    max?: number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Input({
    id,
    error,
    errorString,
    name,
    value,
    type,
    requierd,
    placeholder,
    className,
    defaultValue,
    disabled,
    readOnly,
    autoFocus,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    size,
    step,
    min,
    max,
    onChange,
}: Readonly<InputProps>) {
    return (
        <section className='relative space-y-1 w-full flex flex-col md:max-w-3/4'>
            <input
                id={id}
                name={name}
                value={value}
                type={type}
                aria-invalid={error ? 'true' : 'false'}
                aria-errormessage={error ? `${id}-error` : undefined}
                aria-required={requierd ? 'true' : 'false'}
                required={requierd}
                placeholder={placeholder}
                className={
                    'p-1 block border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:outline-none focus:ring-indigo-500 sm:text-sm ' +
                    className +
                    (error ? ' border-red-500 hover:border-red-600' : '')
                }
                defaultValue={defaultValue}
                disabled={disabled}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                maxLength={maxLength}
                minLength={minLength}
                pattern={pattern}
                size={size}
                step={step}
                min={min}
                max={max}
                readOnly={readOnly}
                onChange={onChange}
            />
            {error && (
                <section className='absolute -bottom-3 block mt-1 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'>
                    {errorString}
                </section>
            )}
        </section>
    )
}

export default Input
