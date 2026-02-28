import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  data?: any;
}

export const useApiMutation = <TData, TVariables>(
  mutationFn: (
    client: ReturnType<typeof useAuth>["getAuthenticatedApiClient"],
    variables: TVariables
  ) => Promise<TData>,
  options?: UseMutationOptions<TData, AxiosError<ApiErrorResponse>, TVariables>
) => {
  const { getAuthenticatedApiClient } = useAuth();

  return useMutation({
    mutationFn: (variables: TVariables) =>
      mutationFn(getAuthenticatedApiClient, variables),
    ...options,
  });
};
