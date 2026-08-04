interface ProgressBarProps {
  progress: number;
  current: number;
  total: number;
}

export default function ProgressBar({
  progress,
  current,
  total,
}: ProgressBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-neutral-900 dark:text-white">
          Paso {current} de {total}
        </span>

        <span className="text-neutral-500">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}