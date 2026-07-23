import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Información sobre el tratamiento de datos personales realizado por KYRUMA.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="section">
        <div className="site-container">
          <div className="mx-auto max-w-3xl">
            <p className="section-label">
              PRIVACIDAD <span className="accent-dot" />
            </p>

            <h1 className="mt-8 text-4xl font-light tracking-[-0.04em] md:text-6xl">
              Política de Privacidad
            </h1>

            <p className="body-copy mt-8">
              Esta política explica cómo KYRUMA trata los datos personales
              facilitados a través de este sitio web y de sus canales de
              contacto.
            </p>

            <div className="mt-16 space-y-14">
              <PrivacySection title="1. Responsable del tratamiento">
                <p>
                  <strong>Responsable:</strong> Raúl Marqués de la Torre
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
              </PrivacySection>

              <PrivacySection title="2. Qué datos tratamos">
                <p>
                  Podemos tratar los datos que facilites voluntariamente a
                  través del formulario de contacto, correo electrónico,
                  sistemas de reserva u otros canales habilitados por KYRUMA.
                </p>
                <p className="mt-4">
                  Estos datos pueden incluir nombre, empresa, dirección de
                  correo electrónico, información sobre el servicio solicitado,
                  contenido de la consulta y cualquier otra información que
                  decidas facilitarnos.
                </p>
              </PrivacySection>

              <PrivacySection title="3. Finalidades del tratamiento">
                <p>Los datos personales podrán utilizarse para:</p>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  <li>Atender consultas y solicitudes de información.</li>
                  <li>
                    Gestionar conversaciones previas a una posible relación
                    profesional.
                  </li>
                  <li>
                    Gestionar reservas de reuniones o conversaciones cuando se
                    utilicen las herramientas habilitadas para ello.
                  </li>
                  <li>
                    Gestionar una relación profesional o contractual cuando
                    corresponda.
                  </li>
                  <li>
                    Enviar comunicaciones comerciales o novedades de KYRUMA
                    únicamente cuando hayas prestado tu consentimiento para
                    ello.
                  </li>
                </ul>
              </PrivacySection>

              <PrivacySection title="4. Base jurídica">
                <p>
                  El tratamiento de los datos enviados mediante una consulta se
                  basa en tu consentimiento y, cuando corresponda, en la
                  aplicación de medidas precontractuales solicitadas por ti.
                </p>
                <p className="mt-4">
                  Cuando exista una relación contractual, determinados
                  tratamientos serán necesarios para su ejecución y para el
                  cumplimiento de las obligaciones legales aplicables.
                </p>
                <p className="mt-4">
                  El envío de comunicaciones comerciales por correo electrónico
                  cuando no exista otra base jurídica aplicable se realizará
                  únicamente con tu consentimiento, que podrás retirar en
                  cualquier momento.
                </p>
              </PrivacySection>

              <PrivacySection title="5. Conservación de los datos">
                <p>
                  Los datos se conservarán durante el tiempo necesario para
                  atender la finalidad para la que fueron recogidos y,
                  posteriormente, durante los plazos exigidos por la normativa
                  aplicable cuando exista una obligación legal.
                </p>
                <p className="mt-4">
                  Los datos utilizados para comunicaciones basadas en
                  consentimiento se conservarán hasta que retires dicho
                  consentimiento o solicites su supresión.
                </p>
              </PrivacySection>

              <PrivacySection title="6. Destinatarios y proveedores">
                <p>
                  KYRUMA puede utilizar proveedores tecnológicos necesarios para
                  prestar sus servicios y operar este sitio web, incluyendo
                  servicios de alojamiento, correo electrónico, analítica,
                  formularios y sistemas de reserva.
                </p>
                <p className="mt-4">
                  Algunos proveedores pueden tratar datos por cuenta de KYRUMA
                  como encargados del tratamiento. Cuando resulte aplicable, se
                  adoptarán las garantías exigidas por la normativa de
                  protección de datos.
                </p>
              </PrivacySection>

              <PrivacySection title="7. Transferencias internacionales">
                <p>
                  Algunos proveedores tecnológicos pueden operar o almacenar
                  información fuera del Espacio Económico Europeo. Cuando esto
                  implique una transferencia internacional de datos, se
                  utilizarán los mecanismos y garantías previstos por la
                  normativa aplicable.
                </p>
              </PrivacySection>

              <PrivacySection title="8. Tus derechos">
                <p>
                  Puedes solicitar el acceso a tus datos personales, su
                  rectificación, supresión, limitación del tratamiento,
                  oposición o portabilidad cuando corresponda, así como retirar
                  el consentimiento prestado.
                </p>
                <p className="mt-4">
                  Para ejercer estos derechos puedes escribir a{" "}
                  <a
                    href="mailto:hello@kyruma.com"
                    className="underline underline-offset-4"
                  >
                    hello@kyruma.com
                  </a>
                  , indicando tu solicitud y aportando la información necesaria
                  para poder identificarte.
                </p>
                <p className="mt-4">
                  También tienes derecho a presentar una reclamación ante la
                  Agencia Española de Protección de Datos si consideras que el
                  tratamiento de tus datos no se ajusta a la normativa.
                </p>
              </PrivacySection>

              <PrivacySection title="9. Datos de terceros">
                <p>
                  Si facilitas datos personales de otra persona, debes contar
                  con legitimación suficiente para hacerlo y asegurarte de que
                  dicha persona conoce la información relevante sobre el
                  tratamiento de sus datos.
                </p>
              </PrivacySection>

              <PrivacySection title="10. Seguridad">
                <p>
                  KYRUMA adopta medidas razonables de carácter técnico y
                  organizativo orientadas a proteger los datos personales y a
                  reducir el riesgo de pérdida, alteración, acceso o tratamiento
                  no autorizado.
                </p>
              </PrivacySection>

              <PrivacySection title="11. Cookies y analítica">
                <p>
                  Este sitio puede utilizar cookies y tecnologías similares.
                  Puedes consultar información específica sobre su utilización
                  en nuestra{" "}
                  <Link href="/cookies" className="underline underline-offset-4">
                    Política de Cookies
                  </Link>
                  .
                </p>
              </PrivacySection>

              <PrivacySection title="12. Cambios en esta política">
                <p>
                  KYRUMA podrá actualizar esta Política de Privacidad cuando
                  resulte necesario por cambios legales, técnicos o en los
                  servicios ofrecidos. La versión publicada en este sitio será
                  la aplicable en cada momento.
                </p>
              </PrivacySection>

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

function PrivacySection({
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
