import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../scss/protected-route.scss";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="protected-loading">
        <div>Loading...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
