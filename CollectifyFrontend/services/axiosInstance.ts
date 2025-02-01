import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5251', 
  // baseURL: '192.168.100.20',
  timeout: 10000,
  httpsAgent: {
    rejectUnauthorized: false, 
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;