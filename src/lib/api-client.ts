import axios, { type AxiosInstance, type AxiosResponse } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
}

interface CreateApiClientOptions {
  withAuth?: boolean;
}

export const createApiClient = ({
  withAuth = false,
}: CreateApiClientOptions = {}): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    if (withAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  client.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      if (response.data && response.data.data !== undefined) {
        return {
          ...response,
          data: response.data.data,
        };
      }
      return response;
    },
    async (error) => {
      if (error.response?.status === 401 || error.response?.data?.message === "Invalid or expired token") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (error.response?.data) {
        const apiError = error.response.data as ApiResponse;
        error.message = apiError.message || error.message;
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Public (no auth)
export const apiClient = createApiClient();

// Auth only // same below
export const authApiClient = createApiClient({ withAuth: true });