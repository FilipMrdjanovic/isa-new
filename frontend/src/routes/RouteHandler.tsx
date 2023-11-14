import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../api/auth/AuthContext";
import { AuthRoutes, UnauthRoutes } from "./RoutesConfig";

const RouteHandler = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated ? <AuthRoutes /> : <UnauthRoutes />}
    </Router>
  );
};

export default RouteHandler;

