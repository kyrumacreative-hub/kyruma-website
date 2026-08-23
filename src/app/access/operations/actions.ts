"use server";

import { revalidatePath } from "next/cache";
import { completeOperationalTask, qualifyLead } from "@/features/operating-layer/server/leadFunnel";

export async function qualifyLeadAction(formData: FormData): Promise<void> {
  await qualifyLead(String(formData.get("leadId") ?? ""), String(formData.get("reason") ?? ""));
  revalidatePath("/access/operations");
}

export async function completeOperationalTaskAction(formData: FormData): Promise<void> {
  await completeOperationalTask(String(formData.get("taskId") ?? ""));
  revalidatePath("/access/operations");
}

