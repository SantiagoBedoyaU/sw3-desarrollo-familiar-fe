interface SelectProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  error: boolean
  optionDefaultText?: string
  errorString?: string
  className?: string
  required: boolean
  options: { value: string; label: string; key: string }[]
}

function Select({
  id,
  name,
  value,
  required,
  onChange,
  optionDefaultText,
  error,
  errorString,
  className,
  options,
}: Readonly<SelectProps>) {
  return (
    <section className="space-y-1 w-full flex flex-col md:max-w-3/4">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={
          'p-1 block border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:outline-none focus:ring-indigo-500 sm:text-sm ' +
          (className ?? ' ') +
          (error ? ' bg-red-500 border-red-500 hover:border-red-600' : ' ')
        }
      >
        {optionDefaultText && <option value="">{optionDefaultText}</option>}
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs bg-red-500 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 ">
          {errorString}
        </p>
      )}
    </section>
  )
}

export default Select
