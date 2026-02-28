import React from "react";
import { Navigate } from "react-router-dom";
import {
  useRouteProtection,
  type RoutePermission,
} from "@/hooks/use-route-protection";
import { useOrganization } from "@/contexts/organization-context";
import { Loader2 } from "lucide-react";

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
  const { organizationId } = useOrganization();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
