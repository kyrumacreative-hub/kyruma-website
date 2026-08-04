interface SelectOption { label: string; value: string; }

interface SelectFieldProps {
  value: string;
  placeholder?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  invalid?: boolean;
  errorId?: string;
}

export default function SelectField({ value, placeholder = "Selecciona una opción", options, onChange, invalid = false, errorId }: SelectFieldProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-invalid={invalid}
      aria-describedby={invalid ? errorId : undefined}
      className="w-full appearance-none rounded-2xl border border-neutral-300 bg-white px-5 py-5 text-base outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-orange-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  );
}
