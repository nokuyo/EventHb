// axiosInstance.js
import axios from "axios";
import { getAuth } from "firebase/auth";

// Create an Axios instance pointing to your Express backend
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/", // ✅ UPDATED to Express backend
});

// Request interceptor to attach Firebase token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
