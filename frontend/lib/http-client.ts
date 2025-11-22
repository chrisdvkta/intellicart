import { API_BASE_URL } from "./config";

export interface HttpClient {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T, B = unknown>(path: string, body?: B, init?: RequestInit): Promise<T>;
  put<T, B = unknown>(path: string, body?: B, init?: RequestInit): Promise<T>;
  patch<T, B = unknown>(path: string, body?: B, init?: RequestInit): Promise<T>;
  delete<T>(path: string, init?: RequestInit): Promise<T>;
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class FetchHttpClient implements HttpClient {
  constructor(
    private readonly baseUrl: string = API_BASE_URL,
    private readonly token?: string
  ) {}

  async get<T>(path: string, init?: RequestInit) {
    return this.request<T>("GET", path, undefined, init);
  }

  async post<T, B = unknown>(path: string, body?: B, init?: RequestInit) {
    return this.request<T>("POST", path, body, init);
  }

  async put<T, B = unknown>(path: string, body?: B, init?: RequestInit) {
    return this.request<T>("PUT", path, body, init);
  }

  async patch<T, B = unknown>(path: string, body?: B, init?: RequestInit) {
    return this.request<T>("PATCH", path, body, init);
  }

  async delete<T>(path: string, init?: RequestInit) {
    return this.request<T>("DELETE", path, undefined, init);
  }

  private async request<T>(
    method: Method,
    path: string,
    body?: unknown,
    init?: RequestInit
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers,
      cache: "no-store",
      ...init,
    });

    if (!res.ok) {
      const message = await this.safeParseError(res);
      throw new Error(message);
    }

    if (res.status === 204) {
      // @ts-expect-error allow returning void for deletes
      return undefined;
    }

    return res.json() as Promise<T>;
  }

  private async safeParseError(res: Response) {
    try {
      const data = await res.json();
      return data.detail || data.error || res.statusText;
    } catch (error) {
      return res.statusText || "Request failed";
    }
  }
}

export const createClient = (token?: string) => new FetchHttpClient(API_BASE_URL, token);
