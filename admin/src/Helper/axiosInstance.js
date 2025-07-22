import axios from 'axios'
import { toast } from 'sonner'


const BASE_URL = "http://localhost:3000/api/v1/admin"

const adminAxiosInstance = axios.create();
adminAxiosInstance.defaults.baseURL = BASE_URL;
adminAxiosInstance.defaults.withCredentials = true;

export default adminAxiosInstance