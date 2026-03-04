const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.sensinggarden.com/v1";
const API_KEY = import.meta.env.VITE_SENSING_GARDEN_API_KEY || "";

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function apiFetch<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const url = buildUrl(path, params);
  const headers: HeadersInit = {};
  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText} — ${url}`);
  }

  return res.json() as Promise<T>;
}

export { apiFetch, API_BASE_URL };
