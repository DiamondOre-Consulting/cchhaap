import axios from 'axios'
import { toast } from 'sonner'


const BASE_URL = "https://cchhaap-backend.onrender.com/api/v1/admin"
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

export default adminAxiosInstance