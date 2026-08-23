export interface OperationalTaskConfiguration {
  readonly taskType: string;
  readonly title: string;
  readonly dueHours: number;
}

export function parseOperationalTaskConfiguration(value: Readonly<Record<string, unknown>>): OperationalTaskConfiguration {
  const taskType = typeof value.taskType === "string" ? value.taskType.trim() : "";
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const dueHours = typeof value.dueHours === "number" ? value.dueHours : Number.NaN;
  if (!/^[a-z][a-z0-9.-]{2,80}$/.test(taskType) || !title || title.length > 160) throw new Error("OPERATIONAL_TASK_CONFIG_INVALID");
  if (!Number.isInteger(dueHours) || dueHours < 1 || dueHours > 720) throw new Error("OPERATIONAL_TASK_DUE_HOURS_INVALID");
  return { taskType, title, dueHours };
}

export function normalizeFunnelEmail(value: string): string {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) throw new Error("LEAD_EMAIL_INVALID");
  return email;
}

export function assertSubmissionId(value: string): string {
  const id = value.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new Error("LEAD_SUBMISSION_ID_INVALID");
  return id;
}

