import axios from 'axios';
import { env } from './config';

const apiClientWallet = axios.create({
    baseURL: env.API_URL_WALLET+'/'+env.API_VERSION,
    timeout: env.API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Required if using credentials/cookies
});

/* Add request interceptor for CORS preflight */
apiClientWallet.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* Enhanced error handling in response interceptor */
apiClientWallet.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            /* Server responded with error status */
            console.error('Server Error:', error.response.status, error.response.data);
        } else if (error.request) {
            /* Request made but no response (CORS issues often show up here) */
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClientWallet;