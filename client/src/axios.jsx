import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hostel-backend-3j33.onrender.com/api', // Make sure this matches your backend port
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// // Request interceptor (for debugging)
// api.interceptors.request.use(
//   (config) => {
//     console.log('Making API request:', config.method?.toUpperCase(), config.url);
//     console.log('Request data:', config.data);
//     return config;
//   },
//   (error) => {
//     console.error('Request interceptor error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor (for debugging)
// api.interceptors.response.use(
//   (response) => {
//     console.log('API response received:', response.status, response.data);
//     return response;
//   },
//   (error) => {
//     console.error('API response error:', error.response?.status, error.response?.data);
//     return Promise.reject(error);
//   }
// );

export default api;
