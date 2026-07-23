import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Información sobre el uso de cookies y tecnologías similares en el sitio web de KYRUMA.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section">
        <div className="site-container">
          <div className="mx-auto max-w-3xl">
            <p className="section-label">
              COOKIES <span className="accent-dot" />
            </p>

            <h1 className="mt-8 text-4xl font-light tracking-[-0.04em] md:text-6xl">
              Política de Cookies
            </h1>

            <p className="body-copy mt-8">
              Esta política explica qué son las cookies y tecnologías similares,
              para qué pueden utilizarse en este sitio web y cómo puedes
              gestionar tus preferencias.
            </p>

            <div className="mt-16 space-y-14">
              <CookieSection title="1. Qué son las cookies">
                <p>
                  Las cookies son pequeños archivos o fragmentos de información
                  que pueden almacenarse en el dispositivo del usuario cuando
                  visita un sitio web.
                </p>
                <p className="mt-4">
                  También pueden utilizarse tecnologías similares que permiten
                  recordar determinadas preferencias, proporcionar
                  funcionalidades o recopilar información sobre el uso de un
                  sitio web.
                </p>
              </CookieSection>

              <CookieSection title="2. Qué tipos de tecnologías puede utilizar KYRUMA">
                <p>
                  Este sitio puede utilizar tecnologías estrictamente necesarias
                  para su funcionamiento y, cuando el usuario lo autorice,
                  tecnologías de medición o analítica.
                </p>

                <ul className="mt-4 list-disc space-y-3 pl-5">
                  <li>
                    <strong>Necesarias:</strong> permiten el funcionamiento,
                    seguridad y prestación de determinadas funcionalidades del
                    sitio.
                  </li>
                  <li>
                    <strong>Analíticas:</strong> permiten obtener información
                    agregada sobre la utilización del sitio para comprender su
                    rendimiento y mejorar la experiencia.
                  </li>
                </ul>
              </CookieSection>

              <CookieSection title="3. Google Analytics">
                <p>
                  KYRUMA utiliza Google Analytics 4 como herramienta de medición
                  para comprender cómo se utiliza el sitio web y evaluar su
                  rendimiento.
                </p>
                <p className="mt-4">
                  Las tecnologías asociadas a Google Analytics que requieran
                  consentimiento solo deben activarse cuando el usuario haya
                  aceptado las cookies analíticas.
                </p>
                <p className="mt-4">
                  Google puede tratar determinada información técnica relacionada
                  con la navegación de acuerdo con sus propias condiciones y
                  políticas de privacidad.
                </p>
              </CookieSection>

              <CookieSection title="4. Servicios de terceros">
                <p>
                  Algunas funcionalidades del sitio pueden ser proporcionadas
                  mediante servicios externos. Entre ellas pueden encontrarse
                  herramientas de reserva de reuniones, infraestructura web,
                  correo electrónico u otros servicios tecnológicos necesarios
                  para operar KYRUMA.
                </p>
                <p className="mt-4">
                  Estos proveedores pueden utilizar sus propias tecnologías o
                  tratar determinada información cuando el usuario interactúa
                  con sus servicios.
                </p>
              </CookieSection>

              <CookieSection title="5. Consentimiento">
                <p>
                  Cuando una tecnología no sea estrictamente necesaria, su
                  utilización estará condicionada al consentimiento del usuario
                  cuando así lo exija la normativa aplicable.
                </p>
                <p className="mt-4">
                  El usuario podrá aceptar o rechazar las categorías opcionales
                  mediante el sistema de gestión de consentimiento habilitado en
                  este sitio.
                </p>
              </CookieSection>

              <CookieSection title="6. Cómo cambiar tus preferencias">
                <p>
                  Puedes retirar o modificar tu consentimiento en cualquier
                  momento mediante las opciones de configuración de cookies que
                  KYRUMA habilite en el sitio web.
                </p>
                <p className="mt-4">
                  También puedes configurar tu navegador para bloquear, eliminar
                  o limitar determinadas cookies. La forma de hacerlo depende del
                  navegador y dispositivo utilizados.
                </p>
              </CookieSection>

              <CookieSection title="7. Transferencias internacionales">
                <p>
                  Determinados proveedores tecnológicos pueden tratar información
                  fuera del Espacio Económico Europeo. Cuando resulte aplicable,
                  dichas transferencias deberán realizarse utilizando los
                  mecanismos y garantías previstos por la normativa de
                  protección de datos.
                </p>
              </CookieSection>

              <CookieSection title="8. Más información sobre privacidad">
                <p>
                  Puedes consultar información adicional sobre el tratamiento de
                  datos personales en nuestra{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4"
                  >
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </CookieSection>

              <CookieSection title="9. Actualizaciones">
                <p>
                  KYRUMA podrá modificar esta Política de Cookies cuando cambien
                  las tecnologías utilizadas, los servicios del sitio o la
                  normativa aplicable.
                </p>
              </CookieSection>

              <p className="border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)]">
                Última actualización: julio de 2026.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CookieSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-medium tracking-[-0.02em]">{title}</h2>
      <div className="body-copy mt-5">{children}</div>
    </section>
  );
}
