interface TextAreaProps {
    id: string
    error: boolean
    errorString?: string
    name: string
    value: string
    required: boolean
    placeholder?: string
    className?: string
    defaultValue?: string
    disabled?: boolean
    readOnly?: boolean
    autoFocus?: boolean
    autoComplete?: string
    maxLength?: number
    minLength?: number
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function TextArea(
    {
        id,
        error,
        errorString,
        name,
        value,
        required,
        placeholder,
        className,
        defaultValue,
        disabled,
        readOnly,
        autoFocus,
        autoComplete,
        maxLength,
        minLength,
        onChange,
    }: Readonly<TextAreaProps> = {} as TextAreaProps
) {
    return (
        <section className='space-y-1 w-full flex flex-col '>
            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                aria-invalid={error ? 'true' : 'false'}
                aria-errormessage={error ? `${id}-error` : undefined}
                aria-required={required ? 'true' : 'false'}
                placeholder={placeholder}
                required={required}
                className={`p-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 ${className}`}
                defaultValue={defaultValue}
                disabled={disabled}
                readOnly={readOnly}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                maxLength={maxLength}
                minLength={minLength}
                rows={3}></textarea>
            {error && errorString && (
                <span
                    id={`${id}-error`}
                    className='text-red-500 border-red-500 hover:border-red-600 text-sm font-medium'
                    role='alert'>
                    {errorString}
                </span>
            )}
        </section>
    )
}

export default TextArea
