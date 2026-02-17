import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api', // Matches user request
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session cookies if used
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        // Handle 401 Unauthorized - Clear session and redirect to login
        if (response && response.status === 401) {
            localStorage.removeItem('token');
            // Ideally use a custom event or router navigation here if outside React component
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Handle 403 Forbidden - Access Denied (UI should handle this gracefully, but we log here)
        if (response && response.status === 403) {
            console.error('Access Denied: You do not have permission to perform this action.');
        }

        return Promise.reject(error);
    }
);

export default api;
