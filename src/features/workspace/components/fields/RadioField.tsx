interface RadioOption {
  label: string;
  value: string;
}

interface RadioFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name: string;
  invalid?: boolean;
  errorId?: string;
}

export default function RadioField({
  value,
  onChange,
  options,
  name,
  invalid = false,
  errorId,
}: RadioFieldProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <label
          key={option.value}
          className="
            flex
            cursor-pointer
            items-center
            gap-4
            rounded-2xl
            border
            border-neutral-300
            p-5
            transition
            hover:border-[var(--primary)]
            has-[:checked]:border-[var(--primary)]
            has-[:checked]:bg-orange-500/5
            has-[:focus-visible]:ring-2
            has-[:focus-visible]:ring-orange-500/30
            dark:border-neutral-700
          "
        >
          <input
            type="radio"
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            aria-describedby={invalid ? errorId : undefined}
            className="accent-[var(--primary)]"
          />

          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
