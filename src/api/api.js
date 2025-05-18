import axios from 'axios';

const api = axios.create({
  baseURL: 'http://213.109.146.205:8007/api/',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;