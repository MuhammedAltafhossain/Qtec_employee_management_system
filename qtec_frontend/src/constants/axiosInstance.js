import axios from 'axios';
 
// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Fetch the base URL
});

// Add a request interceptor to include the Bearer token in every request
axiosInstance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('access_token'); // Example: fetching token from localStorage

        // if (token) {
        //     config.headers['Authorization'] = `Bearer ${token}`;
        // }

        return config;
    },
    (error) => {
        return Promise.reject(error); // Fixing incorrect error handling
    }
);

export default axiosInstance;
