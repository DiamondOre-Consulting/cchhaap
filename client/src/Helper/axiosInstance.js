import axios from 'axios'
import { toast } from 'sonner'


const BASE_URL = "https://cchhaap-backend.onrender.com/api/v1/user"

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

export default axiosInstance