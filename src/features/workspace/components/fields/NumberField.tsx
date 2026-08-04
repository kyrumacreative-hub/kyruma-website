interface NumberFieldProps { value: string; placeholder?: string; min?: number; max?: number; onChange: (value: string) => void; invalid?: boolean; errorId?: string; }

export default function NumberField({ value, placeholder, min, max, onChange, invalid = false, errorId }: NumberFieldProps) {
  return <input type="number" value={value} placeholder={placeholder} min={min} max={max} onChange={(event) => onChange(event.target.value)} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} className="w-full rounded-2xl border border-neutral-300 bg-white px-6 py-5 text-lg outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-orange-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />;
}
