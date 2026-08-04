import Container from "@/components/ui/Container";

import BriefRenderer from "@/features/workspace/components/BriefRenderer";
import { websiteBrief } from "@/features/workspace/data/website-brief";

export default function WorkspacePage() {
  return (
    <main className="min-h-screen bg-black py-32">
      <Container>

        <div className="mx-auto max-w-4xl">

          <span className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            KYRUMA Project Workspace™
          </span>

          <h1 className="mt-6 text-5xl font-light text-white md:text-7xl">
            {websiteBrief.name}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
            {websiteBrief.description}
          </p>

          <div className="mt-24">
            <BriefRenderer brief={websiteBrief} />
          </div>

        </div>

      </Container>
    </main>
  );
}