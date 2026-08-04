interface TextFieldProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: string;
  invalid?: boolean;
  errorId?: string;
}

export default function TextField({
  value,
  placeholder,
  onChange,
  type = "text",
  invalid = false,
  errorId,
}: TextFieldProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid}
      aria-describedby={invalid ? errorId : undefined}
      className="
        w-full
        rounded-2xl
        border
        border-neutral-300
        bg-white
        px-6
        py-5
        text-lg
        outline-none
        transition-all
        focus:border-[var(--primary)]
        focus:ring-4
        focus:ring-orange-500/10
        dark:border-neutral-700
        dark:bg-neutral-950
        dark:text-white
      "
    />
  );
}
