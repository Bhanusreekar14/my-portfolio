import { Navigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthState();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;