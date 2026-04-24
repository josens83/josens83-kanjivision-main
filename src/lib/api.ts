// src/lib/api.ts
// Thin fetch wrapper for the KanjiVision backend.
// - Reads NEXT_PUBLIC_API_URL (falls back to localhost:3001 in dev)
// - Injects Bearer token from localStorage.authToken
// - Auto-redirects to /signin?expired=true on 401 (with a loop guard)
// - Returns a uniform { ok, status, data, error } shape

export const API_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:3001";

export const AUTH_TOKEN_KEY = "authToken";

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    else window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/** Don't trigger a /signin redirect if we're already on an auth page. */
function onAuthRoute(): boolean {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname;
  return p.startsWith("/signin") || p.startsWith("/signup");
}

function handle401(): void {
  writeToken(null);
  if (typeof window === "undefined") return;
  if (onAuthRoute()) return;
  window.location.replace("/signin?expired=true");
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;          // default true — attaches bearer token if available
  skipAuthRedirect?: boolean; // for endpoints like /auth/login where 401 means bad creds
}

export async function api<T = unknown>(
  path: string,
  opts: RequestOptions = {}
): Promise<ApiResult<T>> {
  const {
    body,
    auth = true,
    skipAuthRedirect = false,
    headers,
    method = body !== undefined ? "POST" : "GET",
    ...rest
  } = opts;

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  if (body !== undefined && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = readToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let status = 0;
  try {
    const res = await fetch(url, {
      ...rest,
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    status = res.status;

    if (status === 401 && !skipAuthRedirect) {
      handle401();
      return { ok: false, status, data: null, error: "unauthorized" };
    }

    const ct = res.headers.get("content-type") ?? "";
    const isJson = ct.includes("application/json");
    const payload = isJson ? await res.json().catch(() => null) : await res.text();

    if (!res.ok) {
      const error =
        (isJson && payload && typeof payload === "object" && "error" in payload
          ? String((payload as { error: unknown }).error)
          : null) ||
        (typeof payload === "string" && payload) ||
        `HTTP ${status}`;
      return { ok: false, status, data: null, error };
    }

    return { ok: true, status, data: (payload as T) ?? null, error: null };
  } catch (err) {
    return {
      ok: false,
      status,
      data: null,
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

// Convenience helpers
export const apiGet = <T = unknown>(path: string, opts: RequestOptions = {}) =>
  api<T>(path, { ...opts, method: "GET" });

export const apiPost = <T = unknown>(path: string, body?: unknown, opts: RequestOptions = {}) =>
  api<T>(path, { ...opts, method: "POST", body });

export const apiPut = <T = unknown>(path: string, body?: unknown, opts: RequestOptions = {}) =>
  api<T>(path, { ...opts, method: "PUT", body });

export const apiDelete = <T = unknown>(path: string, opts: RequestOptions = {}) =>
  api<T>(path, { ...opts, method: "DELETE" });

// Token helpers so the store / AuthBoot can touch storage through one module
export const authToken = {
  get: readToken,
  set: writeToken,
  clear: () => writeToken(null),
};
