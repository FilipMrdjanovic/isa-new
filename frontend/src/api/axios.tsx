import axios from 'axios';

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

export default axiosInstance;
