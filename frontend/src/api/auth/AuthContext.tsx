/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState, useEffect, SetStateAction } from "react";
import axiosInstance from "../axios";
import { decodeAccessToken } from "../../helpers/decodeAccessToken";

export interface AuthData {
  id?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
}

export interface AuthContextValue {
  auth: AuthData;
  loading: boolean;
  setAuth: React.Dispatch<SetStateAction<AuthData>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  auth: {},
  loading: true,
  setAuth: () => {},
  logout: () => {},
});
type AuthProps = {
  children: React.ReactNode;
};

export const AuthProvider = (props: AuthProps) => {
  const storedAuthData = localStorage.getItem("authData");
  const initialAuthData: AuthData = storedAuthData
    ? JSON.parse(storedAuthData)
    : {};
  const initialDecodedToken = initialAuthData.accessToken
    ? decodeAccessToken(initialAuthData.accessToken)
    : null; // Handle the case when accessToken is undefined or null

  const [auth, setAuth] = useState<AuthData>({
    ...initialAuthData,
  });
  const [loading, setLoading] = useState<boolean>(!initialAuthData.accessToken);

  useEffect(() => {
    if (initialDecodedToken) {
      const { exp } = initialDecodedToken;
      const expirationTime = exp * 1000; // Convert to milliseconds
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        // If the access token is expired, call a function to refresh the token
        refreshAccessToken();
      } else {
        setAuth((prevAuth) => ({
          ...prevAuth,
          id: initialAuthData.id, // Fix the assignment here
        }));
        setLoading(false); // Mark loading as false when the auth data is available
      }
    } else {
      logout(); // Clear auth data if access token is invalid
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const refreshAccessToken = async () => {
    try {
      // Make a POST request to the /refresh-token endpoint
      const response = await axiosInstance.post("/refresh-token", {
        token: auth.accessToken,
      });

      // Extract the new access token from the response
      const { access_token: newAccessToken, refresh_token: newRefreshToken } =
        response.data;

      // Save specific data to local storage
      const storedAuthDataString = localStorage.getItem("authData");
      if (storedAuthDataString) {
        const storedAuthData = JSON.parse(storedAuthDataString);

        storedAuthData.accessToken = newAccessToken;
        storedAuthData.refreshToken = newRefreshToken;

        localStorage.setItem("authData", JSON.stringify(storedAuthData));
        if (newAccessToken) {
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        }
      }
    } catch (error) {
      // Handle errors if the token refresh request fails
      console.error("Token refresh failed:", error);
      // You can redirect to the login page or perform other actions here
    }
  };
  const updateAuthData: AuthContextValue["setAuth"] = (data) => {
    if (Object.keys(data).length === 0) {
      localStorage.removeItem("authData");
    } else {
      setAuth(data);
      localStorage.setItem("authData", JSON.stringify(data));
    }
  };

  const logout = () => {
    setAuth({});
    setLoading(false);
    localStorage.removeItem("authData");
  };
  const authContextValue: AuthContextValue = {
    auth,
    loading, // Pass the loading state to the context value
    setAuth: updateAuthData,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && props.children}{" "}
    </AuthContext.Provider>
  );
};
