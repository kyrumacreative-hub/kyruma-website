export type ExternalResourceProvider = "figma" | "google-drive";

const allowedHosts: Record<ExternalResourceProvider, string> = {
  figma: "figma.com",
  "google-drive": "drive.google.com",
};

export function parseExternalResourceUrl(
  value: FormDataEntryValue | string | null,
  provider: ExternalResourceProvider,
): string | undefined {
  const raw = String(value ?? "").trim();
  if (!raw) return undefined;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("ACCESS_EXTERNAL_URL_INVALID");
  }

  const allowedHost = allowedHosts[provider];
  const hostname = url.hostname.toLowerCase();
  const hostAllowed =
    hostname === allowedHost || hostname.endsWith(`.${allowedHost}`);

  if (
    url.protocol !== "https:" ||
    !hostAllowed ||
    url.username ||
    url.password
  ) {
    throw new Error("ACCESS_EXTERNAL_URL_INVALID");
  }

  url.hash = "";
  return url.toString();
}
