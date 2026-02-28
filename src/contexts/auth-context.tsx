import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { apiClient, createApiClient } from "@/lib/api-client";

export interface User {
  id: string;
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "USER";
  organizationId: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (
    token: string,
    password: string
  ) => Promise<{ message: string }>;
  acceptInvite: (
    inviteToken: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<AuthResponse>;
  getAuthenticatedApiClient: () => ReturnType<typeof createApiClient>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedUser) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const saveTokens = useCallback(
    (accessToken: string, refreshToken: string, user: User) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
    },
    []
  );

  const getAccessToken = useCallback(() => accessToken, [accessToken]);
  const getOrganizationId = useCallback(
    () => user?.organizationId || null,
    [user?.organizationId]
  );

  // Create API client with organization context
  const getAuthenticatedApiClient = useCallback(() => {
    return createApiClient({withAuth: true, withOrganization: true});
  }, [getAccessToken, getOrganizationId]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken, data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken, data.user);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post<{ message: string }>(
        "/auth/forgot-password",
        { email }
      );
      return response.data;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const response = await apiClient.post<{ message: string }>(
        "/auth/reset-password",
        {
          token: data.token,
          newPassword: data.password,
        }
      );
      return response.data;
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: async (data: {
      inviteToken: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/accept-invite",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken, data.user);
    },
  });

  const logout = useCallback(() => {
    localStorage.clear();
    // localStorage.removeItem("refreshToken");
    // localStorage.removeItem("user");
    // localStorage.removeItem("selectedOrganizationId");
    // localStorage.removeItem("selectedOrganization");
    // localStorage.removeItem("currentOrganization");
    // localStorage.removeItem("selectedProjectId");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login: (email, password) =>
          loginMutation.mutateAsync({ email, password }),
        logout,
        register: (email, password, firstName, lastName) =>
          registerMutation.mutateAsync({
            email,
            password,
            firstName,
            lastName,
          }),
        forgotPassword: (email) => forgotPasswordMutation.mutateAsync(email),
        resetPassword: (token, password) =>
          resetPasswordMutation.mutateAsync({ token, password }),
        acceptInvite: (inviteToken, password, firstName, lastName) =>
          acceptInviteMutation.mutateAsync({
            inviteToken,
            password,
            firstName,
            lastName,
          }),
        getAuthenticatedApiClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
