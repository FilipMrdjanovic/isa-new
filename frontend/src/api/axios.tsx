import axios from 'axios';
import { useAuth } from './auth/AuthContext';

const REACT_APP_API_KEY = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: REACT_APP_API_KEY,
    withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
        const authData = JSON.parse(authDataString);
        const token = authData.accessToken;
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const { setUnauthorized } = useAuth();
            setUnauthorized(true);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
