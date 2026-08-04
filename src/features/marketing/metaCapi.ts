import { createHash } from "crypto";

interface MetaConversion {
  eventName: "Lead" | "CompleteDiscovery";
  email?: string;
  eventSourceUrl?: string;
  consent: boolean;
}

export async function sendMetaConversion({ eventName, email, eventSourceUrl, consent }: MetaConversion) {
  const pixelId = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const version = process.env.META_CAPI_API_VERSION;
  if (!consent || !pixelId || !accessToken || !version) return;

  const userData = email ? { em: [createHash("sha256").update(email.trim().toLowerCase()).digest("hex")] } : {};
  const response = await fetch(`https://graph.facebook.com/${version}/${pixelId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken, data: [{ event_name: eventName, event_time: Math.floor(Date.now() / 1000), action_source: "website", event_source_url: eventSourceUrl, user_data: userData }] }),
  });
  if (!response.ok) throw new Error(`Meta CAPI error ${response.status}`);
}
