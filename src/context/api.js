import axios from 'axios';
import { getCookie } from './utils';  // Utility functions

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,  // Ensure credentials are sent with requests
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = getCookie('token');
  const csrfToken = getCookie('csrftoken')
  // Do not include the Authorization header for specific endpoints
  if (token && !config.url.includes('/users/signin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle token refresh
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const token = getCookie('token');
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error('Refresh token error:', refreshError);
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
