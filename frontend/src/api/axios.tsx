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

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.log('Error response:', error.response);
            if (error.response.status === 401) {
                handleUnauthorized();
            }
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error setting up the request:', error.message);
        }
        return Promise.reject(error);
    }
);

const handleUnauthorized = () => {
    document.dispatchEvent(new Event('customEvent401'));
};


export default axiosInstance;
