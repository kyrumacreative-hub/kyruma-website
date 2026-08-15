import { acceptInvitation } from "./actions";

export const dynamic = "force-dynamic";

export default async function AcceptAccessPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return <main className="grid min-h-screen place-items-center px-6"><section className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10"><p className="text-xs uppercase tracking-[.28em] text-[var(--primary)]">KYRUMA Access</p><h1 className="mt-4 text-3xl font-light">Activar acceso</h1><p className="mt-4 text-[var(--muted)]">Confirma la invitación con la misma dirección de correo con la que has iniciado sesión.</p><form action={acceptInvitation} className="mt-8"><input name="token" type="hidden" value={token} /><button className="w-full rounded-full bg-[var(--foreground)] px-6 py-3 text-[var(--background)] disabled:opacity-50" disabled={!token}>Aceptar invitación</button></form></section></main>;
}
