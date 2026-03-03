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
  id?: string;
  _id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    name: string,
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const saveTokens = useCallback(
    (token: string, user: User) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
    },
    []
  );

  const getAccessToken = useCallback(() => token, [token]);

  // Create API client 
  const getAuthenticatedApiClient = useCallback(() => {
    return createApiClient({ withAuth: true });
  }, [getAccessToken]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      saveTokens(data.token, data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      saveTokens(data.token, data.user);
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
        `/auth/reset-password/${data.token}`,
        {
          password: data.password,
        }
      );
      return response.data;
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: async (data: {
      inviteToken: string;
      password: string;
      name: string;
    }) => {
      const response = await apiClient.post<AuthResponse>(
        "/auth/accept-invite",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      saveTokens(data.token, data.user);
    },
  });

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login: (email, password) =>
          loginMutation.mutateAsync({ email, password }),
        logout,
        register: (email, password, name) =>
          registerMutation.mutateAsync({
            email,
            password,
            name,
          }),
        forgotPassword: (email) => forgotPasswordMutation.mutateAsync(email),
        resetPassword: (reqToken, password) =>
          resetPasswordMutation.mutateAsync({ token: reqToken, password }),
        acceptInvite: (inviteToken, password, name) =>
          acceptInviteMutation.mutateAsync({
            inviteToken,
            password,
            name,
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
