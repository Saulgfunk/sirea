import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = 'sirea_auth_token';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string | null): Promise<void> {
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean; // attach the stored bearer token — defaults to true
};

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is not set — see apps/mobile/.env.example');
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth !== false) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message = typeof data?.error === 'string' ? data.error : `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }
  return data as T;
}

// Separate from api() because multipart bodies can't be JSON.stringify'd and
// must NOT set an explicit Content-Type (fetch needs to set its own boundary).
export async function uploadFile(uri: string, filename: string, mimeType: string): Promise<{ url: string }> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is not set — see apps/mobile/.env.example');
  }
  const token = await getToken();
  const form = new FormData();
  // React Native's fetch accepts this {uri, name, type} shape for file fields,
  // unlike web FormData which expects a Blob/File — do not "fix" this to match
  // browser conventions.
  form.append('file', { uri, name: filename, type: mimeType } as unknown as Blob);

  const res = await fetch(`${API_URL}/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(res.status, typeof data?.error === 'string' ? data.error : 'Upload failed');
  }
  return data;
}
