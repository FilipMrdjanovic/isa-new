import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Data } from '../types/types';

const REACT_APP_API_KEY = 'http://localhost:8080/api';

const axiosInstance: AxiosInstance = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: REACT_APP_API_KEY,
    withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
    const savedToken = localStorage.getItem('data');
    if (savedToken) {
        const authData = JSON.parse(savedToken);
        const token = authData.token;
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response: AxiosResponse<Data>) => {
        handleResponse(response.data); // Handle the response data
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            console.log('Error response:', error.response);
            handleErrorResponse(error.response.data); // Handle the error response
            if (error.response.status === 401) {
                handleUnauthorized();
            } else if (error.response.status === 403) {
                handleForbidden();
            }
        } else if (error.request) {
            console.log('No response received:', error.request);
            handleServerDown();
        } else {
            console.log('Error setting up the request:', error.message);
            handleServerDown();
        }
        return Promise.reject(error);
    }
);

const handleResponse = (data: Data) => {
    if (data.status === 200) {
        handleRequestSuccess(data.message);
    }
};

const handleUnauthorized = () => {
    document.dispatchEvent(new Event('customEvent401'));
};

const handleForbidden = () => {
    document.dispatchEvent(new Event('customEvent403'));
};

const handleServerDown = () => {
    document.dispatchEvent(new Event('customEventServerDown'));
};

const handleRequestSuccess = (result: any) => {
    console.log(result);
};

const handleErrorResponse = (errorData: any) => {
    console.warn(errorData);
};

export default axiosInstance;
