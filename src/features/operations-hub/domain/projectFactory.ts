import { Project, type ProjectProperties } from "./project";

export class ProjectFactory {
  static create(properties: ProjectProperties) { return new Project(properties); }
}
