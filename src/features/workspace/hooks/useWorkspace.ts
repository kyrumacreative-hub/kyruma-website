"use client";

import { useEffect, useState } from "react";

import { AnswerValue, updateAnswer as updateAnswerEngine } from "../engine/answers";
import { ProjectBrief } from "../types/brief";
import { loadWorkspace, saveWorkspace } from "../utils/storage";

interface WorkspaceData {
  currentSection: number;
  answers: Record<string, AnswerValue>;
}

function getInitialWorkspaceData(brief: ProjectBrief): WorkspaceData {
  const savedWorkspace = loadWorkspace<Partial<WorkspaceData>>();
  const savedSection = savedWorkspace?.currentSection;

  return {
    answers: savedWorkspace?.answers ?? {},
    currentSection: typeof savedSection === "number" && brief.sections[savedSection] ? savedSection : 0,
  };
}

export function useWorkspace(brief: ProjectBrief) {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const activeWorkspace = workspace ?? { currentSection: 0, answers: {} };
  const { currentSection, answers } = activeWorkspace;
  const section = brief.sections[currentSection];

  useEffect(() => {
    // The browser-only storage must be restored after hydration to avoid overwriting a saved Discovery.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWorkspace(getInitialWorkspaceData(brief));
  }, [brief]);

  function updateAnswer(id: string, value: AnswerValue) {
    setWorkspace((previousWorkspace) => ({
      ...(previousWorkspace ?? getInitialWorkspaceData(brief)),
      answers: updateAnswerEngine(previousWorkspace?.answers ?? {}, id, value),
    }));
  }

  function goToSection(sectionIndex: number) {
    if (!brief.sections[sectionIndex]) return;
    setWorkspace((previousWorkspace) => ({ ...(previousWorkspace ?? getInitialWorkspaceData(brief)), currentSection: sectionIndex }));
  }

  function nextConversation() {
    goToSection(currentSection + 1);
  }

  function previousConversation() {
    goToSection(currentSection - 1);
  }

  useEffect(() => {
    if (workspace) saveWorkspace(workspace);
  }, [workspace]);

  return {
    section,
    isReady: workspace !== null,
    answers,
    updateAnswer,
    currentSection,
    goToSection,
    nextConversation,
    previousConversation,
  };
}
