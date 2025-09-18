import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Webinars from "./pages/webinars/Webinars";
import Mentorship from "./pages/mentorship/Mentorship";
import Jobs from "./pages/jobs/Jobs";
import Reports from "./pages/reports/Reports";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";

/**
 * PUBLIC_INTERFACE
 * Protect routes by role(s). Redirects unauthorized users to login or dashboard.
 */
function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

/**
 * PUBLIC_INTERFACE
 * Main App component, sets up providers and routing.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["student", "alumni", "admin", "placement", "mentor"]}>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/webinars"
            element={
              <ProtectedRoute roles={["student", "alumni", "admin", "mentor"]}>
                <AppLayout>
                  <Webinars />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentorship"
            element={
              <ProtectedRoute roles={["student", "alumni", "mentor", "admin"]}>
                <AppLayout>
                  <Mentorship />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute roles={["student", "alumni", "placement", "admin"]}>
                <AppLayout>
                  <Jobs />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={["admin", "placement"]}>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["student", "alumni", "admin", "placement", "mentor"]}>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
