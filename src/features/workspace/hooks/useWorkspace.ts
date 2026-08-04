"use client";

import { useState } from "react";

import { ProjectBrief } from "../types/brief";

export function useWorkspace(brief: ProjectBrief) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const section = brief.sections[currentSection];

  const question = section.questions[currentQuestion];

  function next() {
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      return;
    }

    if (currentSection < brief.sections.length - 1) {
      setCurrentSection((s) => s + 1);
      setCurrentQuestion(0);
    }
  }

  function previous() {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
      return;
    }

    if (currentSection > 0) {
      const newSection = currentSection - 1;

      setCurrentSection(newSection);

      setCurrentQuestion(
        brief.sections[newSection].questions.length - 1
      );
    }
  }

  return {
    section,
    question,
    next,
    previous,
  };
}