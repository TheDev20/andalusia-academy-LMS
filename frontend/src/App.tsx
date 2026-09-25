import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ScrollToTopOrHash from "./components/common/ScrollToTopOrHash";
import HomePage from "./pages/public/home/HomePage";
import AboutPage from "./pages/public/about/AboutPage";
import ContactPage from "./pages/public/contact/ContactPage";
import AuthPage from "./pages/auth/AuthPage";
import { AppRoute, NavigateFunction, ROUTE_PATHS } from "./types/navigation";
import "./styles.css";

/**
 * Route wrapper that passes onNavigate for backwards compatibility with existing page components.
 */
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
    <BrowserRouter>
      <ScrollToTopOrHash />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<PageWithNavigate Component={HomePage} />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route
            path="about"
            element={<PageWithNavigate Component={AboutPage} />}
          />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<AuthPage page="login" />} />
          <Route path="signup" element={<AuthPage page="signup" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
