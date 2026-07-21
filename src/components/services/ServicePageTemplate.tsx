import Link from "next/link";

export interface ServiceApproachItem {
  number: string;
  title: string;
  text: string;
}

export interface ServicePageData {
  eyebrow: string;
  title: string;
  introduction: string;

  challenge: {
    title: string;
    paragraphs: string[];
  };

  approach: ServiceApproachItem[];

  deliverables: string[];

  finalCta: {
    eyebrow: string;
    title: string;
    email?: string;
  };
}

interface ServicePageTemplateProps {
  data: ServicePageData;
}

export default function ServicePageTemplate({
  data,
}: ServicePageTemplateProps) {
  const email = data.finalCta.email ?? "hello@kyruma.com";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* HERO */}
      <section className="flex min-h-screen items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-40 md:px-10 md:pb-24 lg:px-12 xl:px-16">
          <div className="max-w-5xl">
            <p className="mb-8 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              {data.eyebrow}
            </p>

            <h1 className="max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-8xl">
              {data.title}
            </h1>

            <div className="mt-12 grid gap-10 border-t border-[var(--border)] pt-8 md:grid-cols-2">
              <p className="max-w-xl text-lg leading-relaxed text-[var(--muted)] md:text-xl">
                {data.introduction}
              </p>

              <div className="flex items-end md:justify-end">
                <Link
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-3 text-sm font-medium"
                >
                  Start a conversation

                  <span className="text-[var(--primary)] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CHALLENGE */}
      <section className="border-t border-[var(--border)] py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 md:grid-cols-12 md:px-10 lg:px-12 xl:px-16">
          <div className="md:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              The Challenge
            </p>
          </div>

          <div className="md:col-span-8">
            <h2 className="max-w-4xl text-3xl font-medium leading-tight tracking-[-0.035em] md:text-5xl">
              {data.challenge.title}
            </h2>

            <div className="mt-10 max-w-2xl space-y-6 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              {data.challenge.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUR APPROACH */}
      <section className="border-t border-[var(--border)] py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <p className="mb-16 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
            Our Approach
          </p>

          <div className="grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
            {data.approach.map((item) => (
              <article
                key={item.number}
                className="min-h-80 bg-[var(--background)] p-8 md:p-10"
              >
                <span className="text-xs text-[var(--muted)]">
                  {item.number}
                </span>

                <h3 className="mt-20 text-2xl font-medium tracking-[-0.025em]">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-md leading-relaxed text-[var(--muted)]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="border-t border-[var(--border)] py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 md:grid-cols-12 md:px-10 lg:px-12 xl:px-16">
          <div className="md:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              What You Get
            </p>
          </div>

          <div className="md:col-span-8">
            {data.deliverables.map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-[var(--border)] py-6"
              >
                <span className="text-xl font-medium tracking-[-0.02em] md:text-2xl">
                  {item}
                </span>

                <span className="text-xs text-[var(--muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-[var(--border)] py-32 md:py-44">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
            {data.finalCta.eyebrow}
          </p>

          <h2 className="max-w-5xl text-4xl font-medium leading-[1] tracking-[-0.045em] md:text-6xl lg:text-7xl">
            {data.finalCta.title}
          </h2>

          <Link
            href={`mailto:${email}`}
            className="group mt-16 flex w-full items-center justify-between border-b border-[var(--border-strong)] pb-6 text-lg font-medium md:text-xl"
          >
            <span>{email}</span>

            <span className="text-[var(--primary)] transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}