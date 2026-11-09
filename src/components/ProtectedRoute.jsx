import { Navigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";

export const ADMIN_UID = "PEJmKG9mp3ahKo0jL77qVMiGLd42";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3eedf",
          fontFamily: "sans-serif",
          fontSize: "14px",
          letterSpacing: "1.5px",
        }}
      >
        CHECKING AUTHORIZATION...
      </div>
    );
  }

  if (!user || user.uid !== ADMIN_UID) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
