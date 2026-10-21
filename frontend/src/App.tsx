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
import SyllabusPage from "./pages/public/courses/SyllabusPage";
import ProgramsPage from "./pages/public/programs/ProgramsPage";
import ProgramDetailsPage from "./pages/public/program-details/ProgramDetailsPage";
import CareerPathsPage from "./pages/public/career-paths/CareerPathsPage";
import CareerPathDetailsPage from "./pages/public/career-paths/CareerPathDetailsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardPage from "./pages/learner/DashboardPage";
import CourseLearningPage from "./pages/learner/CourseLearningPage/CourseLearningPage";
import ProfilePage from "./pages/account/ProfilePage";
import InstructorDashboardPage from "./pages/instructor/InstructorDashboardPage";
import CohortPage from "./pages/instructor/CohortPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOfferingPage from "./pages/admin/AdminOfferingPage";
import "./styles.css";

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

          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<PageWithNavigate Component={HomePage} />} />
              <Route path="home" element={<Navigate to="/" replace />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:courseId/syllabus" element={<SyllabusPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="programs/:slug" element={<ProgramDetailsPage />} />
              <Route path="career-paths" element={<CareerPathsPage />} />
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
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
