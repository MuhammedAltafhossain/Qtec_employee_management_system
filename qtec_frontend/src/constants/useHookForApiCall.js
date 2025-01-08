import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';

const useApi = () => {
    const navigate = useNavigate();
    const makeRequest = async (config) => {
        try {
            const response = await axiosInstance(config);
             return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('access_token'); // Remove token on unauthorized access
                navigate('/login'); // Redirect to login
            }
            throw error; // Rethrow the error for further handling if needed
        }
    };

    return makeRequest;
};

export default useApi;
