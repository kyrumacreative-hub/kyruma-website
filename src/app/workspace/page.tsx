import Container from "@/components/ui/Container";

import BriefRenderer from "@/features/workspace/components/BriefRenderer";
import WorkspaceCard from "@/features/workspace/components/WorkspaceCard";
import WorkspaceHeader from "@/features/workspace/components/WorkspaceHeader";
import { websiteBrief } from "@/features/workspace/data/website-brief";

export default function WorkspacePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 py-32">
      <Container>

        <div className="mx-auto max-w-4xl">
          
          <WorkspaceHeader
            title={websiteBrief.name}
            description={websiteBrief.description}
          />

          <div className="mt-24">
            <WorkspaceCard>
              <BriefRenderer brief={websiteBrief} />
            </WorkspaceCard>
          </div>

        </div>

      </Container>
    </main>
  );
}