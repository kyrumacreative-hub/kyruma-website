interface Props {
  title: string;
  description?: string;
}

export default function WorkspaceHeader({
  title,
  description,
}: Props) {
  return (
    <header className="space-y-4">

      <span className="text-xs uppercase tracking-[0.35em] text-neutral-500">
        KYRUMA Project Workspace™
      </span>

      <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-white">
        {title}
      </h1>

      {description && (
        <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}

    </header>
  );
}