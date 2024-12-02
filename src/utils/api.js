import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backendmediaupload.onrender.com/api',  // Your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add Authorization token in the header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Add JWT token if available
  }
  return config;
});

export default API;
