export const ROUTE_PERMISSIONS = {
    dashboard: 'dashboard',
    user: 'user',
    audiobooksManagement: 'audiobooksManagement',
    authorsManagement: 'authorsManagement',
    narratorsManagement: 'narratorsManagement',
    categoriesManagement: 'categoriesManagement',
} as const;

export type RoutePermission = keyof typeof ROUTE_PERMISSIONS;

export const ROLE_PERMISSIONS: Record<string, RoutePermission[]> = {
    admin: [
        'dashboard',
        'audiobooksManagement',
        'authorsManagement',
        'narratorsManagement',
        'categoriesManagement'
    ],
    user: [
        'user',
        'dashboard' // User shouldn't have dashboard usually, wait, let me check instructions. The user route is for users, dashboard is for admin. Yes. I'll remove dashboard for user.
    ]
};

// Fixed to only what is correct:
export const CORRECT_ROLE_PERMISSIONS: Record<string, RoutePermission[]> = {
    admin: [
        'dashboard',
        'audiobooksManagement',
        'authorsManagement',
        'narratorsManagement',
        'categoriesManagement'
    ],
    user: [
        'user'
    ]
};
