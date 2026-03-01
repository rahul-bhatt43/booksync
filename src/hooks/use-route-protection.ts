import { useAuth } from "@/contexts/auth-context";
import { type RoutePermission, CORRECT_ROLE_PERMISSIONS } from "@/lib/route-permissions";

export type { RoutePermission };

export const useRouteProtection = (requiredPermission?: RoutePermission) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    let hasAccess = false;

    if (isAuthenticated && user) {
        if (!requiredPermission) {
            hasAccess = true;
        } else {
            const userPermissions = CORRECT_ROLE_PERMISSIONS[user.role] || [];
            hasAccess = userPermissions.includes(requiredPermission);

            // Admin might implicitly have all access
            if (user.role === 'admin') {
                hasAccess = true;
            }
        }
    }

    return {
        isLoading,
        isAuthenticated,
        hasAccess,
    };
};
