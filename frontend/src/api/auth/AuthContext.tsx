/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from "react";
import { AuthData } from "../../types/types";
import { toast } from "react-toastify";
import axiosInstance from "../axios";
import axios from "axios";
import Loader from "../../components/loader/Loader";

export interface AuthContextValue {
    auth: AuthData;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    refreshToken: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
    auth: {
        token: "",
        id: 0,
        role: "",
    },
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
    refreshToken: () => { },
});

type AuthProps = {
    children: React.ReactNode;
};

export const AuthProvider = (props: AuthProps) => {
    const storedAuthData = localStorage.getItem("data");
    const initialAuthData: AuthData = storedAuthData
        ? JSON.parse(storedAuthData)
        : {};

    const [auth, setAuth] = useState<AuthData>({
        ...initialAuthData,
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        storedAuthData ? true : false
    );

    const [isLoading, setIsLoading] = useState<boolean>(false); // State to manage loader visibility


    const login = async (token: string) => {
        setIsAuthenticated(true)
        axios.get("http://localhost:8080/api/user/user-data", {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
                withCredentials: false,
            }
        })
            .then((response: any) => {
                setAuth({
                    token: token,
                    id: response.data.id,
                    role: response.data.role,
                })
                localStorage.setItem("data", JSON.stringify({
                    token: token,
                    id: response.data.id,
                    role: response.data.role,
                }));
            })
            .catch(error => {
                toast.error(error.message)
            });
    };

    const logout = () => {
        setAuth({ token: "", id: 0, role: "" });
        setIsAuthenticated(false)
        localStorage.removeItem("data");
    };

    const refreshToken = () => {
        const token = auth.token;
        axiosInstance.post(`/auth/refresh-token?token=${token}`)
            .then(response => {
                if (response.data.status === 200) {
                    const newToken = response.data.newToken;
                    setAuth((oldData) => ({
                        ...oldData,
                        token: newToken,
                    }));
                    localStorage.setItem("data", JSON.stringify({
                        ...auth, // Retain other auth properties
                        token: newToken, // Update only the token in localStorage
                    }));
                }
            })
            .catch(error =>
                console.log("Error refreshing token: ", error.data.message)
            )
    };
    useEffect(() => {
        const handleCustomEvent401 = () => {
            console.log('Custom event 401 triggered. Token not recognized - UNAUTHORIZED');
            logout()
        };

        const handleCustomEvent403 = () => {
            console.log('Custom event 403 triggered. Token Expired - FORBIDDEN');
            refreshToken()
        };

        const handleCustomEvent500 = () => {
            console.log('Custom event 500 triggered. Internal Error - SERVER_ERROR');
        };

        const serverDown = () => {
            logout();
            console.log('Custom event serverDown. SERVER NOT RUNNING');
            toast.error("Server is not currently available")
        };

        const handleLoadingStart = () => {
            setIsLoading(true); // Show loader when any request starts
        };

        const handleLoadingEnd = () => {
            setIsLoading(false); // Hide loader when all requests are completed
        };

        document.addEventListener('customEvent401', handleCustomEvent401);
        document.addEventListener('customEvent403', handleCustomEvent403);
        document.addEventListener('customEvent500', handleCustomEvent500);
        document.addEventListener('customEventServerDown', serverDown);

        document.addEventListener('customEventLoadingStart', handleLoadingStart);
        document.addEventListener('customEventLoadingEnd', handleLoadingEnd);


        return () => {
            document.removeEventListener('customEvent401', handleCustomEvent401);
            document.removeEventListener('customEvent403', handleCustomEvent403);
            document.removeEventListener('customEventServerDown', serverDown);

            document.removeEventListener('customEventLoadingStart', handleLoadingStart);
            document.removeEventListener('customEventLoadingEnd', handleLoadingEnd);
        };
    }, [])


    const authContextValue: AuthContextValue = {
        auth,
        isAuthenticated,
        login,
        logout,
        refreshToken
    };

    return (
        <>
            {isLoading && <Loader />}
            <AuthContext.Provider value={authContextValue}>
                {props.children}
            </AuthContext.Provider>
        </>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
