import { websiteBrief } from "@/features/workspace/data/website-brief";
import BriefRenderer from "@/features/workspace/components/BriefRenderer";

export default function WorkspacePage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-16 lg:grid-cols-[420px_1fr]">

          {/* Lado izquierdo */}

          <aside className="flex flex-col justify-center">

            <span className="mb-6 inline-flex w-fit rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--primary)]">
              KYRUMA Workspace
            </span>

            <h1 className="text-5xl font-light leading-tight">
              Bienvenido.
            </h1>

            <p className="mt-8 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
              Antes de diseñar una solución queremos comprender vuestro negocio.
              Este briefing nos ayuda a conocer vuestra empresa, objetivos y necesidades.
            </p>

            <div className="mt-12 space-y-4">

              <div className="flex gap-3">
                <span>✓</span>
                <p>Guardado automático.</p>
              </div>

              <div className="flex gap-3">
                <span>✓</span>
                <p>Puedes continuar más tarde.</p>
              </div>

              <div className="flex gap-3">
                <span>✓</span>
                <p>Un especialista revisará personalmente el proyecto.</p>
              </div>

              <div className="flex gap-3">
                <span>✓</span>
                <p>Duración aproximada: 20 minutos.</p>
              </div>

            </div>

          </aside>

          {/* Lado derecho */}

          <section className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <BriefRenderer brief={websiteBrief} />
          </section>

        </div>
      </div>
    </main>
  );
}