interface TextareaFieldProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function TextareaField({ value, placeholder, onChange }: TextareaFieldProps) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-44 w-full rounded-2xl border border-neutral-300 bg-white p-5 text-base leading-7 outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-orange-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
    />
  );
}
