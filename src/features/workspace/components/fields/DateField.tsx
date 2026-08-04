interface DateFieldProps { value: string; min?: string; max?: string; onChange: (value: string) => void; }

export default function DateField({ value, min, max, onChange }: DateFieldProps) {
  return <input type="date" value={value} min={min} max={max} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-neutral-300 bg-white px-6 py-5 text-lg outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-orange-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />;
}
