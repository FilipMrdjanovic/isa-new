/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from "react";
import { AuthData } from "../../types/types";

export interface AuthContextValue {
    auth: AuthData;
    isAuthenticated: boolean;
    login: (auth: AuthData) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
    auth: {},
    isAuthenticated: false,
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

    const [isAuthenticated, stIsAuthenticated] = useState<boolean>(
        storedAuthData ? true : false
    );

    useEffect(() => {
        const handleCustomEvent = () => {
          console.log('Custom event 401 triggered. Token not recognized - UNAUTHORIZED');
          logout()
        };
    
        document.addEventListener('customEvent401', handleCustomEvent);
    
        return () => {
          document.removeEventListener('customEvent401', handleCustomEvent);
        };
      }, []);

    const login = (auth: AuthData) => {
        setAuth(auth)
        stIsAuthenticated(true)
        localStorage.setItem("authData", JSON.stringify(auth));
    };

    const logout = () => {
        setAuth({});
        stIsAuthenticated(false)
        localStorage.removeItem("authData");
    };

    const authContextValue: AuthContextValue = {
        auth,
        isAuthenticated,
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
