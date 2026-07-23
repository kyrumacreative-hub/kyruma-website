import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Información legal y condiciones de uso del sitio web de KYRUMA.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section">
        <div className="site-container">
          <div className="mx-auto max-w-3xl">
            <p className="section-label">
              INFORMACIÓN LEGAL <span className="accent-dot" />
            </p>

            <h1 className="mt-8 text-4xl font-light tracking-[-0.04em] md:text-6xl">
              Aviso Legal
            </h1>

            <p className="body-copy mt-8">
              Este Aviso Legal regula el acceso y utilización del sitio web
              kyruma.com.
            </p>

            <div className="mt-16 space-y-14">
              <LegalSection title="1. Titular del sitio web">
                <p>
                  En cumplimiento de la normativa aplicable, se informa de los
                  siguientes datos identificativos del titular:
                </p>
                <p className="mt-5">
                  <strong>Nombre:</strong> Raúl Marqués de la Torre
                  <br />
                  <strong>Nombre comercial:</strong> KYRUMA
                  <br />
                  <strong>NIF:</strong> 05992463C
                  <br />
                  <strong>Domicilio:</strong> Calle Majada 19, Morata de Tajuña,
                  Madrid, España
                  <br />
                  <strong>Correo electrónico:</strong>{" "}
                  <a
                    href="mailto:hello@kyruma.com"
                    className="underline underline-offset-4"
                  >
                    hello@kyruma.com
                  </a>
                </p>
              </LegalSection>

              <LegalSection title="2. Objeto">
                <p>
                  Este sitio web tiene como finalidad presentar KYRUMA, sus
                  servicios profesionales y su enfoque de trabajo, así como
                  facilitar el contacto entre KYRUMA y personas o empresas
                  interesadas en sus servicios.
                </p>
              </LegalSection>

              <LegalSection title="3. Condiciones de uso">
                <p>
                  El acceso a este sitio web implica la aceptación de las
                  presentes condiciones de uso. La persona usuaria se
                  compromete a utilizar el sitio, sus contenidos y servicios de
                  forma lícita y a no realizar actuaciones que puedan causar
                  daños, interrupciones o alteraciones en su funcionamiento.
                </p>
              </LegalSection>

              <LegalSection title="4. Propiedad intelectual e industrial">
                <p>
                  Los contenidos de este sitio web, incluyendo, entre otros,
                  textos, identidad visual, diseño, elementos gráficos,
                  fotografías, código y estructura, están protegidos por la
                  normativa aplicable en materia de propiedad intelectual e
                  industrial.
                </p>
                <p className="mt-4">
                  Salvo autorización expresa o cuando la legislación lo
                  permita, no está autorizada su reproducción, distribución,
                  transformación o explotación con fines comerciales.
                </p>
              </LegalSection>

              <LegalSection title="5. Responsabilidad">
                <p>
                  KYRUMA procura que la información publicada sea correcta y
                  esté actualizada, pero no garantiza la inexistencia de
                  errores ni la disponibilidad ininterrumpida del sitio web.
                </p>
                <p className="mt-4">
                  KYRUMA no será responsable de los daños derivados de usos
                  ilícitos o inadecuados del sitio web ni de circunstancias
                  fuera de su control razonable.
                </p>
              </LegalSection>

              <LegalSection title="6. Enlaces y servicios de terceros">
                <p>
                  Este sitio puede incluir enlaces, contenidos o funcionalidades
                  proporcionadas por terceros. KYRUMA no controla sus contenidos
                  ni sus políticas y no asume responsabilidad por ellos, sin
                  perjuicio de las obligaciones que legalmente correspondan.
                </p>
              </LegalSection>

              <LegalSection title="7. Protección de datos y cookies">
                <p>
                  El tratamiento de datos personales y la utilización de
                  cookies y tecnologías similares se regulan respectivamente en
                  la Política de Privacidad y la Política de Cookies de este
                  sitio web.
                </p>
              </LegalSection>

              <LegalSection title="8. Legislación aplicable">
                <p>
                  Este sitio web se rige por la legislación española. Cualquier
                  controversia se someterá a los juzgados y tribunales que
                  resulten competentes conforme a la normativa aplicable.
                </p>
              </LegalSection>

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

function LegalSection({
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
