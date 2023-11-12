/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";
import { AuthData } from "../../types/authData";

export interface AuthContextValue {
    auth: AuthData;
    login: (auth: AuthData) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
    auth: {},
    login: () => { },
    logout: () => { },
});
type AuthProps = {
    children: React.ReactNode;
};

export const AuthProvider = (props: AuthProps) => {
    const storedAuthData = localStorage.getItem("authData");
    const initialAuthData: AuthData = storedAuthData
        ? JSON.parse(storedAuthData)
        : {};

    const [auth, setAuth] = useState<AuthData>({
        ...initialAuthData,
    });

    const login = (auth: AuthData) => {
        setAuth(auth)
        localStorage.setItem("authData", JSON.stringify(auth));
    };

    const logout = () => {
        setAuth({});
        localStorage.removeItem("authData");
    };
    const authContextValue: AuthContextValue = {
        auth,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  
