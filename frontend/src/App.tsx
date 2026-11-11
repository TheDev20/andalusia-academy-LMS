import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AppRoute, NavigateFunction, ROUTE_PATHS } from "./types/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ApiError } from "./services/api/httpClient";
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ScrollToTopOrHash from "./components/common/ScrollToTopOrHash";
import HomePage from "./pages/public/home/HomePage";
import AboutPage from "./pages/public/about/AboutPage";
import ContactPage from "./pages/public/contact/ContactPage";
import CoursesPage from "./pages/public/courses/CoursesPage";
import AuthPage from "./pages/auth/AuthPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./styles.css";

// Routes that need a sign-in or sit deep in the catalogue are split into their own chunks.
const SyllabusPage = lazy(() => import("./pages/public/courses/SyllabusPage"));
const ProgramDetailsPage = lazy(() => import("./pages/public/program-details/ProgramDetailsPage"));
const CareerPathDetailsPage = lazy(() => import("./pages/public/career-paths/CareerPathDetailsPage"));
const DashboardPage = lazy(() => import("./pages/learner/DashboardPage"));
const CourseLearningPage = lazy(() => import("./pages/learner/CourseLearningPage/CourseLearningPage"));
const ProfilePage = lazy(() => import("./pages/account/ProfilePage"));
const InstructorDashboardPage = lazy(() => import("./pages/instructor/InstructorDashboardPage"));
const CohortPage = lazy(() => import("./pages/instructor/CohortPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminOfferingPage = lazy(() => import("./pages/admin/AdminOfferingPage"));

// Level 1: Client Query Cache (RFC Option B - 5 min staleTime matching backend IMemoryCache)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      // Never retry authorization or validation failures; retry transient errors once.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 1,
    },
  },
});

function PageWithNavigate({
  Component,
}: {
  Component: React.ComponentType<{ onNavigate?: NavigateFunction }>;
}) {
  const navigate = useNavigate();
  const handleNavigate: NavigateFunction = (route: AppRoute) => {
    navigate(ROUTE_PATHS[route] || `/${route}`);
  };
  return <Component onNavigate={handleNavigate} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTopOrHash />

          <Suspense
            fallback={
              <div role="status" aria-live="polite" style={{ padding: "48px 16px", textAlign: "center" }}>
                Loading…
              </div>
            }
          >
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<PageWithNavigate Component={HomePage} />} />
              <Route path="home" element={<Navigate to="/" replace />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:courseId/syllabus" element={<SyllabusPage />} />
              <Route path="programs" element={<Navigate to="/courses?tab=programs" replace />} />
              <Route path="programs/:slug" element={<ProgramDetailsPage />} />
              <Route path="career-paths" element={<Navigate to="/courses?tab=career-paths" replace />} />
              <Route path="career-paths/:slug" element={<CareerPathDetailsPage />} />
              <Route path="about" element={<PageWithNavigate Component={AboutPage} />} />
              <Route path="contact" element={<ContactPage />} />

              {/* Any signed-in user */}
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Learner LMS */}
              <Route element={<ProtectedRoute allowedRoles={["Learner"]} />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="learn/:courseOfferingId" element={<CourseLearningPage />} />
              </Route>

              {/* Instructor dashboard (Admins may run any cohort) */}
              <Route element={<ProtectedRoute allowedRoles={["Instructor", "Admin"]} />}>
                <Route path="instructor" element={<InstructorDashboardPage />} />
                <Route path="instructor/cohorts/:offeringId" element={<CohortPage />} />
              </Route>

              {/* Admin / Manager dashboard (Content Managers see the course tab only) */}
              <Route element={<ProtectedRoute allowedRoles={["Admin", "ContentManager"]} />}>
                <Route path="admin" element={<AdminDashboardPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                <Route path="admin/offerings/:offeringId" element={<AdminOfferingPage />} />
              </Route>
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="login" element={<AuthPage page="login" />} />
              <Route path="signup" element={<AuthPage page="signup" />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
