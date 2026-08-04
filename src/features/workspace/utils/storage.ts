const STORAGE_KEY = "kyruma-workspace";

export function saveWorkspace(data: unknown) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

export function loadWorkspace<T>() {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export function clearWorkspace() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}