interface RadioOption {
  label: string;
  value: string;
}

interface RadioFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
}

export default function RadioField({
  value,
  onChange,
  options,
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
            dark:border-neutral-700
          "
        >
          <input
            type="radio"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />

          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}