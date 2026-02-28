import { createBrowserRouter, Navigate } from "react-router";

// Layouts
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Components
import { ProtectedRoute } from "./components/auth/protected-route";

// Pages
import Home from "./pages/Home";
import CreateProject from "./pages/CreateProject";
import Dashboard from "./pages/Dashboard";
import AiAssessment from "./pages/AiAssessment";
import FaDetail from "./pages/FaDetail";
import FunctionalAreas from "./pages/FunctionalAreas";
import Invite from "./pages/Invite";
import OrgChart from "./pages/OrgChart";
import ParticipationGroups from "./pages/ParticipationGroups";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import UnauthorizedPage from "./pages/Unauthorized";
import ProjectManagement from "./pages/ProjectManagement";

// Auth Pages
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import ResetPasswordPage from "./pages/auth/reset-password";
import AcceptInvitePage from "./pages/auth/accept-invite";
import CreateOrganizationPage from "./pages/organizations/create-organization";
import OrganizationManagementPage from "./pages/organizations/organization-management";

// Invite Pages
import { CreateInvitePage } from "./pages/invite/create-invite";
// import { AcceptInvitePage as AcceptFounderInvitePage } from "./pages/invite/accept-invite";

// Template Pages
import Templates from "./pages/templates/Templates";
import TemplateDetail from "./pages/templates/TemplateDetail";
import TemplateImport from "./pages/templates/TemplateImport";

// Legal Pages
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";

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
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        path: "terms",
        element: <TermsPage />,
      },
      {
        index: true,
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.dashboard}>
            <Home />
          </ProtectedRoute>
        ),
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
        path: "accept-invite",
        element: <AcceptInvitePage />,
      },
      {
        path: "organization-management",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.organizationManagement}>
            <OrganizationManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-organization",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.createOrganization}>
            <CreateOrganizationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-invite",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.createInvite}>
            <CreateInvitePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "create-project",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.dashboard}>
            <CreateProject />
          </ProtectedRoute>
        ),
      },
      {
        path: "project/:projectId",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.projectManagement}>
            <ProjectManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "templates",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.templates}>
            <Templates />
          </ProtectedRoute>
        ),
      },
      {
        path: "templates/import",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.templates}>
            <TemplateImport />
          </ProtectedRoute>
        ),
      },
      {
        path: "templates/:templateId",
        element: (
          <ProtectedRoute permission={ROUTE_PERMISSIONS.templateDetail}>
            <TemplateDetail />
          </ProtectedRoute>
        ),
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
            path: "ai-assessment",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.aiAssessment}>
                <AiAssessment />
              </ProtectedRoute>
            ),
          },
          {
            path: "fa/:id",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.faDetail}>
                <FaDetail />
              </ProtectedRoute>
            ),
          },
          {
            path: "functional-areas",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.functionalAreas}>
                <FunctionalAreas />
              </ProtectedRoute>
            ),
          },
          {
            path: "invite",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.invite}>
                <Invite />
              </ProtectedRoute>
            ),
          },
          {
            path: "org-chart",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.orgChart}>
                <OrgChart />
              </ProtectedRoute>
            ),
          },
          {
            path: "participation-groups",
            element: (
              <ProtectedRoute
                permission={ROUTE_PERMISSIONS.participationGroups}
              >
                <ParticipationGroups />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.settings}>
                <Settings />
              </ProtectedRoute>
            ),
          },
          {
            path: "tasks",
            element: (
              <ProtectedRoute permission={ROUTE_PERMISSIONS.tasks}>
                <Tasks />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
