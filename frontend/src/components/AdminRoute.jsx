import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <h1>Checking credentials...</h1>
      </div>
    );
  }

  // Check if user exists and has admin role
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
