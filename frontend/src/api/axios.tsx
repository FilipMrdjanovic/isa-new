import axios from "axios";


const axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: process.env.REACT_APP_API,
  withCredentials: false,
});

// Add an interceptor to include the JWT token in the request headers
axiosInstance.interceptors.request.use((config) => {
  const authDataString = localStorage.getItem("authData");
  if (authDataString) {
    const authData = JSON.parse(authDataString);
    const token = authData.accessToken; // Use the correct key "accessToken" to get the token
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
