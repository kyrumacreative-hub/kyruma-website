import { UserButton } from "@clerk/nextjs";
export default function PendingAccessPage() { return <main className="grid min-h-screen place-items-center px-6"><section className="max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center"><div className="mx-auto w-fit"><UserButton /></div><h1 className="mt-6 text-3xl font-light">Acceso pendiente</h1><p className="mt-4 text-[var(--muted)]">Tu identidad está verificada, pero todavía no existe una Membership activa para un Workspace. Abre la invitación recibida o contacta con KYRUMA.</p></section></main>; }

