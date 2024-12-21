import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002',
  withCredentials: true,
  timeout: 120000, // 2 menit
  maxContentLength: 100 * 1024 * 1024, // 100MB
  maxBodyLength: 100 * 1024 * 1024, // 100MB
});

// Custom method untuk upload file
api.uploadFiles = async (url, formData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios({
      method: 'PUT',
      url: `${api.defaults.baseURL}${url}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : undefined
      },
      withCredentials: true,
      maxContentLength: 100 * 1024 * 1024,
      maxBodyLength: 100 * 1024 * 1024,
      timeout: 120000,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log('Upload progress:', percentCompleted + '%');
      }
    });

    return response;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Tambahkan token jika ada
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Set content type berdasarkan data
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
      // Hapus transformRequest untuk FormData
      delete config.transformRequest;
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    // Log request
    console.log('\n=== API Request ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Headers:', config.headers);
    if (config.data instanceof FormData) {
      console.log('Data: FormData with entries:');
      for (const pair of config.data.entries()) {
        if (pair[0] === 'data') {
          console.log('- data:', JSON.parse(pair[1]));
        } else if (pair[1] instanceof File) {
          console.log(`- ${pair[0]}:`, {
            name: pair[1].name,
            type: pair[1].type,
            size: pair[1].size
          });
        }
      }
    } else {
      console.log('Data:', config.data);
    }
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
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    console.error('Config:', error.config);
    console.error('===================\n');
    return Promise.reject(error);
  }
);

export default api; 