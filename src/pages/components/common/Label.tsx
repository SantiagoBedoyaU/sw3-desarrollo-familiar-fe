interface LabelProps {
  readonly htmlFor: string;
  readonly text: string;
  readonly className?: string;
  readonly error: boolean;
}

function Label({ htmlFor, error, text, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        "block text-md font-medium text-gray-700 w-fit md:max-w-1/4 bg-green-400" +
        className +
        (error
          ? " text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          : " ")
      }
    >
      {text}
    </label>
  );
}

export default Label;
