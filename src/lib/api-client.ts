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
  withOrganization?: boolean;
}

export const createApiClient = ({
  withAuth = false,
  withOrganization = false,
}: CreateApiClientOptions = {}): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    if (withAuth) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (withOrganization) {
      const organizationId = localStorage.getItem("selectedOrganizationId");
      if (organizationId) {
        config.headers["X-Organization-Id"] = organizationId;
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
      const originalRequest = error.config;

      // Check if error is 401 or has the specific error message and we haven't retried yet
      if (
        (error.response?.status === 401 ||
          error.response?.data?.message === "Invalid or expired token") &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // specific call as requested by user
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update the header for the original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return client(originalRequest);
        } catch (refreshError) {
          // If refresh fails, you might want to logout the user or just reject
          // For now, adhering to instruction to specific logic, but failing effectively means logging out usually
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/auth/login"; // Redirect to login
          return Promise.reject(refreshError);
        }
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
export const authApiClient = createApiClient({ withAuth: true, withOrganization: true });

// Auth + org
export const authOrgApiClient = createApiClient({
  withAuth: true,
  withOrganization: true,
});
