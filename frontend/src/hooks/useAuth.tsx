// useAuth.tsx
import { useContext } from "react";
import { AuthContextValue, AuthContext } from "../api/auth/AuthContext";

const useAuth = (): AuthContextValue => {
  const { auth, loading, setAuth, logout } = useContext(AuthContext);

  // Check if loading is true, then auth data is not yet available
  if (loading) {
    // You can return a loading state, render a spinner, etc.
    return { auth: {}, loading: true, setAuth, logout };
  }

  // If not loading, return the auth data, the logout function, and the role
  return { auth, loading, setAuth, logout };
};

export default useAuth;
