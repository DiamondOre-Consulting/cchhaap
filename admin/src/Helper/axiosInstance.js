import axios from 'axios'
import { toast } from 'sonner'


const BASE_URL = "https://lobster-app-2-pywgp.ondigitalocean.app/api/v1/admin"
// const BASE_URL = "http://localhost:3000/api/v1/admin"


const adminAxiosInstance = axios.create();
adminAxiosInstance.defaults.baseURL = BASE_URL;
adminAxiosInstance.defaults.withCredentials = true;

// Add request interceptor to handle FormData
adminAxiosInstance.interceptors.request.use(
  (config) => {
    // If the data is FormData, don't set Content-Type header
    // Let the browser set it automatically with the boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Attach Authorization header if token exists
adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Capture tokens from auth responses
adminAxiosInstance.interceptors.response.use(
  (response) => {
    const tokens = response?.data?.data?.tokens;
    if (tokens?.accessToken) {
      try {
        localStorage.setItem('adminAccessToken', tokens.accessToken);
        if (tokens.refreshAccessToken) {
          localStorage.setItem('adminRefreshToken', tokens.refreshAccessToken);
        }
      } catch {}
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default adminAxiosInstance