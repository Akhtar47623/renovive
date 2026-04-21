export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

const TOKEN_KEY = "renovive_access_token";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

type ApiError = { error: string };

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await readJson<ApiError>(res).catch(() => ({ error: res.statusText }));
    throw new Error(body?.error || res.statusText);
  }

  return readJson<T>(res);
}

export async function apiFetchForm<T>(path: string, form: FormData): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: form,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      // Do NOT set content-type here; browser will set multipart boundary.
    },
  });

  if (!res.ok) {
    const body = await readJson<ApiError>(res).catch(() => ({ error: res.statusText }));
    throw new Error(body?.error || res.statusText);
  }

  return readJson<T>(res);
}

