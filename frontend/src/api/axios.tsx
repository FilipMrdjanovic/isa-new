import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Data } from '../types/types';
import { toast } from 'react-toastify';

const REACT_APP_API_KEY = 'http://localhost:8080/api';

const axiosInstance: AxiosInstance = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: REACT_APP_API_KEY,
    withCredentials: false,
});

let activeRequests = 0; // Track the number of active requests


axiosInstance.interceptors.request.use((config) => {
    activeRequests++; // Increment active requests counter
    const savedToken = localStorage.getItem('data');
    if (savedToken) {
        const authData = JSON.parse(savedToken);
        const token = authData.token;
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (activeRequests > 0)
        handleCustomEventLoadingStart()
    return config;
});

axiosInstance.interceptors.response.use(
    (response: AxiosResponse<Data>) => {
        handleResponse(response.data); // Handle the response data
        activeRequests--; // Decrement active requests counter
        if (activeRequests === 0)
            handleCustomEventLoadingEnd()
        return response;
    },
    (error: AxiosError<Data>) => {
        if (error.response) {
            activeRequests--; // Decrement active requests counter
            if (activeRequests === 0)
                handleCustomEventLoadingEnd()
            console.log('Error response:', error.response);
            handleErrorResponse(error.response.data); // Handle the error response
            if (error.response.status === 401)
                handleUnauthorized();
            else if (error.response.status === 403)
                handleForbidden();
            else if (error.response.status === 500) {
                if (error.response.data.message.includes("JWT expired"))
                    handleForbidden();
                else if (error.response.data.message.includes("Invalid token"))
                    handleUnauthorized();
                else
                    handleServerError();
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
    var message = data.message;
    if (data.status === 200) {
        handleRequestSuccess(data.message);
    }
    else {
        handleRequestFailed(data.message)
        if (message.includes("JWT expired"))
            handleForbidden();
        if (message.includes("Invalid token"))
            handleUnauthorized();
    }
};

const handleUnauthorized = () => {
    document.dispatchEvent(new Event('customEvent401'));
};

const handleForbidden = () => {
    document.dispatchEvent(new Event('customEvent403'));
};
const handleRequestFailed = (message: string) => {
    toast.warn(message)
}

const handleServerError = () => {
    document.dispatchEvent(new Event('customEvent500'));
}

const handleServerDown = () => {
    document.dispatchEvent(new Event('customEventServerDown'));
};

const handleRequestSuccess = (result: any) => {
    console.log(result);
};

const handleErrorResponse = (errorData: any) => {
    console.warn(errorData);
};

const handleCustomEventLoadingStart = () => {
    document.dispatchEvent(new Event('customEventLoadingStart'));
}

const handleCustomEventLoadingEnd = () => {
    document.dispatchEvent(new Event('customEventLoadingEnd'));
}
export default axiosInstance;
