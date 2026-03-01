import React from "react";
import { Navigate } from "react-router-dom";
import {
  useRouteProtection,
  type RoutePermission,
} from "@/hooks/use-route-protection";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: RoutePermission;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  fallback,
}) => {
  const { isLoading, hasAccess, isAuthenticated } =
    useRouteProtection(permission);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 w-full animate-in fade-in-50">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
