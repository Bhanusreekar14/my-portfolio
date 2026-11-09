import { Routes, Route, useLocation } from "react-router-dom";
import { useState, lazy, Suspense } from "react";

import PortfolioIntro from "./components/PortfolioIntro";
import Portfolio from "./pages/Portfolio";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";

// Lazy-load admin modules to optimize bundle size and load performance
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const ManageProjects = lazy(() => import("./admin/ManageProjects"));
const ManageCertifications = lazy(() => import("./admin/ManageCertifications"));
const ManageSkills = lazy(() => import("./admin/ManageSkills"));
const ManageAbout = lazy(() => import("./admin/ManageAbout"));
const ManageEducation = lazy(() => import("./admin/ManageEducation"));
const ManageSocials = lazy(() => import("./admin/ManageSocials"));
const ManageResume = lazy(() => import("./admin/ManageResume"));
const ManageMessages = lazy(() => import("./admin/ManageMessages"));
const ManageContact = lazy(() => import("./admin/ManageContact"));

function AdminLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f3eedf",
        color: "#171512",
        fontFamily: "'DM Serif Display', serif",
        fontSize: "24px",
      }}
    >
      LOADING ADMIN...
    </div>
  );
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Play full-screen opening 3D perspective tunnel intro once on every fresh website page load
  const [showIntro, setShowIntro] = useState(() => !isAdminRoute);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro && !isAdminRoute) {
    return (
      <PortfolioIntro
        onComplete={handleIntroComplete}
      />
    );
  }

  return (
    <Suspense fallback={<AdminLoading />}>
      <Routes>
        {/* Public Portfolio Routes - Shared persistent animated background */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Portfolio />} />
        </Route>

        {/* Admin Routes - Separate management interface, no animated background */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <ManageProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/certifications"
          element={
            <ProtectedRoute>
              <ManageCertifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <ManageSkills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/about"
          element={
            <ProtectedRoute>
              <ManageAbout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/education"
          element={
            <ProtectedRoute>
              <ManageEducation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/socials"
          element={
            <ProtectedRoute>
              <ManageSocials />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/resume"
          element={
            <ProtectedRoute>
              <ManageResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <ManageMessages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/contact"
          element={
            <ProtectedRoute>
              <ManageContact />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;