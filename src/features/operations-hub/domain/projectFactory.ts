import { Project, type ProjectProperties } from "./project";

export class ProjectFactory {
  static create(properties: ProjectProperties) { return new Project(properties); }
  /** Rebuilds an already persisted aggregate without recording creation events. */
  static rehydrate(properties: ProjectProperties) { return new Project(properties); }
}
