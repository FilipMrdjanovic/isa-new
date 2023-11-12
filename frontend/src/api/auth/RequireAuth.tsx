// RequireAuth.tsx
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Correct the path to AuthContext if needed

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  const storedAuthData = localStorage.getItem("authData");
  if (!auth && (!storedAuthData || !hasRequiredAuthData(storedAuthData))) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth && auth.accessToken && auth.role && auth.id) {
    if (allowedRoles.includes(auth.role)) {
      return <Outlet />; // Render the nested route components
    }
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

const hasRequiredAuthData = (storedAuthData: any) => {
  try {
    const { accessToken, id, role } = JSON.parse(storedAuthData);
    return accessToken && id && role;
  } catch (error) {
    return false;
  }
};

export default RequireAuth;
