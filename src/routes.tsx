import { createBrowserRouter, Navigate } from "react-router";

// Layouts
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import UserLayout from "./layouts/UserLayout";

// Components
import { ProtectedRoute } from "./components/auth/protected-route";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UnauthorizedPage from "./pages/Unauthorized";

// Auth Pages
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import ResetPasswordPage from "./pages/auth/reset-password";


// Management Pages
import Audiobooks from "./pages/dashboard/audiobooks/index";
import AudiobookPage from "./pages/dashboard/audiobooks/AudiobookPage";
import AudiobookCreate from "./pages/dashboard/audiobooks/AudiobookCreate";
import Authors from "./pages/dashboard/authors/index";
import AuthorPage from "./pages/dashboard/authors/AuthorPage";
import Narrators from "./pages/dashboard/narrators/index";
import NarratorPage from "./pages/dashboard/narrators/NarratorPage";
import Categories from "./pages/dashboard/categories/index";
import CategoryPage from "./pages/dashboard/categories/CategoryPage";
import AppLinks from "./pages/dashboard/app-links";

// User Pages
import UserDiscover from "./pages/user/index";
import UserLibrary from "./pages/user/library";

// Permissions
import { ROUTE_PERMISSIONS } from "./lib/route-permissions";

// Auth guard component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element:
          <PublicRoute>
            <LoginPage />
          </PublicRoute>,
      },
      {
        path: "register-fdgdgd",
        element:
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>,
      },
      {
        path: "forgot-password",
        element:
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>,
      },
      {
        path: "reset-password",
        element:
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.dashboard}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "audiobooks",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.audiobooksManagement}>
                <Audiobooks />
              </ProtectedRoute>
            ),
          },
          {
            path: "audiobooks/create",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.audiobooksManagement}>
                <AudiobookCreate />
              </ProtectedRoute>
            ),
          },
          {
            path: "audiobooks/:audiobookId",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.audiobooksManagement}>
                <AudiobookPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "authors",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.authorsManagement}>
                <Authors />
              </ProtectedRoute>
            ),
          },
          {
            path: "authors/:authorId",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.authorsManagement}>
                <AuthorPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "narrators",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.narratorsManagement}>
                <Narrators />
              </ProtectedRoute>
            ),
          },
          {
            path: "narrators/:narratorId",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.narratorsManagement}>
                <NarratorPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "categories",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.categoriesManagement}>
                <Categories />
              </ProtectedRoute>
            ),
          },
          {
            path: "categories/:categoryId",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.categoriesManagement}>
                <CategoryPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "app-links",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.appLinksManagement}>
                <AppLinks />
              </ProtectedRoute>
            ),
          }
        ],
      },
      {
        path: "user",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.user}>
            <UserLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <UserDiscover />,
          },
          {
            path: "library",
            element: <UserLibrary />,
          }
        ]
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
