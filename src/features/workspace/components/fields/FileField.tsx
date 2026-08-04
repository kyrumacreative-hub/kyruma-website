interface FileFieldProps { value: string[]; accept?: string[]; multiple?: boolean; onChange: (value: string[]) => void; }

export default function FileField({ value, accept, multiple = false, onChange }: FileFieldProps) {
  return (
    <label className="block cursor-pointer rounded-2xl border border-dashed border-neutral-300 p-6 text-center transition hover:border-[var(--primary)] dark:border-neutral-700">
      <span className="block text-sm font-medium">Adjuntar archivos</span>
      <span className="mt-1 block text-sm text-neutral-500">{value.length ? value.join(", ") : "Selecciona uno o varios archivos"}</span>
      <input type="file" accept={accept?.join(",")} multiple={multiple} className="sr-only" onChange={(event) => onChange(Array.from(event.target.files ?? []).map((file) => file.name))} />
    </label>
  );
}
