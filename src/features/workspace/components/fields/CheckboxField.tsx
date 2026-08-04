interface CheckboxOption { label: string; value: string; }

interface CheckboxFieldProps {
  value: string[];
  options: CheckboxOption[];
  onChange: (value: string[]) => void;
  name: string;
  invalid?: boolean;
  errorId?: string;
}

export default function CheckboxField({ value, options, onChange, name, invalid = false, errorId }: CheckboxFieldProps) {
  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  }

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const checked = value.includes(option.value);
        return (
          <label key={option.value} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-neutral-300 p-5 transition hover:border-[var(--primary)] has-[:checked]:border-[var(--primary)] has-[:checked]:bg-orange-500/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-500/30 dark:border-neutral-700">
            <input type="checkbox" name={name} checked={checked} onChange={() => toggle(option.value)} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} className="size-4 accent-[var(--primary)]" />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
