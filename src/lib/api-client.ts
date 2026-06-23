export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

const getBaseUrl = () =>
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL || "https://www.taskoria.com"
    : "";

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export async function apiRequest<T>(
  path: string,
  { body, headers, ...init }: ApiRequestOptions = {}
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message?: unknown }).message)
        : typeof data === "object" && data && "error" in data
          ? String((data as { error?: unknown }).error)
          : "Something went wrong";

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, init?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...init, method: "POST", body }),
  put: <T>(path: string, body?: unknown, init?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...init, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, init?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...init, method: "PATCH", body }),
  delete: <T>(path: string, init?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...init, method: "DELETE" }),
};
