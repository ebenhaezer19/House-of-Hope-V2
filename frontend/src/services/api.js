import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002',
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (!config.url.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }
    
    console.log('\n=== API Request ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    console.log('===================\n');
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('\n=== API Response ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('===================\n');
    return response;
  },
  (error) => {
    console.error('\n=== API Error ===');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Config:', error.config);
    console.error('===================\n');
    return Promise.reject(error);
  }
);

export default api; 