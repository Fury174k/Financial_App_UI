import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { authToken, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return authToken && user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;