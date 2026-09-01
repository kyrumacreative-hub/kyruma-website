"use server";

import { revalidatePath } from "next/cache";
import {
  createAiWorkRequest,
  createBrainRecord,
  createContentHook,
  createOperationalFriction,
  createOpportunity,
  createRadarEntry,
  updateRadarStatus,
} from "@/features/operating-intelligence/server/mutations";

function values(formData: FormData): Readonly<Record<string, unknown>> {
  return Object.fromEntries(formData.entries());
}

async function refresh(work: Promise<void>): Promise<void> {
  await work;
  revalidatePath("/access/operations/intelligence");
}

export async function askKyrumaAction(formData: FormData) { await refresh(createAiWorkRequest(values(formData))); }
export async function addRadarEntryAction(formData: FormData) { await refresh(createRadarEntry(values(formData))); }
export async function updateRadarStatusAction(formData: FormData) { await refresh(updateRadarStatus(values(formData))); }
export async function addBrainRecordAction(formData: FormData) { await refresh(createBrainRecord(values(formData))); }
export async function addContentHookAction(formData: FormData) { await refresh(createContentHook(values(formData))); }
export async function addOpportunityAction(formData: FormData) { await refresh(createOpportunity(values(formData))); }
export async function addFrictionAction(formData: FormData) { await refresh(createOperationalFriction(values(formData))); }
