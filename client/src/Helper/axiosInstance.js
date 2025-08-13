import axios from 'axios'
import { toast } from 'sonner'


const BASE_URL = "https://lobster-app-2-pywgp.ondigitalocean.app/api/v1/user"
// const BASE_URL = "http://localhost:3000/api/v1/user"

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

// Add request interceptor to handle FormData
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userAccessToken') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Capture tokens from auth responses
axiosInstance.interceptors.response.use(
  (response) => {
    const tokens = response?.data?.data?.tokens;
    if (tokens?.accessToken) {
      try {
        localStorage.setItem('userAccessToken', tokens.accessToken);
        if (tokens.refreshAccessToken) {
          localStorage.setItem('userRefreshToken', tokens.refreshAccessToken);
        }
      } catch {}
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance