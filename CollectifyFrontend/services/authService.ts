import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5251', 
  timeout: 10000,
  httpsAgent: {
    rejectUnauthorized: false, 
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/account/login', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error logging in', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/account/register', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error signing up', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!refreshToken || !accessToken) {
      throw new Error('No tokens stored.');
    }

    const response = await api.post('/api/account/refresh', {
      accessToken,
      refreshToken,
    });

    const newTokens = response.data;

    await SecureStore.setItemAsync('accessToken', newTokens.accessToken);
    await SecureStore.setItemAsync('refreshToken', newTokens.refreshToken);

    return newTokens.accessToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        alert('Session expired. Please log in again.');
      }
    } else {
      console.error('Error during token refresh:', error);
    }

    throw error;
  }
};
  