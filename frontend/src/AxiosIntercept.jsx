// axiosInstance.js
import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Create an Axios instance with your backend's base URL
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Updated URL
  });

// Request interceptor to attach Firebase token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth(); // Get the Firebase Auth instance
    const user = auth.currentUser; // Get the currently logged in user

    if (user) {
      // Retrieve the ID token for the user
      const token = await user.getIdToken();
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle any errors that occur while setting up the request
    return Promise.reject(error);
  }
);

export default axiosInstance;
