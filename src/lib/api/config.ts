export const env = {
    API_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3009',
    API_VERSION: import.meta.env.VITE_API_VERSION || 'v1',
    API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
};
