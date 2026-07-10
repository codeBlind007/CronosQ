import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

let authTokenGetter: (() => Promise<string | null>) | null = null;

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/**
 * Attach Clerk token to every request.
 * Accepts a token getter so this module can be used from both
 * client hooks (via useAuth().getToken) and one-off calls.
 */
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

export function setAuthTokenGetter(
  getToken: (() => Promise<string | null>) | null,
) {
  authTokenGetter = getToken;
}

apiClient.interceptors.request.use(async (config) => {
  if (!authTokenGetter) {
    return config;
  }

  const token = await authTokenGetter();
  const headers = config.headers as Record<string, string | undefined>;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    delete headers.Authorization;
  }

  return config;
});

// Response interceptor — normalise errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  },
);
