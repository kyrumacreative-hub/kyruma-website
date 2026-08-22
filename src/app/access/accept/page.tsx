import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { hashAccessToken, normalizeEmail } from "@/features/access/domain/invitations";
import { prisma } from "@/lib/prisma";
import { acceptInvitation } from "./actions";

export const dynamic = "force-dynamic";

export default async function AcceptAccessPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const [identity, invitation] = await Promise.all([
    currentUser(),
    token.length >= 20
      ? prisma.accessInvitation.findUnique({
          where: { tokenHash: hashAccessToken(token) },
          select: { normalizedEmail: true, status: true, expiresAt: true },
        })
      : null,
  ]);
  const signedInEmail = identity?.primaryEmailAddress?.emailAddress ?? "";
  const available = invitation?.status === "pending" && invitation.expiresAt > new Date();
  const identityMismatch = available && signedInEmail && normalizeEmail(signedInEmail) !== invitation.normalizedEmail;
  const returnUrl = `/access/accept?token=${encodeURIComponent(token)}`;

  return <main className="grid min-h-screen place-items-center px-6"><section className="w-full max-w-xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10"><p className="text-xs uppercase tracking-[.28em] text-[var(--primary)]">KYRUMA Access</p><h1 className="mt-4 text-3xl font-light">Activar acceso</h1>{identityMismatch ? <><p className="mt-4 text-[var(--muted)]">Has iniciado sesión como <strong className="text-[var(--foreground)]">{signedInEmail}</strong>, pero esta invitación pertenece a <strong className="text-[var(--foreground)]">{invitation.normalizedEmail}</strong>.</p><p className="mt-3 text-sm text-[var(--muted)]">Cierra esta sesión y entra con la dirección invitada para continuar.</p><div className="mt-8"><SignOutButton redirectUrl={returnUrl}><button className="w-full rounded-full bg-[var(--foreground)] px-6 py-3 text-[var(--background)]">Salir y cambiar de cuenta</button></SignOutButton></div></> : <><p className="mt-4 text-[var(--muted)]">Confirma la invitación con la misma dirección de correo con la que has iniciado sesión.</p><form action={acceptInvitation} className="mt-8"><input name="token" type="hidden" value={token} /><button className="w-full rounded-full bg-[var(--foreground)] px-6 py-3 text-[var(--background)] disabled:opacity-50" disabled={!available}>Aceptar invitación</button></form>{!available ? <p className="mt-4 text-sm text-red-600">La invitación no está disponible o ha caducado.</p> : null}</>}</section></main>;
}
